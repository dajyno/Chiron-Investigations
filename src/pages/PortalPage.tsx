import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  CheckCircle2,
  Clock,
  FilePlus2,
  FileSearch,
  FileText,
  FolderOpen,
  KeyRound,
  Loader2,
  LogOut,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal } from '../components/MotionPrimitives';
import {
  AccountCasesSkeleton,
  CaseDossierSkeleton,
  EmptyStateCard,
} from '../components/StateFeedback';
import { auth, googleProvider } from '../lib/firebase';
import {
  appendCaseEvidenceUpdate,
  BLUEPRINT_LIMITS,
  CaseLookupRecord,
  CaseStatus,
  CaseUpdateRecord,
  getRecentLocalCases,
  listAuthenticatedUserCases,
  lookupCaseByReference,
  RecentLocalCase,
} from '../lib/caseService';
import { getScamTypeBySlug } from '../data/scamTypesData';

const STAGES: { key: CaseStatus; label: string; detail: string }[] = [
  {
    key: 'intake_received',
    label: '01. Intake Received',
    detail: 'Encrypted dossier logged and assigned to triage desk.',
  },
  {
    key: 'initial_triage',
    label: '02. Initial Triage',
    detail: 'TXIDs & deposit addresses undergoing preliminary hop screening.',
  },
  {
    key: 'chain_clustering',
    label: '03. Chain Clustering',
    detail: 'Cross-chain tracing & VASP cluster attribution in progress.',
  },
  {
    key: 'dossier_ready',
    label: '04. Dossier Ready',
    detail: 'Final evidentiary or loss documentation issued.',
  },
];

export const PortalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [caseRefInput, setCaseRefInput] = useState(initialRef);
  const [recentCases, setRecentCases] = useState<RecentLocalCase[]>([]);

  const [loadingLookup, setLoadingLookup] = useState(Boolean(initialRef));
  const [lookupError, setLookupError] = useState('');
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<CaseLookupRecord | null>(null);
  const [updates, setUpdates] = useState<CaseUpdateRecord[]>([]);

  const [updateNote, setUpdateNote] = useState('');
  const [updateHashes, setUpdateHashes] = useState('');
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState('');

  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [userCases, setUserCases] = useState<CaseLookupRecord[]>([]);
  const [loadingUserCases, setLoadingUserCases] = useState(false);

  useEffect(() => {
    setRecentCases(getRecentLocalCases());
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && user.emailVerified) {
        setLoadingUserCases(true);
        try {
          const rows = await listAuthenticatedUserCases(user.uid);
          setUserCases(rows);
        } catch {
          setUserCases([]);
        } finally {
          setLoadingUserCases(false);
        }
      } else {
        setUserCases([]);
      }
    });
    return () => unsub();
  }, []);

  const executeLookup = async (refStr: string) => {
    const cleaned = refStr.trim().toUpperCase();
    if (!cleaned) {
      setActiveCase(null);
      setActiveToken(null);
      setUpdates([]);
      setLookupError('Please enter a valid Case Reference ID (e.g. CHR-2026-8K4M9P2Q).');
      return;
    }

    setLoadingLookup(true);
    setLookupError('');
    setUpdateFeedback('');
    try {
      const result = await lookupCaseByReference(cleaned);
      if (!result) {
        setActiveCase(null);
        setActiveToken(null);
        setUpdates([]);
        setLookupError(
          'No matching dossier found. Please confirm your Case Reference ID (e.g. CHR-2026-8K4M9P2Q).'
        );
        return;
      }
      setActiveToken(result.lookupToken);
      setActiveCase(result.record);
      setUpdates(result.updates);
    } catch {
      setLookupError('Unable to retrieve case status right now. Please try again shortly.');
    } finally {
      setLoadingLookup(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      executeLookup(initialRef);
    }
  }, [initialRef]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(caseRefInput);
  };

  const handleClearLookup = () => {
    setCaseRefInput('');
    setLookupError('');
    setActiveCase(null);
    setActiveToken(null);
    setUpdates([]);
  };

  const handleAppendEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeToken || !activeCase) return;

    setSavingUpdate(true);
    setUpdateFeedback('');
    try {
      const parsedHashes = updateHashes
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      await appendCaseEvidenceUpdate(activeToken, activeCase.caseRef, updateNote, parsedHashes);
      setUpdateNote('');
      setUpdateHashes('');
      setUpdateFeedback('Supplementary evidence logged to your case file.');
      await executeLookup(activeCase.caseRef);
    } catch (err) {
      setUpdateFeedback(
        err instanceof Error ? err.message : 'Unable to append evidence update right now.'
      );
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setLookupError('Google sign-in was cancelled or blocked by your browser.');
    }
  };

  const activeScamMeta = activeCase ? getScamTypeBySlug(activeCase.scamTypeSlug) : undefined;
  const activeStageIndex = activeCase
    ? STAGES.findIndex((s) => s.key === activeCase.status)
    : -1;

  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs items={[{ label: 'Client Portal' }]} />

      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <HeroReveal>
            <p className="text-xs font-semibold text-[#946E00]">Encrypted Client Case Portal</p>
            <h1
              className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)', textWrap: 'balance' }}
            >
              Case Status Lookup &amp; Supplementary Evidence
            </h1>
            <p className="mt-2 text-sm text-[#475569] max-w-2xl">
              Enter your Case Reference ID issued after intake to check investigation progress or
              append new transaction hashes—no account login required.
            </p>
          </HeroReveal>

          <HeroReveal delay={0.08} className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs shadow-xs">
                <span className="font-medium text-[#0A0A0A]">{currentUser.email}</span>
                <button
                  type="button"
                  onClick={() => signOut(auth)}
                  className="inline-flex items-center gap-1 text-[#475569] hover:text-[#0A0A0A] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="px-4 py-2.5 luxury-btn-secondary text-xs font-semibold cursor-pointer"
              >
                Sign In With Google
              </button>
            )}
          </HeroReveal>
        </div>
      </section>

      <section className="py-12 bg-architectural-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Single Case Reference ID Lookup + Session History */}
          <Reveal className="lg:col-span-4 space-y-6">
            <form
              onSubmit={handleLookupSubmit}
              className="glass-panel rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#0A0A0A]">Case Reference Lookup</h2>
              </div>

              <div>
                <label
                  htmlFor="portal-case-ref"
                  className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                >
                  Case Reference ID
                </label>
                <input
                  id="portal-case-ref"
                  type="text"
                  required
                  placeholder="CHR-2026-XXXXXXXX"
                  value={caseRefInput}
                  onChange={(e) => setCaseRefInput(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-mono-tabular uppercase focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={loadingLookup}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 luxury-btn-primary text-xs font-semibold disabled:opacity-70 cursor-pointer"
              >
                {loadingLookup ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{loadingLookup ? 'Locating Dossier...' : 'Retrieve Case Status'}</span>
              </button>
            </form>

            {/* Quick-Load Local Recent Submissions (with Empty State) */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-3 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]">
              <h3 className="text-xs font-bold text-[#0A0A0A]">
                Recent Submissions (This Browser)
              </h3>
              {recentCases.length > 0 ? (
                <div className="space-y-2">
                  {recentCases.map((entry) => (
                    <button
                      key={entry.caseRef}
                      type="button"
                      onClick={() => {
                        setCaseRefInput(entry.caseRef);
                        executeLookup(entry.caseRef);
                      }}
                      className="w-full p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#D4AF37] bg-[#F8FAFC] hover:bg-[#FCF8EA]/50 text-left transition-all duration-150 cursor-pointer"
                    >
                      <div className="text-xs font-mono-tabular font-bold text-[#0A0A0A]">
                        {entry.caseRef}
                      </div>
                      <div className="text-[11px] text-[#475569] mt-0.5">
                        Click to view live status
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]/80 p-4 text-center space-y-2">
                  <Clock className="w-4 h-4 text-[#94A3B8] mx-auto" aria-hidden="true" />
                  <p className="text-xs text-[#475569] leading-relaxed">
                    No case assessments have been submitted from this browser yet.
                  </p>
                  <Link
                    to="/assessment"
                    className="inline-block text-xs font-semibold text-[#946E00] hover:underline"
                  >
                    Start Free Case Assessment →
                  </Link>
                </div>
              )}
            </div>

            {/* Authenticated Google Account Cases (with Skeleton Loading & Empty State) */}
            {currentUser && (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-3 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]">
                <h3 className="text-xs font-bold text-[#0A0A0A]">Cases Linked to Your Account</h3>
                {loadingUserCases ? (
                  <AccountCasesSkeleton count={2} />
                ) : userCases.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]/80 p-4 text-center space-y-2">
                    <FolderOpen className="w-4 h-4 text-[#94A3B8] mx-auto" aria-hidden="true" />
                    <p className="text-xs text-[#475569] leading-relaxed">
                      No dossiers linked to this signed-in account yet.
                    </p>
                    <Link
                      to="/assessment"
                      className="inline-block text-xs font-semibold text-[#946E00] hover:underline"
                    >
                      Submit Assessment While Signed In →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userCases.map((c) => (
                      <button
                        key={c.caseRef}
                        type="button"
                        onClick={() => {
                          setCaseRefInput(c.caseRef);
                          executeLookup(c.caseRef);
                        }}
                        className="w-full p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#D4AF37] bg-[#F8FAFC] hover:bg-[#FCF8EA]/50 text-left text-xs transition-all duration-150 cursor-pointer"
                      >
                        <div className="font-mono-tabular font-bold text-[#0A0A0A]">
                          {c.caseRef}
                        </div>
                        <div className="text-[#475569] mt-0.5">
                          {c.estimatedLossAmount.toLocaleString()} {c.currency} · {c.status}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Reveal>

          {/* Right Column: Live Case Status Display, Loading Skeleton, and Empty States */}
          <div className="lg:col-span-8">
            {loadingLookup ? (
              <CaseDossierSkeleton />
            ) : lookupError && !activeCase ? (
              <EmptyStateCard
                icon={FileSearch}
                title="Case Dossier Not Found"
                description={lookupError}
                actionLabel="Clear Search & Try Again"
                onAction={handleClearLookup}
              />
            ) : !activeCase ? (
              <EmptyStateCard
                icon={ShieldCheck}
                title="Enter Your Case Reference ID to View Triage Status"
                description="Enter your Case Reference ID to inspect the client record, brief case summary, live investigation stage, assigned analyst, and logged evidence counts while keeping email addresses and raw wallet/TXID lists private."
                actionLabel="Need to Submit a New Case?"
                actionTo="/assessment"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {lookupError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A]"
                  >
                    {lookupError}
                  </div>
                )}

                {/* Summary Header Card */}
                <div className="glass-panel rounded-2xl border-[#D4AF37]/80 p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                    <div>
                      <div className="text-xs font-mono-tabular font-semibold text-[#946E00]">
                        {activeCase.caseRef}
                      </div>
                      <h2 className="text-xl font-bold text-[#0A0A0A] mt-1">
                        {activeScamMeta?.title || activeCase.scamTypeSlug}
                      </h2>
                      <p className="text-xs text-[#475569] mt-1">
                        Assigned Lead: {activeCase.assignedAnalyst}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[#475569]">Disputed Loss</div>
                      <div className="text-lg font-bold font-mono-tabular text-[#0A0A0A]">
                        {activeCase.estimatedLossAmount.toLocaleString()} {activeCase.currency}
                      </div>
                    </div>
                  </div>

                  {/* Client & Case Summary */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                      <div className="text-[#475569]">Client Name</div>
                      <div className="font-bold text-[#0A0A0A] mt-0.5">
                        {activeCase.clientName?.trim() || 'Not provided'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                      <div className="text-[#475569]">Phone Number</div>
                      <div className="font-mono-tabular font-bold text-[#0A0A0A] mt-0.5">
                        {activeCase.clientPhone?.trim() || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  {activeCase.caseSummary && (
                    <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#FCF8EA]/45 p-4 space-y-1">
                      <div className="text-xs font-bold text-[#0A0A0A]">Brief Case Summary</div>
                      <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                        {activeCase.caseSummary}
                      </p>
                    </div>
                  )}

                  {/* 4-Stage Pipeline */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {STAGES.map((stage, idx) => {
                      const completed = idx <= activeStageIndex;
                      return (
                        <div
                          key={stage.key}
                          className={`p-3.5 rounded-xl border transition-colors ${
                            completed
                              ? 'border-[#D4AF37] bg-[#FCF8EA]/60'
                              : 'border-[#E2E8F0] bg-white opacity-65'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0A0A0A]">{stage.label}</span>
                            {completed ? (
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-[#C59B27]"
                                aria-hidden="true"
                              />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#475569] mt-1.5 leading-snug">
                            {stage.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <div className="text-[#475569]">Incident Date</div>
                      <div className="font-semibold font-mono-tabular mt-0.5">
                        {activeCase.incidentDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#475569]">Wallets Logged</div>
                      <div className="font-semibold font-mono-tabular mt-0.5">
                        {activeCase.walletCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#475569]">TX Hashes Logged</div>
                      <div className="font-semibold font-mono-tabular mt-0.5">
                        {activeCase.txHashCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#475569]">Reported To</div>
                      <div className="font-semibold mt-0.5 truncate">
                        {activeCase.reportedAuthorities.length > 0
                          ? activeCase.reportedAuthorities.join(', ')
                          : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Append Supplementary Evidence Form */}
                {activeCase.status !== 'dossier_ready' && (
                  <form
                    onSubmit={handleAppendEvidence}
                    className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-4 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]"
                  >
                    <div className="flex items-center gap-2">
                      <FilePlus2 className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-[#0A0A0A]">
                        Append Supplementary Evidence or TXIDs
                      </h3>
                    </div>

                    {updateFeedback && (
                      <div className="p-3 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A]">
                        {updateFeedback}
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="append-note"
                        className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                      >
                        Investigator Note *
                      </label>
                      <textarea
                        id="append-note"
                        rows={2}
                        required
                        maxLength={BLUEPRINT_LIMITS.MAX_UPDATE_NOTE_LEN}
                        placeholder="Add newly discovered platform domains, Action Fraud reference numbers, or transfer context."
                        value={updateNote}
                        onChange={(e) => setUpdateNote(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="append-hashes"
                        className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                      >
                        Additional Transaction Hashes (Optional, one per line)
                      </label>
                      <textarea
                        id="append-hashes"
                        rows={2}
                        placeholder="0x... or TXID..."
                        value={updateHashes}
                        onChange={(e) => setUpdateHashes(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingUpdate}
                      className="inline-flex items-center gap-2 px-5 py-2.5 luxury-btn-primary text-xs font-semibold disabled:opacity-70 cursor-pointer"
                    >
                      {savingUpdate && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      )}
                      <span>{savingUpdate ? 'Saving Update...' : 'Append to Case File'}</span>
                    </button>
                  </form>
                )}

                {/* Case Updates Log */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]">
                  <h3 className="text-sm font-bold text-[#0A0A0A] mb-4">
                    Dossier Activity &amp; Evidence Log
                  </h3>
                  {updates.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]/80 p-6 text-center space-y-2">
                      <FileText className="w-5 h-5 text-[#C59B27] mx-auto" aria-hidden="true" />
                      <div className="text-xs font-semibold text-[#0A0A0A]">
                        Initial Case Intake Logged
                      </div>
                      <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                        No supplementary notes or additional TXIDs have been appended yet. Use the
                        form above to add new transaction hashes or agency reference numbers.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {updates.map((upd) => (
                        <div
                          key={upd.id}
                          className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs text-[#475569]">
                            <span className="font-semibold text-[#0A0A0A]">
                              {upd.submittedByRole === 'analyst'
                                ? 'Chiron Analyst Note'
                                : 'Client Evidence Addition'}
                            </span>
                            <span className="font-mono-tabular">
                              {upd.createdAt?.toDate
                                ? upd.createdAt.toDate().toLocaleString()
                                : 'Just now'}
                            </span>
                          </div>
                          <p className="text-sm text-[#0A0A0A]">{upd.note}</p>
                          {upd.newTransactionHashes.length > 0 && (
                            <div className="pt-2 border-t border-[#E2E8F0] text-xs font-mono-tabular text-[#475569]">
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
      </section>
    </div>
  );
};
