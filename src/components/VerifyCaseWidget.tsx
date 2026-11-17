import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock, FileSearch, Loader2, Search } from 'lucide-react';
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
          'No active dossier matched that Case Reference ID. Please verify the format (CHR-YYYY-XXXXXXXX) and try again.'
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
  const scamMeta = result ? getScamTypeBySlug(result.scamTypeSlug) : undefined;

  return (
    <section
      aria-labelledby="verify-case-heading"
      className="border-b border-[#E2E8F0] bg-architectural-grid"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Reveal>
          <div className="glass-panel rounded-2xl p-8 sm:p-10 transition-shadow duration-200 hover:shadow-[0_18px_48px_-14px_rgba(10,10,10,0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <h2
                  id="verify-case-heading"
                  className="text-2xl font-bold text-[#0A0A0A] tracking-tight"
                >
                  Verify Case ID
                </h2>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                  Already submitted an assessment? Enter your Case Reference ID below to check your
                  live investigation stage, assigned lead analyst, and evidence log count directly.
                </p>

                {recentCases.length > 0 && (
                  <div className="mt-4 text-xs text-[#475569]">
                    <span>Recent reference on this device: </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCaseRefInput(recentCases[0].caseRef);
                        runVerification(recentCases[0].caseRef);
                      }}
                      className="font-mono-tabular font-semibold text-[#0A0A0A] underline decoration-[#D4AF37] underline-offset-4 hover:text-[#946E00] transition-colors cursor-pointer"
                    >
                      {recentCases[0].caseRef}
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="home-verify-case-id" className="sr-only">
                    Case Reference ID
                  </label>
                  <input
                    id="home-verify-case-id"
                    type="text"
                    placeholder="Enter Case Reference ID (e.g. CHR-2026-8K4M9P2Q)"
                    value={caseRefInput}
                    onChange={(e) => setCaseRefInput(e.target.value)}
                    className="flex-1 rounded-xl border border-[#CBD5E1] bg-white/90 px-4 py-3 text-sm font-mono-tabular uppercase text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37] focus:bg-white shadow-xs transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 luxury-btn-primary text-xs font-semibold disabled:opacity-70 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Search className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{loading ? 'Verifying...' : 'Verify Case ID'}</span>
                  </button>
                </form>

                {/* Loading Skeleton State */}
                {loading && <CaseDossierSkeleton compact />}

                {/* Empty / Not Found State */}
                {!loading && errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="mt-5 rounded-2xl border border-[#D4AF37]/70 bg-[#FCF8EA]/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <FileSearch
                        className="w-5 h-5 text-[#946E00] shrink-0 mt-0.5"
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
                        className="px-3.5 py-2 luxury-btn-secondary text-xs font-semibold cursor-pointer"
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

                {/* Loaded Dossier Result */}
                {!loading && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white/90 backdrop-blur-md p-6 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                      <div>
                        <div className="text-xs font-mono-tabular font-semibold text-[#946E00]">
                          {result.caseRef}
                        </div>
                        <div className="text-base font-bold text-[#0A0A0A] mt-0.5">
                          {scamMeta?.title || result.scamTypeSlug}
                        </div>
                        <div className="text-xs text-[#475569] mt-0.5">
                          Lead Analyst: {result.assignedAnalyst}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-[#475569]">Disputed Amount</div>
                        <div className="text-sm font-bold font-mono-tabular text-[#0A0A0A]">
                          {result.estimatedLossAmount.toLocaleString()} {result.currency}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {STATUS_STEPS.map((step, idx) => {
                        const active = idx <= activeStepIndex;
                        return (
                          <div
                            key={step.key}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-1.5 transition-colors ${
                              active
                                ? 'border-[#D4AF37] bg-[#FCF8EA]/60 font-semibold text-[#0A0A0A]'
                                : 'border-[#E2E8F0] bg-white text-[#94A3B8]'
                            }`}
                          >
                            <span className="truncate">{step.label}</span>
                            {active ? (
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-[#C59B27] shrink-0"
                                aria-hidden="true"
                              />
                            ) : (
                              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#475569]">
                      <span className="font-mono-tabular">
                        Wallets: {result.walletCount} · TXIDs: {result.txHashCount} · Incident:{' '}
                        {result.incidentDate}
                      </span>
                      <Link
                        to={`/portal?ref=${encodeURIComponent(result.caseRef)}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#0A0A0A] hover:text-[#946E00] transition-colors group"
                      >
                        <span>Open Full Portal Dossier</span>
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
