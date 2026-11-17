import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

export type LossCategory = 'crypto' | 'wire' | 'investment' | 'wallet_drain' | 'romance' | 'other';
export type CurrencyCode = 'GBP' | 'USD' | 'EUR' | 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'OTHER';
export type PreferredContact = 'email' | 'phone' | 'encrypted_signal';
export type CaseStatus = 'intake_received' | 'initial_triage' | 'chain_clustering' | 'dossier_ready';

// Synchronized verbatim with firebase-blueprint.json & firestore.rules
export const BLUEPRINT_LIMITS = {
  CASE_REF_REGEX: /^CHR-[0-9]{4}-[A-Z0-9]{4,10}$/,
  SCAM_SLUG_REGEX: /^[a-z0-9-]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_AUTHORITIES: 8,
  MAX_WALLETS: 15,
  MAX_TX_HASHES: 15,
  MAX_UPDATE_TX_HASHES: 10,
  MAX_PLATFORM_LEN: 300,
  MIN_NARRATIVE_LEN: 20,
  MAX_NARRATIVE_LEN: 4000,
  MIN_NAME_LEN: 2,
  MAX_NAME_LEN: 120,
  MAX_EMAIL_LEN: 160,
  MAX_PHONE_LEN: 40,
  MIN_UPDATE_NOTE_LEN: 3,
  MAX_UPDATE_NOTE_LEN: 2000,
} as const;

export interface CaseSubmissionInput {
  scamTypeSlug: string;
  lossCategory: LossCategory;
  estimatedLossAmount: number;
  currency: CurrencyCode;
  incidentDate: string;
  reportedAuthorities: string[];
  walletAddresses: string[];
  transactionHashes: string[];
  platformNames: string;
  narrativeSummary: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  preferredContact: PreferredContact;
  consentAcknowledged: boolean;
}

export interface CaseSubmissionResult {
  caseRef: string;
  lookupToken: string;
}

export interface CaseLookupRecord {
  caseRef: string;
  scamTypeSlug: string;
  lossCategory: LossCategory;
  estimatedLossAmount: number;
  currency: CurrencyCode;
  incidentDate: string;
  platformNames: string;
  walletCount: number;
  txHashCount: number;
  reportedAuthorities: string[];
  status: CaseStatus;
  assignedAnalyst: string;
  ownerUid: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface CaseUpdateRecord {
  id: string;
  caseRef: string;
  note: string;
  newTransactionHashes: string[];
  submittedByRole: 'client' | 'analyst';
  createdAt: Timestamp | null;
}

export interface RecentLocalCase {
  caseRef: string;
  scamTypeSlug: string;
  createdAtIso: string;
}

const RECENT_CASES_KEY = 'chiron_recent_cases_v2';

const ANALYST_ROSTER = [
  'Eleanor Vance, CFE · Lead Chain Analyst',
  'Edward Camillieri · Managing Director & Principal Investigator',
  'Dr. Henrik Lindqvist · Cross-Chain Attribution Specialist',
  'Claire Beaumont · Law Enforcement Liaison Lead',
];

function sanitizeStringList(items: string[], maxItems: number): string[] {
  return items
    .map((item) => item.trim().slice(0, 160))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export function generateCaseReference(): { caseRef: string; intakeId: string } {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomCode = (len: number) => {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => chars[b % chars.length]).join('');
  };
  const year = new Date().getFullYear();
  const suffix = randomCode(8);
  const caseRef = `CHR-${year}-${suffix}`;
  const intakeId = `${caseRef}_${randomCode(6)}`;
  return { caseRef, intakeId };
}

export async function computeLookupToken(caseRef: string): Promise<string> {
  const normalized = caseRef.trim().toUpperCase();
  const encoded = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getRecentLocalCases(): RecentLocalCase[] {
  try {
    const raw = localStorage.getItem(RECENT_CASES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecentLocalCase(entry: RecentLocalCase): void {
  try {
    const current = getRecentLocalCases().filter((c) => c.caseRef !== entry.caseRef);
    const updated = [entry, ...current].slice(0, 5);
    localStorage.setItem(RECENT_CASES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota restrictions
  }
}

export async function submitCaseAssessment(
  input: CaseSubmissionInput
): Promise<CaseSubmissionResult> {
  const { caseRef, intakeId } = generateCaseReference();
  const lookupToken = await computeLookupToken(caseRef);

  const currentUser = auth.currentUser;
  const ownerUid = currentUser && currentUser.emailVerified ? currentUser.uid : '';

  const scamTypeSlug = (input.scamTypeSlug || 'fake-investment-platforms')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 64);

  const reportedAuthorities = sanitizeStringList(
    input.reportedAuthorities,
    BLUEPRINT_LIMITS.MAX_AUTHORITIES
  );
  const walletAddresses = sanitizeStringList(input.walletAddresses, BLUEPRINT_LIMITS.MAX_WALLETS);
  const transactionHashes = sanitizeStringList(
    input.transactionHashes,
    BLUEPRINT_LIMITS.MAX_TX_HASHES
  );

  const platformNames = input.platformNames.trim().slice(0, BLUEPRINT_LIMITS.MAX_PLATFORM_LEN);
  const narrativeSummary = input.narrativeSummary.trim().slice(0, BLUEPRINT_LIMITS.MAX_NARRATIVE_LEN);
  const contactName = input.contactName.trim().slice(0, BLUEPRINT_LIMITS.MAX_NAME_LEN);
  const contactEmail = input.contactEmail.trim().slice(0, BLUEPRINT_LIMITS.MAX_EMAIL_LEN);
  const contactPhone = input.contactPhone.trim().slice(0, BLUEPRINT_LIMITS.MAX_PHONE_LEN);
  const incidentDate = (input.incidentDate || new Date().toISOString().slice(0, 10))
    .trim()
    .slice(0, 32);

  const estimatedLossAmount = Math.min(
    Math.max(Number.isFinite(input.estimatedLossAmount) ? input.estimatedLossAmount : 0, 0),
    1_000_000_000
  );

  if (narrativeSummary.length < BLUEPRINT_LIMITS.MIN_NARRATIVE_LEN) {
    throw new Error('Please provide at least 20 characters describing the incident.');
  }
  if (!BLUEPRINT_LIMITS.EMAIL_REGEX.test(contactEmail)) {
    throw new Error('Please enter a valid contact email address.');
  }
  if (contactName.length < BLUEPRINT_LIMITS.MIN_NAME_LEN) {
    throw new Error('Please enter your name or preferred alias.');
  }
  if (!input.consentAcknowledged) {
    throw new Error('Please acknowledge the confidential assessment terms.');
  }

  const assignedAnalyst =
    ANALYST_ROSTER[Math.abs(caseRef.charCodeAt(caseRef.length - 1)) % ANALYST_ROSTER.length];

  const batch = writeBatch(db);

  const intakeRef = doc(db, 'case_intakes', intakeId);
  batch.set(intakeRef, {
    caseRef,
    lookupToken,
    ownerUid,
    scamTypeSlug,
    lossCategory: input.lossCategory,
    estimatedLossAmount,
    currency: input.currency,
    incidentDate,
    reportedAuthorities,
    walletAddresses,
    transactionHashes,
    platformNames,
    narrativeSummary,
    contactName,
    contactEmail,
    contactPhone,
    preferredContact: input.preferredContact,
    consentAcknowledged: true,
    status: 'intake_received',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const lookupRef = doc(db, 'case_lookups', lookupToken);
  batch.set(lookupRef, {
    caseRef,
    scamTypeSlug,
    lossCategory: input.lossCategory,
    estimatedLossAmount,
    currency: input.currency,
    incidentDate,
    platformNames,
    walletCount: walletAddresses.length,
    txHashCount: transactionHashes.length,
    reportedAuthorities,
    status: 'intake_received',
    assignedAnalyst,
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `case_intakes/${intakeId}`);
  }

  saveRecentLocalCase({
    caseRef,
    scamTypeSlug,
    createdAtIso: new Date().toISOString(),
  });

  return { caseRef, lookupToken };
}

export async function lookupCaseByReference(caseRef: string): Promise<{
  lookupToken: string;
  record: CaseLookupRecord;
  updates: CaseUpdateRecord[];
} | null> {
  const normalizedRef = caseRef.trim().toUpperCase();

  if (!BLUEPRINT_LIMITS.CASE_REF_REGEX.test(normalizedRef)) {
    return null;
  }

  const lookupToken = await computeLookupToken(normalizedRef);
  const path = `case_lookups/${lookupToken}`;

  let snap;
  try {
    snap = await getDoc(doc(db, 'case_lookups', lookupToken));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (!snap.exists()) {
    return null;
  }

  const updatesPath = `case_lookups/${lookupToken}/updates`;
  let updatesSnap;
  try {
    updatesSnap = await getDocs(
      query(collection(db, updatesPath), orderBy('createdAt', 'desc'))
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, updatesPath);
  }

  const updates: CaseUpdateRecord[] = updatesSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<CaseUpdateRecord, 'id'>),
  }));

  return {
    lookupToken,
    record: snap.data() as CaseLookupRecord,
    updates,
  };
}

export async function listAuthenticatedUserCases(uid: string): Promise<CaseLookupRecord[]> {
  const path = 'case_lookups';
  try {
    const snap = await getDocs(
      query(collection(db, path), where('ownerUid', '==', uid), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map((d) => d.data() as CaseLookupRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function appendCaseEvidenceUpdate(
  lookupToken: string,
  caseRef: string,
  note: string,
  rawTxHashes: string[]
): Promise<void> {
  const cleanNote = note.trim().slice(0, BLUEPRINT_LIMITS.MAX_UPDATE_NOTE_LEN);
  if (cleanNote.length < BLUEPRINT_LIMITS.MIN_UPDATE_NOTE_LEN) {
    throw new Error('Please enter at least 3 characters for your update note.');
  }

  const newTransactionHashes = sanitizeStringList(
    rawTxHashes,
    BLUEPRINT_LIMITS.MAX_UPDATE_TX_HASHES
  );

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const updateId = `upd_${Date.now()}_${Array.from(bytes, (b) => chars[b % chars.length]).join('')}`;

  const batch = writeBatch(db);
  const updateDocRef = doc(db, 'case_lookups', lookupToken, 'updates', updateId);
  batch.set(updateDocRef, {
    caseRef: caseRef.trim().toUpperCase(),
    note: cleanNote,
    newTransactionHashes,
    submittedByRole: 'client',
    createdAt: serverTimestamp(),
  });

  const lookupRef = doc(db, 'case_lookups', lookupToken);
  batch.update(lookupRef, {
    txHashCount: increment(newTransactionHashes.length),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `case_lookups/${lookupToken}/updates/${updateId}`
    );
  }
}
