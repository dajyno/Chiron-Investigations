import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  FileText,
  FolderSearch,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MessageSquarePlus,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal } from '../components/MotionPrimitives';
import {
  AccountCasesSkeleton,
  CaseDossierSkeleton,
  EmptyStateCard,
} from '../components/StateFeedback';
import { auth } from '../lib/firebase';
import {
  AdminCaseRecord,
  ANALYST_ROSTER,
  BLUEPRINT_LIMITS,
  CaseStatus,
  CaseUpdateRecord,
  changeOwnStaffPassword,
  createStaffAccount,
  deleteCaseAsAdmin,
  fetchCaseUpdatesByToken,
  getStaffProfile,
  listAllAdminCases,
  listStaffAccounts,
  normalizeStaffUsername,
  postAnalystCaseNote,
  revokeStaffAccount,
  signInStaffWithUsername,
  STAFF_EMAIL_PROVIDER_DISABLED,
  StaffAdminRecord,
  updateCaseStatusAsAdmin,
  verifyAdminAccess,
} from '../lib/caseService';
import { getScamTypeBySlug } from '../data/scamTypesData';

type WorkspaceTab = 'cases' | 'staff';

const STATUS_META: Record<
  CaseStatus,
  { label: string; shortLabel: string; badgeClass: string }
> = {
  intake_received: {
    label: '01. Intake Received',
    shortLabel: 'Intake Received',
    badgeClass: 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]',
  },
  initial_triage: {
    label: '02. Initial Triage',
    shortLabel: 'Initial Triage',
    badgeClass: 'border-[#D4AF37]/60 bg-[#FCF8EA] text-[#946E00]',
  },
  chain_clustering: {
    label: '03. Chain Clustering',
    shortLabel: 'Chain Clustering',
    badgeClass: 'border-[#D4AF37] bg-[#FCF8EA] text-[#0A0A0A]',
  },
  dossier_ready: {
    label: '04. Dossier Ready',
    shortLabel: 'Dossier Ready',
    badgeClass: 'border-[#0A0A0A] bg-[#0A0A0A] text-white',
  },
};

const FILTER_OPTIONS: { key: 'all' | CaseStatus; label: string }[] = [
  { key: 'all', label: 'All Cases' },
  { key: 'intake_received', label: 'Intake Received' },
  { key: 'initial_triage', label: 'Initial Triage' },
  { key: 'chain_clustering', label: 'Chain Clustering' },
  { key: 'dossier_ready', label: 'Dossier Ready' },
];

function formatTimestamp(ts: { toDate?: () => Date } | null): string {
  if (!ts?.toDate) return 'Just now';
  return ts.toDate().toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const AdminPage: React.FC = () => {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [staffProfile, setStaffProfile] = useState<StaffAdminRecord | null>(null);

  // Staff Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [providerDisabledError, setProviderDisabledError] = useState(false);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('cases');

  // Case Queue State
  const [cases, setCases] = useState<AdminCaseRecord[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CaseStatus>('all');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const [updates, setUpdates] = useState<CaseUpdateRecord[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  const [editStatus, setEditStatus] = useState<CaseStatus>('intake_received');
  const [editAnalyst, setEditAnalyst] = useState<string>(ANALYST_ROSTER[0]);
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');

  const [noteText, setNoteText] = useState('');
  const [noteHashesText, setNoteHashesText] = useState('');
  const [postingNote, setPostingNote] = useState(false);
  const [noteFeedback, setNoteFeedback] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingCase, setDeletingCase] = useState(false);

  // Staff Management State
  const [staffList, setStaffList] = useState<StaffAdminRecord[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [showNewStaffPass, setShowNewStaffPass] = useState(false);
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [staffFeedback, setStaffFeedback] = useState('');
  const [staffError, setStaffError] = useState('');
  const [revokeConfirmUid, setRevokeConfirmUid] = useState<string | null>(null);
  const [revokingUid, setRevokingUid] = useState<string | null>(null);

  // Password Update State
  const [ownNewPassword, setOwnNewPassword] = useState('');
  const [ownConfirmPassword, setOwnConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
    } catch {
      // Clipboard API unavailable
    }
  };

  const loadAllCases = useCallback(async () => {
    setLoadingCases(true);
    setLoadError('');
    try {
      const rows = await listAllAdminCases();
      setCases(rows);
      setSelectedToken((prev) => {
        if (prev && rows.some((r) => r.lookupToken === prev)) {
          return prev;
        }
        return rows[0]?.lookupToken ?? null;
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to load submissions from Firestore.';
      setLoadError(
        msg.startsWith('{')
          ? 'Firestore denied access to confidential intakes. Ensure your staff account is active.'
          : msg
      );
    } finally {
      setLoadingCases(false);
    }
  }, []);

  const loadStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const rows = await listStaffAccounts();
      setStaffList(rows);
    } catch {
      setStaffList([]);
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);

      if (!user) {
        setIsAuthorized(false);
        setStaffProfile(null);
        setCheckingRole(false);
        setCases([]);
        setStaffList([]);
        setSelectedToken(null);
        return;
      }

      setCheckingRole(true);
      try {
        const allowed = await verifyAdminAccess(user);
        setIsAuthorized(allowed);
        if (allowed) {
          const profile = await getStaffProfile(user.uid);
          setStaffProfile(profile);
          await Promise.all([loadAllCases(), loadStaff()]);
        } else {
          setStaffProfile(null);
        }
      } catch {
        setIsAuthorized(false);
        setStaffProfile(null);
      } finally {
        setCheckingRole(false);
      }
    });
    return () => unsub();
  }, [loadAllCases, loadStaff]);

  const selectedCase = useMemo(
    () => cases.find((c) => c.lookupToken === selectedToken) ?? null,
    [cases, selectedToken]
  );

  useEffect(() => {
    setConfirmDelete(false);
    setStatusFeedback('');
    setNoteFeedback('');

    if (!selectedCase) {
      setUpdates([]);
      return;
    }

    setEditStatus(selectedCase.status);
    setEditAnalyst(selectedCase.assignedAnalyst || ANALYST_ROSTER[0]);

    let cancelled = false;
    const loadUpdates = async () => {
      setLoadingUpdates(true);
      try {
        const rows = await fetchCaseUpdatesByToken(selectedCase.lookupToken);
        if (!cancelled) {
          setUpdates(rows);
        }
      } catch {
        if (!cancelled) {
          setUpdates([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingUpdates(false);
        }
      }
    };

    loadUpdates();
    return () => {
      cancelled = true;
    };
  }, [selectedCase]);

  const filteredCases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cases.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.caseRef.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q) ||
        item.contactEmail.toLowerCase().includes(q) ||
        item.platformNames.toLowerCase().includes(q) ||
        item.scamTypeSlug.toLowerCase().includes(q) ||
        item.walletAddresses.some((w) => w.toLowerCase().includes(q)) ||
        item.transactionHashes.some((tx) => tx.toLowerCase().includes(q))
      );
    });
  }, [cases, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = cases.length;
    const intake = cases.filter((c) => c.status === 'intake_received').length;
    const activeTriage = cases.filter(
      (c) => c.status === 'initial_triage' || c.status === 'chain_clustering'
    ).length;
    const ready = cases.filter((c) => c.status === 'dossier_ready').length;
    return { total, intake, activeTriage, ready };
  }, [cases]);

  const handleStaffSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setProviderDisabledError(false);
    setSigningIn(true);

    try {
      const signedInUser = await signInStaffWithUsername(loginUsername, loginPassword);
      setLoginPassword('');
      setIsAuthorized(true);
      const profile = await getStaffProfile(signedInUser.uid);
      setStaffProfile(profile);
      await Promise.all([loadAllCases(), loadStaff()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      if (message === STAFF_EMAIL_PROVIDER_DISABLED) {
        setProviderDisabledError(true);
        setAuthError(
          'Email/Password authentication is not enabled in your Firebase project yet. Enable it once in Firebase Console below, then sign in with admin / admin123.'
        );
      } else {
        setAuthError(message);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setSavingStatus(true);
    setStatusFeedback('');
    try {
      await updateCaseStatusAsAdmin(
        selectedCase.lookupToken,
        selectedCase.intakeId,
        editStatus,
        editAnalyst
      );
      setCases((prev) =>
        prev.map((c) =>
          c.lookupToken === selectedCase.lookupToken
            ? { ...c, status: editStatus, assignedAnalyst: editAnalyst }
            : c
        )
      );
      setStatusFeedback(
        `Updated ${selectedCase.caseRef} to ${STATUS_META[editStatus].shortLabel}. Changes are live across all browsers.`
      );
    } catch (err) {
      setStatusFeedback(
        err instanceof Error ? err.message : 'Unable to update case status right now.'
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const handlePostAnalystNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setPostingNote(true);
    setNoteFeedback('');
    try {
      const parsedHashes = noteHashesText
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      await postAnalystCaseNote(
        selectedCase.lookupToken,
        selectedCase.caseRef,
        noteText,
        parsedHashes
      );

      setNoteText('');
      setNoteHashesText('');
      setNoteFeedback('Analyst note published to client dossier timeline.');

      const refreshedUpdates = await fetchCaseUpdatesByToken(selectedCase.lookupToken);
      setUpdates(refreshedUpdates);

      if (parsedHashes.length > 0) {
        setCases((prev) =>
          prev.map((c) =>
            c.lookupToken === selectedCase.lookupToken
              ? { ...c, txHashCount: c.txHashCount + parsedHashes.length }
              : c
          )
        );
      }
    } catch (err) {
      setNoteFeedback(
        err instanceof Error ? err.message : 'Unable to publish analyst note right now.'
      );
    } finally {
      setPostingNote(false);
    }
  };

  const handleDeleteCase = async () => {
    if (!selectedCase) return;
    setDeletingCase(true);
    try {
      await deleteCaseAsAdmin(selectedCase.lookupToken, selectedCase.intakeId);
      const remaining = cases.filter((c) => c.lookupToken !== selectedCase.lookupToken);
      setCases(remaining);
      setSelectedToken(remaining[0]?.lookupToken ?? null);
      setConfirmDelete(false);
    } catch (err) {
      setStatusFeedback(
        err instanceof Error ? err.message : 'Unable to delete case record right now.'
      );
    } finally {
      setDeletingCase(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffFeedback('');
    setStaffError('');
    setCreatingStaff(true);

    try {
      const created = await createStaffAccount(newUsername, newDisplayName, newStaffPassword);
      setNewUsername('');
      setNewDisplayName('');
      setNewStaffPassword('');
      setStaffFeedback(
        `Staff user "${created.username}" (${created.displayName}) created and authorized.`
      );
      await loadStaff();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to create staff account.';
      setStaffError(
        msg === STAFF_EMAIL_PROVIDER_DISABLED
          ? 'Email/Password sign-in must be enabled in Firebase Console before creating staff logins.'
          : msg
      );
    } finally {
      setCreatingStaff(false);
    }
  };

  const handleRevokeStaff = async (uid: string) => {
    setStaffError('');
    setStaffFeedback('');
    setRevokingUid(uid);
    try {
      await revokeStaffAccount(uid);
      setStaffList((prev) => prev.filter((s) => s.uid !== uid));
      setRevokeConfirmUid(null);
      setStaffFeedback('Staff access revoked immediately.');
    } catch (err) {
      setStaffError(err instanceof Error ? err.message : 'Unable to revoke staff account.');
    } finally {
      setRevokingUid(null);
    }
  };

  const handleUpdateOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback('');
    setPasswordError('');

    if (ownNewPassword !== ownConfirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await changeOwnStaffPassword(ownNewPassword);
      setOwnNewPassword('');
      setOwnConfirmPassword('');
      setPasswordFeedback('Your staff password has been updated.');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Unable to update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const selectedScamMeta = selectedCase
    ? getScamTypeBySlug(selectedCase.scamTypeSlug)
    : undefined;

  const activeStaffLabel =
    staffProfile?.username ||
    (currentUser?.email ? normalizeStaffUsername(currentUser.email) : 'Staff');

  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs items={[{ label: 'Investigator Admin' }]} />

      {/* Top Header */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <HeroReveal>
            <h1
              className="font-display font-bold text-[#0A0A0A] leading-tight"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)', textWrap: 'balance' }}
            >
              Case Intake Registry &amp; Staff Triage Desk
            </h1>
            <p className="mt-2 text-sm text-[#475569] max-w-2xl">
              Review all submitted confidential assessments across devices, inspect full client
              contact details and blockchain evidence, and manage staff investigator credentials.
            </p>
          </HeroReveal>

          {currentUser && isAuthorized && (
            <HeroReveal delay={0.08} className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={activeTab === 'cases' ? loadAllCases : loadStaff}
                disabled={loadingCases || loadingStaff}
                className="inline-flex items-center gap-2 px-4 py-2.5 luxury-btn-secondary text-xs font-semibold disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    loadingCases || loadingStaff ? 'animate-spin' : ''
                  }`}
                  aria-hidden="true"
                />
                <span>Refresh</span>
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs shadow-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#0A0A0A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" aria-hidden="true" />
                  <span>{activeStaffLabel}</span>
                </span>
                <button
                  type="button"
                  onClick={() => signOut(auth)}
                  className="inline-flex items-center gap-1 text-[#475569] hover:text-[#0A0A0A] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            </HeroReveal>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-architectural-grid min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!authReady || checkingRole ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 rounded-2xl border border-[#E2E8F0] bg-white p-6">
                <AccountCasesSkeleton count={4} />
              </div>
              <div className="lg:col-span-8">
                <CaseDossierSkeleton />
              </div>
            </div>
          ) : !isAuthorized ? (
            <Reveal className="max-w-md mx-auto">
              <form
                onSubmit={handleStaffSignIn}
                className="glass-panel rounded-2xl p-8 sm:p-10 space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl border border-[#D4AF37]/40 bg-[#FCF8EA] flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5 text-[#946E00]" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0A0A0A]">Staff Console Sign In</h2>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Enter your Chiron Investigations staff username and password to access
                    confidential intakes and triage controls.
                  </p>
                </div>

                {currentUser && !isAuthorized && (
                  <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#475569] flex items-center justify-between gap-2">
                    <span>
                      Current session ({currentUser.email}) lacks staff access. Sign in with staff
                      credentials below.
                    </span>
                    <button
                      type="button"
                      onClick={() => signOut(auth)}
                      className="font-semibold text-[#0A0A0A] hover:underline shrink-0 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}

                {authError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs text-[#0A0A0A] space-y-2"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <AlertTriangle
                        className="w-4 h-4 text-[#946E00] shrink-0"
                        aria-hidden="true"
                      />
                      <span>Authentication Notice</span>
                    </div>
                    <p className="leading-relaxed text-[#334155]">{authError}</p>

                    {providerDisabledError && (
                      <div className="pt-2 border-t border-[#D4AF37]/40 space-y-1.5 text-[11px] text-[#334155]">
                        <p className="font-semibold text-[#0A0A0A]">
                          Quick 1-time Firebase Console step:
                        </p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Open Firebase Authentication Sign-in Providers.</li>
                          <li>
                            Click <strong>Email/Password</strong> and toggle{' '}
                            <strong>Enable</strong> ON, then click Save.
                          </li>
                          <li>
                            Return here and sign in with username <code>admin</code>.
                          </li>
                        </ol>
                        <a
                          href="https://console.firebase.google.com/project/peak-rex-z91ww/authentication/providers"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#946E00] hover:underline pt-1"
                        >
                          <span>Open Firebase Authentication Providers</span>
                          <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="staff-username"
                      className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                    >
                      Staff Username
                    </label>
                    <input
                      id="staff-username"
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="admin"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="staff-password"
                      className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="staff-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="Enter staff password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white pl-4 pr-10 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((p) => !p)}
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0A0A0A] cursor-pointer"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 luxury-btn-primary text-xs font-semibold disabled:opacity-70 cursor-pointer"
                >
                  {signingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{signingIn ? 'Authenticating...' : 'Sign In to Staff Console'}</span>
                </button>
              </form>
            </Reveal>
          ) : (
            <div className="space-y-8">
              {/* Workspace Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cases')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'cases'
                        ? 'bg-[#FCF8EA] text-[#0A0A0A] border border-[#D4AF37]/70 shadow-xs'
                        : 'text-[#475569] hover:text-[#0A0A0A]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C59B27]" aria-hidden="true" />
                    <span>Case Intake Queue ({cases.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('staff')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'staff'
                        ? 'bg-[#FCF8EA] text-[#0A0A0A] border border-[#D4AF37]/70 shadow-xs'
                        : 'text-[#475569] hover:text-[#0A0A0A]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-[#C59B27]" aria-hidden="true" />
                    <span>Staff Accounts ({staffList.length})</span>
                  </button>
                </div>
              </div>

              {activeTab === 'cases' ? (
                <div className="space-y-8">
                  {/* Summary KPI Strip */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Total Submissions',
                        value: stats.total,
                        hint: 'All browsers & devices',
                      },
                      {
                        label: 'Intake Received',
                        value: stats.intake,
                        hint: 'Awaiting initial triage',
                      },
                      {
                        label: 'Active Investigation',
                        value: stats.activeTriage,
                        hint: 'Triage & chain clustering',
                      },
                      {
                        label: 'Dossiers Ready',
                        value: stats.ready,
                        hint: 'Final deliverables issued',
                      },
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        className="glass-panel rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="text-xs font-medium text-[#475569]">{kpi.label}</div>
                        <div className="text-2xl font-bold font-mono-tabular text-[#0A0A0A] mt-1">
                          {kpi.value}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-1">{kpi.hint}</div>
                      </div>
                    ))}
                  </div>

                  {loadError && (
                    <div
                      role="alert"
                      className="p-4 rounded-2xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A] flex items-center gap-3"
                    >
                      <AlertTriangle
                        className="w-4 h-4 text-[#946E00] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{loadError}</span>
                    </div>
                  )}

                  {/* Search & Filter Toolbar */}
                  <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <Search
                        className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Case ID (CHR-...), client name, email, wallet, or platform..."
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white pl-10 pr-4 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {FILTER_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setStatusFilter(opt.key)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            statusFilter === opt.key
                              ? 'border-[#D4AF37] bg-[#FCF8EA] text-[#0A0A0A] shadow-xs'
                              : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:text-[#0A0A0A]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Master-Detail Split Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Submissions Queue */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                          Submitted Assessments ({filteredCases.length})
                        </h2>
                      </div>

                      {loadingCases ? (
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                          <AccountCasesSkeleton count={4} />
                        </div>
                      ) : filteredCases.length === 0 ? (
                        <EmptyStateCard
                          compact
                          icon={FolderSearch}
                          title="No Matching Submissions"
                          description={
                            cases.length === 0
                              ? 'No client case assessments have been submitted to Firestore yet.'
                              : 'No submissions matched your current search or stage filter.'
                          }
                          actionLabel={
                            cases.length > 0 ? 'Reset Filters' : 'Open Assessment Form'
                          }
                          onAction={
                            cases.length > 0
                              ? () => {
                                  setSearchQuery('');
                                  setStatusFilter('all');
                                }
                              : undefined
                          }
                          actionTo={cases.length === 0 ? '/assessment' : undefined}
                        />
                      ) : (
                        <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
                          {filteredCases.map((item) => {
                            const isSelected = item.lookupToken === selectedToken;
                            const statusInfo = STATUS_META[item.status];
                            return (
                              <div
                                key={item.lookupToken}
                                onClick={() => setSelectedToken(item.lookupToken)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedToken(item.lookupToken);
                                  }
                                }}
                                className={`rounded-2xl border p-4 transition-all duration-150 cursor-pointer ${
                                  isSelected
                                    ? 'border-[#D4AF37] bg-[#FCF8EA]/80 shadow-sm'
                                    : 'border-[#E2E8F0] bg-white hover:border-[#D4AF37]/60 hover:shadow-xs'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-mono-tabular text-xs font-bold text-[#946E00]">
                                    {item.caseRef}
                                  </span>
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusInfo.badgeClass}`}
                                  >
                                    {statusInfo.shortLabel}
                                  </span>
                                </div>

                                <div className="mt-2 text-sm font-bold text-[#0A0A0A] truncate">
                                  {item.contactName}
                                </div>
                                <div className="text-xs text-[#475569] truncate">
                                  {item.contactEmail}
                                </div>

                                <div className="mt-3 pt-2.5 border-t border-[#E2E8F0]/80 flex items-center justify-between text-[11px] text-[#475569]">
                                  <span className="font-mono-tabular font-semibold text-[#0A0A0A]">
                                    {item.estimatedLossAmount.toLocaleString()} {item.currency}
                                  </span>
                                  <span>{formatTimestamp(item.createdAt)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Full Confidential Case Dossier Inspector */}
                    <div className="lg:col-span-8">
                      {loadingCases && !selectedCase ? (
                        <CaseDossierSkeleton />
                      ) : !selectedCase ? (
                        <EmptyStateCard
                          icon={KeyRound}
                          title="Select a Case Assessment"
                          description="Choose any submission from the left queue to inspect full confidential contact information, wallet addresses, transaction hashes, and live status controls."
                        />
                      ) : (
                        <motion.div
                          key={selectedCase.lookupToken}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-6"
                        >
                          {/* Primary Dossier Header */}
                          <div className="glass-panel rounded-2xl border-[#D4AF37]/80 p-6 sm:p-8 space-y-6">
                            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                              <div>
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <span className="font-mono-tabular text-sm font-bold text-[#946E00]">
                                    {selectedCase.caseRef}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyText('caseRef', selectedCase.caseRef)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-[11px] font-medium text-[#475569] hover:text-[#0A0A0A] hover:border-[#D4AF37] transition-colors cursor-pointer"
                                  >
                                    {copiedKey === 'caseRef' ? (
                                      <Check
                                        className="w-3 h-3 text-[#C59B27]"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <Copy className="w-3 h-3" aria-hidden="true" />
                                    )}
                                    <span>
                                      {copiedKey === 'caseRef' ? 'Copied' : 'Copy ID'}
                                    </span>
                                  </button>
                                </div>
                                <h2 className="text-xl font-bold text-[#0A0A0A] mt-2">
                                  {selectedScamMeta?.title || selectedCase.scamTypeSlug}
                                </h2>
                                <p className="text-xs text-[#475569] mt-1">
                                  Submitted: {formatTimestamp(selectedCase.createdAt)} · Last
                                  Updated: {formatTimestamp(selectedCase.updatedAt)}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5">
                                <Link
                                  to={`/portal?ref=${encodeURIComponent(selectedCase.caseRef)}`}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 luxury-btn-secondary text-xs font-semibold"
                                >
                                  <span>Verify in Portal</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                                </Link>

                                {!confirmDelete ? (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDelete(true)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#64748B] hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Delete</span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-1.5">
                                    <span className="text-[11px] font-semibold text-red-800">
                                      Delete dossier?
                                    </span>
                                    <button
                                      type="button"
                                      disabled={deletingCase}
                                      onClick={handleDeleteCase}
                                      className="px-2.5 py-1 rounded-lg bg-red-700 text-white text-[11px] font-semibold hover:bg-red-800 disabled:opacity-60 cursor-pointer"
                                    >
                                      {deletingCase ? 'Deleting...' : 'Confirm'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDelete(false)}
                                      className="px-2 py-1 text-[11px] font-medium text-[#475569] hover:text-[#0A0A0A] cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Confidential Client PII */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                              <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                                <div className="text-[#475569]">Client Name / Alias</div>
                                <div className="font-bold text-[#0A0A0A] mt-1">
                                  {selectedCase.contactName}
                                </div>
                              </div>

                              <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                                <div className="text-[#475569] flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#C59B27]" aria-hidden="true" />
                                  <span>Contact Email</span>
                                </div>
                                <a
                                  href={`mailto:${selectedCase.contactEmail}`}
                                  className="font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline mt-1 block break-all"
                                >
                                  {selectedCase.contactEmail}
                                </a>
                              </div>

                              <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                                <div className="text-[#475569] flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-[#C59B27]" aria-hidden="true" />
                                  <span>Phone ({selectedCase.preferredContact})</span>
                                </div>
                                <div className="font-mono-tabular font-semibold text-[#0A0A0A] mt-1">
                                  {selectedCase.contactPhone || 'Not provided'}
                                </div>
                              </div>

                              <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                                <div className="text-[#475569]">Disputed Loss</div>
                                <div className="font-mono-tabular font-bold text-[#0A0A0A] mt-1">
                                  {selectedCase.estimatedLossAmount.toLocaleString()}{' '}
                                  {selectedCase.currency}
                                </div>
                              </div>
                            </div>

                            {/* Incident Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-[#475569]">Incident Date:</span>{' '}
                                <span className="font-mono-tabular font-semibold text-[#0A0A0A]">
                                  {selectedCase.incidentDate}
                                </span>
                              </div>
                              <div>
                                <span className="text-[#475569]">Category:</span>{' '}
                                <span className="font-semibold text-[#0A0A0A] uppercase">
                                  {selectedCase.lossCategory}
                                </span>
                              </div>
                              <div>
                                <span className="text-[#475569]">Reported To:</span>{' '}
                                <span className="font-semibold text-[#0A0A0A]">
                                  {selectedCase.reportedAuthorities.length > 0
                                    ? selectedCase.reportedAuthorities.join(', ')
                                    : 'Not reported yet'}
                                </span>
                              </div>
                            </div>

                            {selectedCase.platformNames && (
                              <div className="text-xs">
                                <span className="font-semibold text-[#0A0A0A]">
                                  Impersonated Platforms / Domains:{' '}
                                </span>
                                <span className="text-[#475569]">
                                  {selectedCase.platformNames}
                                </span>
                              </div>
                            )}

                            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-1.5">
                              <div className="text-xs font-bold text-[#0A0A0A]">
                                Client Incident Narrative
                              </div>
                              <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">
                                {selectedCase.narrativeSummary}
                              </p>
                            </div>

                            {/* Wallets & Transaction Hashes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2.5">
                                <div className="flex items-center justify-between text-xs font-bold text-[#0A0A0A]">
                                  <span className="inline-flex items-center gap-1.5">
                                    <Wallet
                                      className="w-3.5 h-3.5 text-[#C59B27]"
                                      aria-hidden="true"
                                    />
                                    Suspect Wallet Addresses ({selectedCase.walletAddresses.length})
                                  </span>
                                </div>
                                {selectedCase.walletAddresses.length === 0 ? (
                                  <p className="text-xs text-[#64748B]">
                                    No wallet addresses supplied at intake.
                                  </p>
                                ) : (
                                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                    {selectedCase.walletAddresses.map((addr, idx) => (
                                      <div
                                        key={`${addr}-${idx}`}
                                        className="flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5 text-[11px] font-mono-tabular"
                                      >
                                        <span className="truncate text-[#0A0A0A]">{addr}</span>
                                        <button
                                          type="button"
                                          onClick={() => copyText(`w-${idx}`, addr)}
                                          className="text-[#475569] hover:text-[#946E00] shrink-0 cursor-pointer"
                                          title="Copy address"
                                        >
                                          {copiedKey === `w-${idx}` ? (
                                            <Check className="w-3 h-3 text-[#C59B27]" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2.5">
                                <div className="flex items-center justify-between text-xs font-bold text-[#0A0A0A]">
                                  <span className="inline-flex items-center gap-1.5">
                                    <FileText
                                      className="w-3.5 h-3.5 text-[#C59B27]"
                                      aria-hidden="true"
                                    />
                                    Transaction Hashes ({selectedCase.transactionHashes.length}{' '}
                                    initial · {selectedCase.txHashCount} total)
                                  </span>
                                </div>
                                {selectedCase.transactionHashes.length === 0 ? (
                                  <p className="text-xs text-[#64748B]">
                                    No initial TXIDs supplied at intake.
                                  </p>
                                ) : (
                                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                    {selectedCase.transactionHashes.map((tx, idx) => (
                                      <div
                                        key={`${tx}-${idx}`}
                                        className="flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5 text-[11px] font-mono-tabular"
                                      >
                                        <span className="truncate text-[#0A0A0A]">{tx}</span>
                                        <button
                                          type="button"
                                          onClick={() => copyText(`tx-${idx}`, tx)}
                                          className="text-[#475569] hover:text-[#946E00] shrink-0 cursor-pointer"
                                          title="Copy TX hash"
                                        >
                                          {copiedKey === `tx-${idx}` ? (
                                            <Check className="w-3 h-3 text-[#C59B27]" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Triage Stage & Analyst Assignment Form */}
                          <form
                            onSubmit={handleSaveStatus}
                            className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-4 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]"
                          >
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                              <h3 className="text-sm font-bold text-[#0A0A0A]">
                                Update Investigation Stage &amp; Assigned Analyst
                              </h3>
                            </div>

                            {statusFeedback && (
                              <div className="p-3 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A] flex items-center gap-2">
                                <CheckCircle2
                                  className="w-4 h-4 text-[#946E00] shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{statusFeedback}</span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="admin-stage-select"
                                  className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                                >
                                  Triage Stage
                                </label>
                                <select
                                  id="admin-stage-select"
                                  value={editStatus}
                                  onChange={(e) => setEditStatus(e.target.value as CaseStatus)}
                                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                                >
                                  {(Object.keys(STATUS_META) as CaseStatus[]).map((key) => (
                                    <option key={key} value={key}>
                                      {STATUS_META[key].label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label
                                  htmlFor="admin-analyst-select"
                                  className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                                >
                                  Assigned Lead Investigator
                                </label>
                                <select
                                  id="admin-analyst-select"
                                  value={editAnalyst}
                                  onChange={(e) => setEditAnalyst(e.target.value)}
                                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                                >
                                  {ANALYST_ROSTER.map((analyst) => (
                                    <option key={analyst} value={analyst}>
                                      {analyst}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={savingStatus}
                              className="inline-flex items-center gap-2 px-5 py-2.5 luxury-btn-primary text-xs font-semibold disabled:opacity-70 cursor-pointer"
                            >
                              {savingStatus && (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                              )}
                              <span>
                                {savingStatus
                                  ? 'Saving to Firestore...'
                                  : 'Save Status & Assignment'}
                              </span>
                            </button>
                          </form>

                          {/* Publish Analyst Note */}
                          <form
                            onSubmit={handlePostAnalystNote}
                            className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-4 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]"
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquarePlus
                                className="w-4 h-4 text-[#C59B27]"
                                aria-hidden="true"
                              />
                              <h3 className="text-sm font-bold text-[#0A0A0A]">
                                Publish Analyst Note to Client Portal Timeline
                              </h3>
                            </div>

                            {selectedCase.status === 'dossier_ready' ? (
                              <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#475569]">
                                This case is currently marked <strong>Dossier Ready</strong>. Change
                                the triage stage above back to <em>Chain Clustering</em> or{' '}
                                <em>Initial Triage</em> if you need to append new analyst updates.
                              </div>
                            ) : (
                              <>
                                {noteFeedback && (
                                  <div className="p-3 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A]">
                                    {noteFeedback}
                                  </div>
                                )}

                                <div>
                                  <label
                                    htmlFor="admin-analyst-note"
                                    className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                                  >
                                    Investigator Update (Visible to client via Case Reference ID) *
                                  </label>
                                  <textarea
                                    id="admin-analyst-note"
                                    rows={2}
                                    required
                                    maxLength={BLUEPRINT_LIMITS.MAX_UPDATE_NOTE_LEN}
                                    placeholder="e.g. Initial hop analysis completed; funds traced to VASP deposit cluster. Draft evidentiary package queued."
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="admin-note-hashes"
                                    className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                                  >
                                    Additional Traced Transaction Hashes (Optional, one per line)
                                  </label>
                                  <textarea
                                    id="admin-note-hashes"
                                    rows={2}
                                    placeholder="0x... or TXID..."
                                    value={noteHashesText}
                                    onChange={(e) => setNoteHashesText(e.target.value)}
                                    className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>

                                <button
                                  type="submit"
                                  disabled={postingNote}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 luxury-btn-secondary text-xs font-semibold disabled:opacity-70 cursor-pointer"
                                >
                                  {postingNote && (
                                    <Loader2
                                      className="w-3.5 h-3.5 animate-spin"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span>
                                    {postingNote ? 'Publishing...' : 'Publish Analyst Update'}
                                  </span>
                                </button>
                              </>
                            )}
                          </form>

                          {/* Activity & Evidence Timeline */}
                          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]">
                            <h3 className="text-sm font-bold text-[#0A0A0A] mb-4">
                              Dossier Activity &amp; Evidence Log ({updates.length})
                            </h3>

                            {loadingUpdates ? (
                              <AccountCasesSkeleton count={2} />
                            ) : updates.length === 0 ? (
                              <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]/80 p-6 text-center space-y-2">
                                <Clock
                                  className="w-5 h-5 text-[#C59B27] mx-auto"
                                  aria-hidden="true"
                                />
                                <div className="text-xs font-semibold text-[#0A0A0A]">
                                  No Supplementary Updates Logged Yet
                                </div>
                                <p className="text-xs text-[#475569] max-w-md mx-auto">
                                  Neither the client nor an investigator has appended follow-up
                                  notes or additional TXIDs to this case yet.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {updates.map((upd) => (
                                  <div
                                    key={upd.id}
                                    className={`rounded-xl border p-4 space-y-2 ${
                                      upd.submittedByRole === 'analyst'
                                        ? 'border-[#D4AF37]/70 bg-[#FCF8EA]/50'
                                        : 'border-[#E2E8F0] bg-[#F8FAFC]'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between text-xs text-[#475569]">
                                      <span className="font-semibold text-[#0A0A0A]">
                                        {upd.submittedByRole === 'analyst'
                                          ? 'Chiron Analyst Note'
                                          : 'Client Evidence Addition'}
                                      </span>
                                      <span className="font-mono-tabular">
                                        {formatTimestamp(upd.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-[#0A0A0A]">{upd.note}</p>
                                    {upd.newTransactionHashes.length > 0 && (
                                      <div className="pt-2 border-t border-[#E2E8F0] text-xs font-mono-tabular text-[#475569] break-all">
                                        Added TXIDs: {upd.newTransactionHashes.join(' · ')}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Staff Accounts Management Tab */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Create Staff Account + Change Own Password */}
                  <div className="lg:col-span-5 space-y-6">
                    <form
                      onSubmit={handleCreateStaff}
                      className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5"
                    >
                      <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8F0]">
                        <UserPlus className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                        <div>
                          <h2 className="text-sm font-bold text-[#0A0A0A]">
                            Create Staff Credentials
                          </h2>
                          <p className="text-[11px] text-[#475569] mt-0.5">
                            Provision a username and password for another investigator.
                          </p>
                        </div>
                      </div>

                      {staffFeedback && (
                        <div className="p-3 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A] flex items-center gap-2">
                          <CheckCircle2
                            className="w-4 h-4 text-[#946E00] shrink-0"
                            aria-hidden="true"
                          />
                          <span>{staffFeedback}</span>
                        </div>
                      )}

                      {staffError && (
                        <div
                          role="alert"
                          className="p-3 rounded-xl border border-red-300 bg-red-50 text-xs font-medium text-red-800"
                        >
                          {staffError}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="new-staff-username"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Staff Username *
                          </label>
                          <input
                            id="new-staff-username"
                            type="text"
                            required
                            placeholder="e.g. edward or analyst.vance"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                          />
                          <p className="text-[11px] text-[#64748B] mt-1">
                            Lowercase letters, numbers, dots, underscores, or hyphens (3–40 chars).
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="new-staff-display"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Investigator Full Name / Title *
                          </label>
                          <input
                            id="new-staff-display"
                            type="text"
                            required
                            placeholder="e.g. Edward Camillieri"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="new-staff-password"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Initial Password *
                          </label>
                          <div className="relative">
                            <input
                              id="new-staff-password"
                              type={showNewStaffPass ? 'text' : 'password'}
                              required
                              minLength={6}
                              placeholder="Minimum 6 characters"
                              value={newStaffPassword}
                              onChange={(e) => setNewStaffPassword(e.target.value)}
                              className="w-full rounded-xl border border-[#CBD5E1] bg-white pl-3.5 pr-10 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewStaffPass((p) => !p)}
                              aria-label={showNewStaffPass ? 'Hide password' : 'Show password'}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0A0A0A] cursor-pointer"
                            >
                              {showNewStaffPass ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={creatingStaff}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 luxury-btn-primary text-xs font-semibold disabled:opacity-70 cursor-pointer"
                      >
                        {creatingStaff && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        )}
                        <span>{creatingStaff ? 'Creating Staff User...' : 'Create Staff User'}</span>
                      </button>
                    </form>

                    {/* Update Own Password */}
                    <form
                      onSubmit={handleUpdateOwnPassword}
                      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-4 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]"
                    >
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                        <h3 className="text-sm font-bold text-[#0A0A0A]">Update My Password</h3>
                      </div>

                      {passwordFeedback && (
                        <div className="p-3 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A]">
                          {passwordFeedback}
                        </div>
                      )}

                      {passwordError && (
                        <div
                          role="alert"
                          className="p-3 rounded-xl border border-red-300 bg-red-50 text-xs font-medium text-red-800"
                        >
                          {passwordError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="own-new-password"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            New Password
                          </label>
                          <input
                            id="own-new-password"
                            type="password"
                            required
                            minLength={6}
                            value={ownNewPassword}
                            onChange={(e) => setOwnNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="own-confirm-password"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Confirm Password
                          </label>
                          <input
                            id="own-confirm-password"
                            type="password"
                            required
                            minLength={6}
                            value={ownConfirmPassword}
                            onChange={(e) => setOwnConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={updatingPassword}
                        className="inline-flex items-center gap-2 px-4 py-2.5 luxury-btn-secondary text-xs font-semibold disabled:opacity-70 cursor-pointer"
                      >
                        {updatingPassword && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        )}
                        <span>{updatingPassword ? 'Updating...' : 'Update Password'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Right: Active Staff Registry */}
                  <div className="lg:col-span-7">
                    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 space-y-5 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]">
                      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                        <div>
                          <h2 className="text-base font-bold text-[#0A0A0A]">
                            Authorized Staff Directory
                          </h2>
                          <p className="text-xs text-[#475569] mt-0.5">
                            Every account listed below can sign into `/admin` with their username
                            and password across any browser.
                          </p>
                        </div>
                      </div>

                      {loadingStaff ? (
                        <AccountCasesSkeleton count={3} />
                      ) : staffList.length === 0 ? (
                        <EmptyStateCard
                          compact
                          icon={Users}
                          title="No Staff Directory Records"
                          description="Create your first staff username and password using the form on the left."
                        />
                      ) : (
                        <div className="space-y-3">
                          {staffList.map((member) => {
                            const isSelf = member.uid === currentUser?.uid;
                            return (
                              <div
                                key={member.uid}
                                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono-tabular text-sm font-bold text-[#0A0A0A]">
                                      {member.username}
                                    </span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#D4AF37]/60 bg-[#FCF8EA] text-[#946E00]">
                                      {isSelf ? 'Active Session' : 'Staff Admin'}
                                    </span>
                                  </div>
                                  <div className="text-xs font-medium text-[#334155] mt-0.5">
                                    {member.displayName}
                                  </div>
                                  <div className="text-[11px] text-[#64748B] mt-1">
                                    Created: {formatTimestamp(member.createdAt)}
                                  </div>
                                </div>

                                {!isSelf && (
                                  <div className="shrink-0">
                                    {revokeConfirmUid !== member.uid ? (
                                      <button
                                        type="button"
                                        onClick={() => setRevokeConfirmUid(member.uid)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#64748B] hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                        <span>Revoke Access</span>
                                      </button>
                                    ) : (
                                      <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-1.5">
                                        <span className="text-[11px] font-semibold text-red-800">
                                          Revoke?
                                        </span>
                                        <button
                                          type="button"
                                          disabled={revokingUid === member.uid}
                                          onClick={() => handleRevokeStaff(member.uid)}
                                          className="px-2.5 py-1 rounded-lg bg-red-700 text-white text-[11px] font-semibold hover:bg-red-800 disabled:opacity-60 cursor-pointer"
                                        >
                                          {revokingUid === member.uid ? '...' : 'Confirm'}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setRevokeConfirmUid(null)}
                                          className="px-2 py-1 text-[11px] font-medium text-[#475569] hover:text-[#0A0A0A] cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
