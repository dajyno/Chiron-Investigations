import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import {
  CaseLookupRecord,
  CaseStatus,
  getRecentLocalCases,
  lookupCaseByReference,
  RecentLocalCase,
} from '../lib/caseService';
import { getScamTypeBySlug } from '../data/scamTypesData';
import { Reveal } from './MotionPrimitives';
import { CaseDossierSkeleton } from './StateFeedback';

const STATUS_STEPS: { key: CaseStatus; label: string }[] = [
  { key: 'intake_received', label: '01. Intake Received' },
  { key: 'initial_triage', label: '02. Initial Triage' },
  { key: 'chain_clustering', label: '03. Chain Clustering' },
  { key: 'dossier_ready', label: '04. Dossier Ready' },
];

export const VerifyCaseWidget: React.FC = () => {
  const [caseRefInput, setCaseRefInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<CaseLookupRecord | null>(null);
  const [recentCases, setRecentCases] = useState<RecentLocalCase[]>([]);

  useEffect(() => {
    setRecentCases(getRecentLocalCases());
  }, []);

  const runVerification = async (refToCheck: string) => {
    const cleaned = refToCheck.trim().toUpperCase();
    if (!cleaned) {
      setResult(null);
      setErrorMsg('Please enter your Case Reference ID (for example, CHR-2026-8K4M9P2Q).');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await lookupCaseByReference(cleaned);
      if (!response) {
        setResult(null);
        setErrorMsg(
          'No active dossier matched that Case Reference ID. Please verify the reference (e.g. CHR-2026-5DH7Z or CHR-2026-8K4M9P2Q) and try again.'
        );
        return;
      }
      setResult(response.record);
    } catch {
      setResult(null);
      setErrorMsg('Unable to verify case status right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(caseRefInput);
  };

  const handleReset = () => {
    setCaseRefInput('');
    setErrorMsg('');
    setResult(null);
  };

  const activeStepIndex = result
    ? STATUS_STEPS.findIndex((step) => step.key === result.status)
    : -1;
  const activeStepLabel =
    activeStepIndex >= 0 ? STATUS_STEPS[activeStepIndex].label : '01. Intake Received';
  const scamMeta = result ? getScamTypeBySlug(result.scamTypeSlug) : undefined;
  const clientNameDisplay = result?.clientName?.trim();
  const clientPhoneDisplay = result?.clientPhone?.trim();

  return (
    <section
      aria-labelledby="verify-case-heading"
      className="border-b border-[#E2E8F0] bg-architectural-grid"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <Reveal>
          <div className="glass-panel rounded-2xl p-5 sm:p-8 lg:p-10 transition-shadow duration-200 hover:shadow-[0_18px_48px_-14px_rgba(10,10,10,0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <div className="lg:col-span-5">
                <h2
                  id="verify-case-heading"
                  className="text-xl sm:text-2xl font-bold text-[#0A0A0A] tracking-tight"
                >
                  Verify Case ID
                </h2>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                  Already submitted an assessment? Enter your Case Reference ID to view client
                  details, assigned investigator, and current investigation stage.
                </p>

                {recentCases.length > 0 && (
                  <div className="mt-3.5 text-xs text-[#475569] flex flex-wrap items-center gap-1.5">
                    <span>Recent on this device:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCaseRefInput(recentCases[0].caseRef);
                        runVerification(recentCases[0].caseRef);
                      }}
                      className="font-mono-tabular font-semibold text-[#0A0A0A] underline decoration-[#D4AF37] underline-offset-4 hover:text-[#946E00] transition-colors cursor-pointer py-1"
                    >
                      {recentCases[0].caseRef}
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <label htmlFor="home-verify-case-id" className="sr-only">
                    Case Reference ID
                  </label>
                  <input
                    id="home-verify-case-id"
                    type="text"
                    placeholder="Enter Case Reference ID (e.g. CHR-2026-8K4M9P2Q)"
                    value={caseRefInput}
                    onChange={(e) => setCaseRefInput(e.target.value)}
                    className="w-full flex-1 min-h-[44px] rounded-xl border border-[#CBD5E1] bg-white/90 px-4 py-2.5 text-base sm:text-sm font-mono-tabular uppercase text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37] focus:bg-white shadow-xs transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 luxury-btn-primary text-xs font-semibold disabled:opacity-70 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Search className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{loading ? 'Verifying...' : 'Verify Case ID'}</span>
                  </button>
                </form>

                {/* Compact Loading Skeleton */}
                {loading && <CaseDossierSkeleton compact />}

                {/* Not Found State */}
                {!loading && errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="mt-4 rounded-xl border border-[#D4AF37]/70 bg-[#FCF8EA]/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileSearch
                        className="w-4 h-4 text-[#946E00] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#0A0A0A]">
                          Case Reference Not Matched
                        </div>
                        <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">{errorMsg}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="min-h-[36px] px-3 py-1.5 luxury-btn-secondary text-xs font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                      <Link
                        to="/assessment"
                        className="text-xs font-semibold text-[#946E00] hover:underline whitespace-nowrap"
                      >
                        New Assessment →
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* Compact Mobile-Friendly Case Summary */}
                {!loading && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 rounded-xl border border-[#E2E8F0] bg-white/95 p-4 sm:p-5 space-y-3.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                          <span className="font-mono-tabular font-bold text-[#946E00]">
                            {result.caseRef}
                          </span>
                          <span className="text-[#CBD5E1]" aria-hidden="true">
                            ·
                          </span>
                          <span className="font-medium text-[#475569] truncate">
                            {scamMeta?.title || result.scamTypeSlug}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        aria-label="Close case details"
                        className="inline-flex items-center gap-1 min-h-[32px] px-2 text-xs font-medium text-[#64748B] hover:text-[#0A0A0A] transition-colors shrink-0 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Close</span>
                      </button>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      <div className="min-w-0">
                        <dt className="text-[11px] font-medium text-[#64748B]">Client Name</dt>
                        <dd className="text-sm font-semibold text-[#0A0A0A] mt-0.5 break-words">
                          {clientNameDisplay || 'Not provided'}
                        </dd>
                      </div>

                      <div className="min-w-0">
                        <dt className="text-[11px] font-medium text-[#64748B]">Phone Number</dt>
                        <dd className="text-sm font-mono-tabular font-semibold text-[#0A0A0A] mt-0.5 break-words">
                          {clientPhoneDisplay || 'Not provided'}
                        </dd>
                      </div>

                      <div className="min-w-0">
                        <dt className="text-[11px] font-medium text-[#64748B]">
                          Assigned Investigator
                        </dt>
                        <dd className="text-sm font-medium text-[#0A0A0A] mt-0.5 break-words">
                          {result.assignedAnalyst}
                        </dd>
                      </div>

                      <div className="min-w-0">
                        <dt className="text-[11px] font-medium text-[#64748B]">
                          Current Investigation Stage
                        </dt>
                        <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-[#0A0A0A]">
                          <CheckCircle2
                            className="w-4 h-4 text-[#C59B27] shrink-0"
                            aria-hidden="true"
                          />
                          <span>{activeStepLabel}</span>
                        </dd>
                      </div>
                    </dl>

                    <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#475569]">
                      <span className="font-mono-tabular">
                        {result.estimatedLossAmount.toLocaleString()} {result.currency} · Incident{' '}
                        {result.incidentDate}
                      </span>
                      <Link
                        to={`/portal?ref=${encodeURIComponent(result.caseRef)}`}
                        className="inline-flex items-center gap-1 min-h-[36px] sm:min-h-0 font-semibold text-[#0A0A0A] hover:text-[#946E00] transition-colors group"
                      >
                        <span>Open Full Dossier</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
