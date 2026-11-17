import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type User,
} from 'firebase/auth';
import {
  auth,
  db,
  getStaffProvisionerAuth,
  handleFirestoreError,
  OperationType,
} from './firebase';

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

export const ANALYST_ROSTER = [
  'Eleanor Vance, CFE · Lead Chain Analyst',
  'Edward Camillieri · Managing Director & Principal Investigator',
  'Dr. Henrik Lindqvist · Cross-Chain Attribution Specialist',
  'Claire Beaumont · Law Enforcement Liaison Lead',
] as const;

export const PRIMARY_ADMIN_EMAIL = 'obulo.eric@gmail.com';

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

export interface CaseIntakeRecord {
  id: string;
  caseRef: string;
  lookupToken: string;
  ownerUid: string;
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
  status: CaseStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
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
  clientName?: string;
  clientPhone?: string;
  caseSummary?: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface AdminCaseRecord {
  lookupToken: string;
  intakeId: string | null;
  caseRef: string;
  scamTypeSlug: string;
  lossCategory: LossCategory;
  estimatedLossAmount: number;
  currency: CurrencyCode;
  incidentDate: string;
  platformNames: string;
  reportedAuthorities: string[];
  walletAddresses: string[];
  transactionHashes: string[];
  walletCount: number;
  txHashCount: number;
  narrativeSummary: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  preferredContact: PreferredContact;
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

function sha256FallbackHex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);
  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);

  const W = new Uint32Array(64);
  const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      W[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, W[i - 15]) ^ rotr(18, W[i - 15]) ^ (W[i - 15] >>> 3);
      const s1 = rotr(17, W[i - 2]) ^ rotr(19, W[i - 2]) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  return Array.from(H, (word) => word.toString(16).padStart(8, '0')).join('');
}

export function normalizeCaseRef(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s+/g, '');
}

export async function computeLookupToken(caseRef: string): Promise<string> {
  const normalized = normalizeCaseRef(caseRef);
  if (globalThis.crypto?.subtle) {
    const encoded = new TextEncoder().encode(normalized);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return sha256FallbackHex(normalized);
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
    clientName: contactName.slice(0, 120),
    clientPhone: contactPhone.slice(0, 40),
    caseSummary: buildCaseSummarySnippet(narrativeSummary),
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
  const normalizedRef = normalizeCaseRef(caseRef);

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

  let record = snap.data() as CaseLookupRecord;

  // If a legacy case_lookups document is missing clientName/clientPhone/caseSummary
  // and the signed-in user is staff or the case owner, resolve directly from case_intakes
  // (and backfill canonical case_lookups if staff) so the customer name is never hidden.
  if ((!record.clientName?.trim() || !record.clientPhone?.trim()) && auth.currentUser) {
    try {
      const isStaff = await verifyAdminAccess(auth.currentUser).catch(() => false);
      let intakeData: CaseIntakeRecord | null = null;

      if (isStaff) {
        const intakeSnap = await getDocs(
          query(collection(db, 'case_intakes'), where('caseRef', '==', normalizedRef))
        );
        if (!intakeSnap.empty) {
          intakeData = intakeSnap.docs[0].data() as CaseIntakeRecord;
        }
      } else if (auth.currentUser.emailVerified) {
        const ownerIntakeSnap = await getDocs(
          query(
            collection(db, 'case_intakes'),
            where('ownerUid', '==', auth.currentUser.uid),
            where('caseRef', '==', normalizedRef)
          )
        );
        if (!ownerIntakeSnap.empty) {
          intakeData = ownerIntakeSnap.docs[0].data() as CaseIntakeRecord;
        }
      }

      if (intakeData) {
        const resolvedName = (intakeData.contactName || '').trim().slice(0, 120);
        const resolvedPhone = (intakeData.contactPhone || '').trim().slice(0, 40);
        const resolvedSummary = buildCaseSummarySnippet(intakeData.narrativeSummary);
        record = {
          ...record,
          clientName: record.clientName?.trim() || resolvedName,
          clientPhone: record.clientPhone?.trim() || resolvedPhone,
          caseSummary: record.caseSummary?.trim() || resolvedSummary,
        };
        if (isStaff && (resolvedName || resolvedPhone || resolvedSummary)) {
          updateDoc(doc(db, 'case_lookups', lookupToken), {
            clientName: record.clientName || '',
            clientPhone: record.clientPhone || '',
            caseSummary: record.caseSummary || '',
            updatedAt: serverTimestamp(),
          }).catch(() => undefined);
        }
      }
    } catch {
      // Public anonymous lookups rely on case_lookups directly
    }
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
    record,
    updates,
  };
}

export async function listAuthenticatedUserCases(uid: string): Promise<CaseLookupRecord[]> {
  const path = 'case_lookups';
  try {
    const snap = await getDocs(
      query(collection(db, path), where('ownerUid', '==', uid))
    );
    const rows = snap.docs.map((d) => d.data() as CaseLookupRecord);
    return rows.sort(
      (a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function listAllCaseLookupsForStaff(): Promise<CaseLookupRecord[]> {
  const path = 'case_lookups';
  try {
    const snap = await getDocs(
      query(collection(db, path), orderBy('createdAt', 'desc'))
    );
    const deduped = new Map<string, CaseLookupRecord>();
    snap.docs.forEach((d) => {
      const data = d.data() as CaseLookupRecord;
      const normRef = normalizeCaseRef(data.caseRef || '');
      if (normRef && !deduped.has(normRef)) {
        deduped.set(normRef, { ...data, caseRef: normRef });
      }
    });
    return Array.from(deduped.values());
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

export const STAFF_AUTH_DOMAIN = 'staff.chironinvestigations.co.uk';
export const STAFF_EMAIL_PROVIDER_DISABLED = 'STAFF_EMAIL_PROVIDER_DISABLED';
const STAFF_USERNAME_REGEX = /^[a-z0-9._-]{3,40}$/;

export interface StaffAdminRecord {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  role: 'admin';
  createdByUid: string;
  createdAt: Timestamp | null;
}

export function normalizeStaffUsername(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.includes('@')) {
    const [localPart, domainPart] = trimmed.split('@');
    if (domainPart === STAFF_AUTH_DOMAIN) {
      return localPart;
    }
  }
  return trimmed;
}

export function staffUsernameToEmail(username: string): string {
  const trimmed = username.trim().toLowerCase();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  return `${trimmed}@${STAFF_AUTH_DOMAIN}`;
}

export async function verifyAdminAccess(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (user.emailVerified && user.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL) return true;

  const path = `admins/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    return snap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getStaffProfile(uid: string): Promise<StaffAdminRecord | null> {
  const path = `admins/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    if (!snap.exists()) return null;
    return {
      uid: snap.id,
      ...(snap.data() as Omit<StaffAdminRecord, 'uid'>),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

async function ensureInitialAdminBootstrap(user: User): Promise<void> {
  const adminRef = doc(db, 'admins', user.uid);
  const existingAdmin = await getDoc(adminRef);
  if (existingAdmin.exists()) return;

  const lockRef = doc(db, 'system_meta', 'admin_bootstrap');
  const existingLock = await getDoc(lockRef);
  if (existingLock.exists()) {
    throw new Error('Staff access has not been granted to this account.');
  }

  const batch = writeBatch(db);
  batch.set(adminRef, {
    username: 'admin',
    displayName: 'Primary Staff Administrator',
    email: user.email || `admin@${STAFF_AUTH_DOMAIN}`,
    role: 'admin',
    createdByUid: user.uid,
    createdAt: serverTimestamp(),
  });
  batch.set(lockRef, {
    initializedByUid: user.uid,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admins/${user.uid}`);
  }
}

export async function signInStaffWithUsername(
  rawUsername: string,
  password: string
): Promise<User> {
  const cleanUsername = normalizeStaffUsername(rawUsername);
  if (!cleanUsername || !password) {
    throw new Error('Please enter both your staff username and password.');
  }

  const email = staffUsernameToEmail(cleanUsername);
  let signedInUser: User | null = null;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    signedInUser = cred.user;
  } catch (err) {
    const code = (err as { code?: string })?.code || '';

    if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
      throw new Error(STAFF_EMAIL_PROVIDER_DISABLED);
    }

    const isCredentialMiss =
      code === 'auth/invalid-credential' ||
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password';

    if (isCredentialMiss && cleanUsername === 'admin' && password === 'admin123') {
      try {
        const created = await createUserWithEmailAndPassword(
          auth,
          `admin@${STAFF_AUTH_DOMAIN}`,
          'admin123'
        );
        signedInUser = created.user;
      } catch (createErr) {
        const createCode = (createErr as { code?: string })?.code || '';
        if (
          createCode === 'auth/operation-not-allowed' ||
          createCode === 'auth/admin-restricted-operation'
        ) {
          throw new Error(STAFF_EMAIL_PROVIDER_DISABLED);
        }
        throw new Error('Invalid staff username or password.');
      }
    } else if (code === 'auth/too-many-requests') {
      throw new Error('Too many failed sign-in attempts. Please wait a moment and try again.');
    } else {
      throw new Error('Invalid staff username or password.');
    }
  }

  if (!signedInUser) {
    throw new Error('Unable to establish staff session.');
  }

  if (cleanUsername === 'admin') {
    await ensureInitialAdminBootstrap(signedInUser);
  }

  const hasAccess = await verifyAdminAccess(signedInUser);
  if (!hasAccess) {
    await signOut(auth);
    throw new Error('This account does not have active staff clearance.');
  }

  return signedInUser;
}

export async function listStaffAccounts(): Promise<StaffAdminRecord[]> {
  const path = 'admins';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({
      uid: d.id,
      ...(d.data() as Omit<StaffAdminRecord, 'uid'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createStaffAccount(
  rawUsername: string,
  displayName: string,
  password: string
): Promise<StaffAdminRecord> {
  const activeAdmin = auth.currentUser;
  if (!activeAdmin) {
    throw new Error('You must be signed in as staff to create accounts.');
  }

  const username = normalizeStaffUsername(rawUsername);
  if (!STAFF_USERNAME_REGEX.test(username)) {
    throw new Error(
      'Username must be 3–40 characters using lowercase letters, numbers, dots, underscores, or hyphens.'
    );
  }

  const cleanDisplayName = displayName.trim().slice(0, 80);
  if (cleanDisplayName.length < 2) {
    throw new Error('Display name must be at least 2 characters.');
  }

  if (password.length < 6) {
    throw new Error('Staff password must be at least 6 characters.');
  }

  const email = `${username}@${STAFF_AUTH_DOMAIN}`;
  const secondaryAuth = getStaffProvisionerAuth();

  let newUid: string;
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    newUid = cred.user.uid;
    await signOut(secondaryAuth);
  } catch (err) {
    const code = (err as { code?: string })?.code || '';
    if (code === 'auth/email-already-in-use') {
      throw new Error(`The username "${username}" is already registered.`);
    }
    if (code === 'auth/operation-not-allowed') {
      throw new Error(STAFF_EMAIL_PROVIDER_DISABLED);
    }
    if (code === 'auth/weak-password') {
      throw new Error('Password is too weak. Use at least 6 characters.');
    }
    throw new Error(err instanceof Error ? err.message : 'Unable to create staff credentials.');
  }

  const path = `admins/${newUid}`;
  try {
    await setDoc(doc(db, 'admins', newUid), {
      username,
      displayName: cleanDisplayName,
      email,
      role: 'admin',
      createdByUid: activeAdmin.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  return {
    uid: newUid,
    username,
    displayName: cleanDisplayName,
    email,
    role: 'admin',
    createdByUid: activeAdmin.uid,
    createdAt: null,
  };
}

export async function revokeStaffAccount(uid: string): Promise<void> {
  if (auth.currentUser?.uid === uid) {
    throw new Error('You cannot revoke your own active staff session.');
  }
  const path = `admins/${uid}`;
  try {
    await deleteDoc(doc(db, 'admins', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function changeOwnStaffPassword(newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No active staff session.');
  }
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }
  try {
    await updatePassword(user, newPassword);
  } catch (err) {
    const code = (err as { code?: string })?.code || '';
    if (code === 'auth/requires-recent-login') {
      throw new Error('For security, please sign out and sign back in before changing your password.');
    }
    throw new Error(err instanceof Error ? err.message : 'Unable to update password right now.');
  }
}

const VALID_LOSS_CATEGORIES: LossCategory[] = [
  'crypto',
  'wire',
  'investment',
  'wallet_drain',
  'romance',
  'other',
];
const VALID_CURRENCIES: CurrencyCode[] = ['GBP', 'USD', 'EUR', 'BTC', 'ETH', 'USDT', 'USDC', 'OTHER'];
const VALID_STATUSES: CaseStatus[] = [
  'intake_received',
  'initial_triage',
  'chain_clustering',
  'dossier_ready',
];

export function buildCaseSummarySnippet(narrative: string, maxLen = 320): string {
  const cleaned = (narrative || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen - 1).trimEnd()}…`;
}

async function migrateLegacyCaseLookup(
  canonicalToken: string,
  legacyToken: string | null,
  source: {
    caseRef: string;
    scamTypeSlug?: string;
    lossCategory?: LossCategory;
    estimatedLossAmount?: number;
    currency?: CurrencyCode;
    incidentDate?: string;
    platformNames?: string;
    walletCount?: number;
    txHashCount?: number;
    reportedAuthorities?: string[];
    status?: CaseStatus;
    assignedAnalyst?: string;
    ownerUid?: string;
    clientName?: string;
    clientPhone?: string;
    caseSummary?: string;
    createdAt?: Timestamp | null;
  }
): Promise<void> {
  const normalizedRef = normalizeCaseRef(source.caseRef);
  if (!BLUEPRINT_LIMITS.CASE_REF_REGEX.test(normalizedRef)) return;

  const cleanSlug = (source.scamTypeSlug || 'fake-investment-platforms')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 64);
  const safeSlug = cleanSlug.length >= 3 ? cleanSlug : 'fake-investment-platforms';

  const safeLossCategory = VALID_LOSS_CATEGORIES.includes(source.lossCategory as LossCategory)
    ? (source.lossCategory as LossCategory)
    : 'other';

  const safeCurrency = VALID_CURRENCIES.includes(source.currency as CurrencyCode)
    ? (source.currency as CurrencyCode)
    : 'GBP';

  const safeStatus = VALID_STATUSES.includes(source.status as CaseStatus)
    ? (source.status as CaseStatus)
    : 'intake_received';

  const rawAmount = Number(source.estimatedLossAmount);
  const safeAmount = Number.isFinite(rawAmount)
    ? Math.min(Math.max(rawAmount, 0), 1_000_000_000)
    : 0;

  const rawIncident = (source.incidentDate || '2026-01-01').trim().slice(0, 32);
  const safeIncidentDate = rawIncident.length >= 4 ? rawIncident : '2026-01-01';

  const rawAnalyst = (source.assignedAnalyst || ANALYST_ROSTER[0]).trim().slice(0, 120);
  const safeAnalyst = rawAnalyst.length >= 2 ? rawAnalyst : ANALYST_ROSTER[0];

  const safeAuthorities = sanitizeStringList(
    source.reportedAuthorities || [],
    BLUEPRINT_LIMITS.MAX_AUTHORITIES
  );

  const safeWalletCount = Math.min(Math.max(Math.trunc(source.walletCount || 0), 0), 50);
  const safeTxCount = Math.min(Math.max(Math.trunc(source.txHashCount || 0), 0), 50);

  try {
    await setDoc(doc(db, 'case_lookups', canonicalToken), {
      caseRef: normalizedRef,
      scamTypeSlug: safeSlug,
      lossCategory: safeLossCategory,
      estimatedLossAmount: safeAmount,
      currency: safeCurrency,
      incidentDate: safeIncidentDate,
      platformNames: (source.platformNames || '').slice(0, 300),
      walletCount: safeWalletCount,
      txHashCount: safeTxCount,
      reportedAuthorities: safeAuthorities,
      status: safeStatus,
      assignedAnalyst: safeAnalyst,
      ownerUid: (source.ownerUid || '').slice(0, 128),
      clientName: (source.clientName || '').slice(0, 120),
      clientPhone: (source.clientPhone || '').slice(0, 40),
      caseSummary: (source.caseSummary || '').slice(0, 500),
      createdAt: source.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (legacyToken && legacyToken !== canonicalToken && /^[a-f0-9]{64}$/.test(legacyToken)) {
      const oldUpdatesSnap = await getDocs(collection(db, 'case_lookups', legacyToken, 'updates'));
      const batch = writeBatch(db);
      oldUpdatesSnap.docs.forEach((updDoc) => {
        const upd = updDoc.data() as Omit<CaseUpdateRecord, 'id'>;
        batch.set(doc(db, 'case_lookups', canonicalToken, 'updates', updDoc.id), {
          caseRef: normalizedRef,
          note: (upd.note || 'Evidence update').slice(0, BLUEPRINT_LIMITS.MAX_UPDATE_NOTE_LEN),
          newTransactionHashes: sanitizeStringList(
            upd.newTransactionHashes || [],
            BLUEPRINT_LIMITS.MAX_UPDATE_TX_HASHES
          ),
          submittedByRole: upd.submittedByRole === 'analyst' ? 'analyst' : 'client',
          createdAt: upd.createdAt || serverTimestamp(),
        });
        batch.delete(updDoc.ref);
      });
      batch.delete(doc(db, 'case_lookups', legacyToken));
      await batch.commit();
    }
  } catch {
    // Non-fatal: keep admin queue usable even if a legacy record cannot be auto-migrated
  }
}

export async function listAllAdminCases(): Promise<AdminCaseRecord[]> {
  let intakesSnap;
  try {
    intakesSnap = await getDocs(
      query(collection(db, 'case_intakes'), orderBy('createdAt', 'desc'))
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'case_intakes');
  }

  let lookupsSnap;
  try {
    lookupsSnap = await getDocs(
      query(collection(db, 'case_lookups'), orderBy('createdAt', 'desc'))
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'case_lookups');
  }

  const lookupById = new Map<string, CaseLookupRecord>();
  const lookupEntryByCaseRef = new Map<string, { id: string; data: CaseLookupRecord }>();

  lookupsSnap.docs.forEach((d) => {
    const data = d.data() as CaseLookupRecord;
    lookupById.set(d.id, data);
    const normRef = normalizeCaseRef(data.caseRef || '');
    if (normRef && !lookupEntryByCaseRef.has(normRef)) {
      lookupEntryByCaseRef.set(normRef, { id: d.id, data });
    }
  });

  const handledCaseRefs = new Set<string>();
  const migrationTasks: Promise<void>[] = [];

  const combined: AdminCaseRecord[] = await Promise.all(
    intakesSnap.docs.map(async (d) => {
      const intake = d.data() as Omit<CaseIntakeRecord, 'id'>;
      const normalizedRef = normalizeCaseRef(intake.caseRef);
      const canonicalToken = await computeLookupToken(normalizedRef);
      handledCaseRefs.add(normalizedRef);

      const canonicalLookup = lookupById.get(canonicalToken);
      const legacyByIntakeToken = lookupById.get(intake.lookupToken);
      const legacyByRef = lookupEntryByCaseRef.get(normalizedRef);

      const matchedLookup =
        canonicalLookup ?? legacyByIntakeToken ?? legacyByRef?.data ?? undefined;
      const legacyToken = !canonicalLookup
        ? (legacyByIntakeToken ? intake.lookupToken : legacyByRef?.id ?? null)
        : null;

      const expectedClientName = (intake.contactName || '').trim().slice(0, 120);
      const expectedClientPhone = (intake.contactPhone || '').trim().slice(0, 40);
      const expectedCaseSummary = buildCaseSummarySnippet(intake.narrativeSummary);

      if (!canonicalLookup) {
        migrationTasks.push(
          migrateLegacyCaseLookup(canonicalToken, legacyToken, {
            caseRef: normalizedRef,
            scamTypeSlug: matchedLookup?.scamTypeSlug ?? intake.scamTypeSlug,
            lossCategory: matchedLookup?.lossCategory ?? intake.lossCategory,
            estimatedLossAmount:
              matchedLookup?.estimatedLossAmount ?? intake.estimatedLossAmount,
            currency: matchedLookup?.currency ?? intake.currency,
            incidentDate: matchedLookup?.incidentDate ?? intake.incidentDate,
            platformNames: matchedLookup?.platformNames ?? intake.platformNames,
            walletCount:
              matchedLookup?.walletCount ?? (intake.walletAddresses?.length || 0),
            txHashCount:
              matchedLookup?.txHashCount ?? (intake.transactionHashes?.length || 0),
            reportedAuthorities:
              matchedLookup?.reportedAuthorities ?? intake.reportedAuthorities,
            status: matchedLookup?.status ?? intake.status,
            assignedAnalyst: matchedLookup?.assignedAnalyst ?? ANALYST_ROSTER[0],
            ownerUid: matchedLookup?.ownerUid ?? intake.ownerUid,
            clientName: expectedClientName,
            clientPhone: expectedClientPhone,
            caseSummary: expectedCaseSummary,
            createdAt: matchedLookup?.createdAt ?? intake.createdAt,
          })
        );
      } else if (
        (canonicalLookup.clientName || '') !== expectedClientName ||
        (canonicalLookup.clientPhone || '') !== expectedClientPhone ||
        (canonicalLookup.caseSummary || '') !== expectedCaseSummary
      ) {
        migrationTasks.push(
          updateDoc(doc(db, 'case_lookups', canonicalToken), {
            clientName: expectedClientName,
            clientPhone: expectedClientPhone,
            caseSummary: expectedCaseSummary,
            updatedAt: serverTimestamp(),
          }).catch(() => undefined)
        );
      }

      return {
        lookupToken: canonicalToken,
        intakeId: d.id,
        caseRef: normalizedRef,
        scamTypeSlug: intake.scamTypeSlug,
        lossCategory: intake.lossCategory,
        estimatedLossAmount: intake.estimatedLossAmount,
        currency: intake.currency,
        incidentDate: intake.incidentDate,
        platformNames: intake.platformNames,
        reportedAuthorities: intake.reportedAuthorities || [],
        walletAddresses: intake.walletAddresses || [],
        transactionHashes: intake.transactionHashes || [],
        walletCount: matchedLookup?.walletCount ?? (intake.walletAddresses?.length || 0),
        txHashCount: matchedLookup?.txHashCount ?? (intake.transactionHashes?.length || 0),
        narrativeSummary: intake.narrativeSummary,
        contactName: intake.contactName,
        contactEmail: intake.contactEmail,
        contactPhone: intake.contactPhone,
        preferredContact: intake.preferredContact,
        status: matchedLookup?.status ?? intake.status,
        assignedAnalyst: matchedLookup?.assignedAnalyst ?? ANALYST_ROSTER[0],
        ownerUid: intake.ownerUid || '',
        createdAt: intake.createdAt ?? matchedLookup?.createdAt ?? null,
        updatedAt: matchedLookup?.updatedAt ?? intake.updatedAt ?? null,
      };
    })
  );

  for (const d of lookupsSnap.docs) {
    const lookup = d.data() as CaseLookupRecord;
    const normalizedRef = normalizeCaseRef(lookup.caseRef || '');
    if (!normalizedRef || handledCaseRefs.has(normalizedRef)) continue;
    handledCaseRefs.add(normalizedRef);

    const canonicalToken = await computeLookupToken(normalizedRef);
    if (d.id !== canonicalToken && !lookupById.has(canonicalToken)) {
      migrationTasks.push(
        migrateLegacyCaseLookup(canonicalToken, d.id, {
          ...lookup,
          caseRef: normalizedRef,
        })
      );
    }

    combined.push({
      lookupToken: canonicalToken,
      intakeId: null,
      caseRef: normalizedRef,
      scamTypeSlug: lookup.scamTypeSlug,
      lossCategory: lookup.lossCategory,
      estimatedLossAmount: lookup.estimatedLossAmount,
      currency: lookup.currency,
      incidentDate: lookup.incidentDate,
      platformNames: lookup.platformNames,
      reportedAuthorities: lookup.reportedAuthorities || [],
      walletAddresses: [],
      transactionHashes: [],
      walletCount: lookup.walletCount,
      txHashCount: lookup.txHashCount,
      narrativeSummary: 'Lookup record present without linked confidential intake document.',
      contactName: lookup.clientName || 'Protected / Unavailable',
      contactEmail: '—',
      contactPhone: lookup.clientPhone || '',
      preferredContact: 'email',
      status: lookup.status,
      assignedAnalyst: lookup.assignedAnalyst,
      ownerUid: lookup.ownerUid || '',
      createdAt: lookup.createdAt ?? null,
      updatedAt: lookup.updatedAt ?? null,
    });
  }

  if (migrationTasks.length > 0) {
    await Promise.allSettled(migrationTasks);
  }

  return combined;
}

export async function fetchCaseUpdatesByToken(lookupToken: string): Promise<CaseUpdateRecord[]> {
  const updatesPath = `case_lookups/${lookupToken}/updates`;
  try {
    const updatesSnap = await getDocs(
      query(collection(db, updatesPath), orderBy('createdAt', 'desc'))
    );
    return updatesSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CaseUpdateRecord, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, updatesPath);
  }
}

export async function updateCaseStatusAsAdmin(
  lookupToken: string,
  intakeId: string | null,
  status: CaseStatus,
  assignedAnalyst: string
): Promise<void> {
  const cleanAnalyst = assignedAnalyst.trim().slice(0, 120);
  if (cleanAnalyst.length < 2) {
    throw new Error('Assigned analyst name must be at least 2 characters.');
  }

  const batch = writeBatch(db);
  batch.update(doc(db, 'case_lookups', lookupToken), {
    status,
    assignedAnalyst: cleanAnalyst,
    updatedAt: serverTimestamp(),
  });

  if (intakeId) {
    batch.update(doc(db, 'case_intakes', intakeId), {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `case_lookups/${lookupToken}`);
  }
}

export async function postAnalystCaseNote(
  lookupToken: string,
  caseRef: string,
  note: string,
  rawTxHashes: string[]
): Promise<void> {
  const cleanNote = note.trim().slice(0, BLUEPRINT_LIMITS.MAX_UPDATE_NOTE_LEN);
  if (cleanNote.length < BLUEPRINT_LIMITS.MIN_UPDATE_NOTE_LEN) {
    throw new Error('Please enter at least 3 characters for the analyst note.');
  }

  const newTransactionHashes = sanitizeStringList(
    rawTxHashes,
    BLUEPRINT_LIMITS.MAX_UPDATE_TX_HASHES
  );

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const updateId = `adm_${Date.now()}_${Array.from(bytes, (b) => chars[b % chars.length]).join('')}`;

  const batch = writeBatch(db);
  batch.set(doc(db, 'case_lookups', lookupToken, 'updates', updateId), {
    caseRef: caseRef.trim().toUpperCase(),
    note: cleanNote,
    newTransactionHashes,
    submittedByRole: 'analyst',
    createdAt: serverTimestamp(),
  });

  batch.update(doc(db, 'case_lookups', lookupToken), {
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

export async function deleteCaseAsAdmin(
  lookupToken: string,
  intakeId: string | null
): Promise<void> {
  const updatesPath = `case_lookups/${lookupToken}/updates`;
  let updatesSnap;
  try {
    updatesSnap = await getDocs(collection(db, updatesPath));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, updatesPath);
  }

  const batch = writeBatch(db);
  updatesSnap.docs.forEach((d) => {
    batch.delete(d.ref);
  });
  batch.delete(doc(db, 'case_lookups', lookupToken));
  if (intakeId) {
    batch.delete(doc(db, 'case_intakes', intakeId));
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `case_lookups/${lookupToken}`);
  }
}

