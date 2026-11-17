import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal } from '../components/MotionPrimitives';
import { SCAM_TYPES_DATA } from '../data/scamTypesData';
import {
  BLUEPRINT_LIMITS,
  CaseSubmissionResult,
  CurrencyCode,
  LossCategory,
  PreferredContact,
  submitCaseAssessment,
} from '../lib/caseService';

const LOSS_CATEGORIES: { value: LossCategory; label: string; hint: string }[] = [
  {
    value: 'crypto',
    label: 'Cryptocurrency Transfer Scam',
    hint: 'Pig butchering, Flash-BTC, task scams, or direct wallet transfers',
  },
  {
    value: 'investment',
    label: 'Fake Investment / Trading App',
    hint: 'Cloned brokerage portals, VIP stock groups, or blocked withdrawals',
  },
  {
    value: 'wallet_drain',
    label: 'Wallet Drain / Phishing Signature',
    hint: 'Malicious Permit signatures, fake airdrops, or compromised keys',
  },
  {
    value: 'wire',
    label: 'Bank Transfer / APP Wire Fraud',
    hint: 'Faster Payments, CHAPS, SEPA, or SWIFT bank-impersonation fraud',
  },
  {
    value: 'romance',
    label: 'Romance / Confidence Fraud',
    hint: 'Long-horizon grooming leading to crypto or wire disbursements',
  },
  {
    value: 'other',
    label: 'Corporate BEC / Account Takeover',
    hint: 'Remote desktop compromise, SIM swap, or vendor invoice diversion',
  },
];

const AUTHORITY_OPTIONS = [
  'Action Fraud (UK)',
  'Local Police / Cyber Unit',
  'FBI IC3 (US)',
  'Bank / Card Fraud Team',
  'Financial Ombudsman Service',
  'Instructed Solicitor / Counsel',
  'Not Reported Yet',
];

function parseMultilineEntries(raw: string): string[] {
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const AssessmentPage: React.FC<{ isContactRoute?: boolean }> = ({
  isContactRoute = false,
}) => {
  const [searchParams] = useSearchParams();
  const initialScamParam = searchParams.get('scam') || '';

  const matchedScam = useMemo(
    () => SCAM_TYPES_DATA.find((s) => s.slug === initialScamParam),
    [initialScamParam]
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [lossCategory, setLossCategory] = useState<LossCategory>(
    matchedScam?.lossCategory || 'crypto'
  );
  const [scamTypeSlug, setScamTypeSlug] = useState<string>(
    matchedScam?.slug || 'fake-investment-platforms'
  );
  const [estimatedLossAmount, setEstimatedLossAmount] = useState<string>('25000');
  const [currency, setCurrency] = useState<CurrencyCode>('GBP');
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [platformNames, setPlatformNames] = useState<string>('');
  const [walletsText, setWalletsText] = useState<string>('');
  const [txHashesText, setTxHashesText] = useState<string>('');
  const [narrativeSummary, setNarrativeSummary] = useState<string>('');
  const [reportedAuthorities, setReportedAuthorities] = useState<string[]>([]);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('email');
  const [consentAcknowledged, setConsentAcknowledged] = useState<boolean>(false);

  const [stepError, setStepError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<CaseSubmissionResult | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const toggleAuthority = (authName: string) => {
    setReportedAuthorities((prev) => {
      if (authName === 'Not Reported Yet') {
        return prev.includes(authName) ? [] : [authName];
      }
      const withoutNone = prev.filter((item) => item !== 'Not Reported Yet');
      if (withoutNone.includes(authName)) {
        return withoutNone.filter((item) => item !== authName);
      }
      return [...withoutNone, authName].slice(0, BLUEPRINT_LIMITS.MAX_AUTHORITIES);
    });
  };

  const validateStep = (targetStep: number): boolean => {
    setStepError('');
    if (targetStep === 1) {
      if (!lossCategory || !scamTypeSlug) {
        setStepError('Please select a loss category and specific scam type.');
        return false;
      }
    }
    if (targetStep === 2) {
      const numericLoss = Number(estimatedLossAmount);
      if (Number.isNaN(numericLoss) || numericLoss < 0) {
        setStepError('Please enter a valid non-negative loss amount.');
        return false;
      }
      if (!incidentDate) {
        setStepError('Please specify the approximate incident date.');
        return false;
      }
      if (narrativeSummary.trim().length < BLUEPRINT_LIMITS.MIN_NARRATIVE_LEN) {
        setStepError(
          `Please provide a brief incident summary (at least ${BLUEPRINT_LIMITS.MIN_NARRATIVE_LEN} characters).`
        );
        return false;
      }
    }
    if (targetStep === 4) {
      if (contactName.trim().length < BLUEPRINT_LIMITS.MIN_NAME_LEN) {
        setStepError('Please enter your full name or preferred alias.');
        return false;
      }
      if (!BLUEPRINT_LIMITS.EMAIL_REGEX.test(contactEmail.trim())) {
        setStepError('Please provide a valid email address for confidential correspondence.');
        return false;
      }
      if (!consentAcknowledged) {
        setStepError(
          'Please confirm you understand our advisory scope and that no recovery is guaranteed.'
        );
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    setStepError('');
    try {
      const result = await submitCaseAssessment({
        scamTypeSlug,
        lossCategory,
        estimatedLossAmount: Number(estimatedLossAmount) || 0,
        currency,
        incidentDate,
        reportedAuthorities,
        walletAddresses: parseMultilineEntries(walletsText),
        transactionHashes: parseMultilineEntries(txHashesText),
        platformNames,
        narrativeSummary,
        contactName,
        contactEmail,
        contactPhone,
        preferredContact,
        consentAcknowledged,
      });
      setSubmittedResult(result);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to record your submission right now. Please verify your inputs and retry.';
      setStepError(
        msg.startsWith('{')
          ? 'Submission rejected by security validation. Please verify fields.'
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyRefText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs
        items={[
          { label: isContactRoute ? 'Contact & Confidential Intake' : 'Free Case Assessment' },
        ]}
      />

      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <HeroReveal>
            <p className="text-xs font-semibold text-[#946E00]">
              Confidential Intake · 24-Hour Preliminary Triage
            </p>
            <h1
              className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight max-w-3xl"
              style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)', textWrap: 'balance' }}
            >
              {isContactRoute
                ? 'Contact Chiron Investigations & Start a Case Review'
                : 'Confidential Case Assessment Wizard'}
            </h1>
            <p className="mt-3 text-sm text-[#475569] max-w-2xl leading-relaxed">
              Share the key facts of your incident below. All submissions are assigned a unique Case
              Reference ID immediately so you can verify triage status directly on our homepage or
              inside the Client Portal without logging in.
            </p>
          </HeroReveal>
        </div>
      </section>

      <section className="py-12 bg-architectural-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Main Interactive Wizard / Confirmation */}
            <Reveal className="lg:col-span-8">
              {submittedResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-panel rounded-2xl border-[#D4AF37]/80 p-8 sm:p-10"
                >
                  <div className="flex items-center gap-3 pb-5 border-b border-[#E2E8F0]">
                    <CheckCircle2 className="w-6 h-6 text-[#C59B27]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-[#946E00]">
                        Confidential Intake Logged
                      </p>
                      <h2 className="text-xl font-bold text-[#0A0A0A]">
                        Your Case Assessment Has Been Recorded
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-[#475569] mt-5 leading-relaxed">
                    Retain your Case Reference ID below. This is the only code required to verify
                    your investigation status on our homepage or retrieve your full status timeline
                    and append new transaction hashes in the Client Portal.
                  </p>

                  <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FCF8EA]/50 p-6">
                    <div className="text-xs text-[#475569]">Case Reference ID</div>
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono-tabular text-xl font-bold text-[#0A0A0A]">
                        {submittedResult.caseRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyRefText(submittedResult.caseRef)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 luxury-btn-secondary text-xs font-semibold cursor-pointer"
                      >
                        {copiedRef ? (
                          <Check className="w-3.5 h-3.5 text-[#C59B27]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedRef ? 'Copied' : 'Copy Reference ID'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
                    <Link
                      to={`/portal?ref=${encodeURIComponent(submittedResult.caseRef)}`}
                      className="inline-flex items-center gap-2 px-5 py-3 luxury-btn-primary text-xs font-semibold group"
                    >
                      <span>Open Case in Client Portal</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedResult(null);
                        setStep(1);
                        setNarrativeSummary('');
                        setWalletsText('');
                        setTxHashesText('');
                      }}
                      className="text-xs font-medium text-[#475569] hover:text-[#0A0A0A] cursor-pointer"
                    >
                      Submit Another Assessment
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="glass-panel rounded-2xl p-6 sm:p-8"
                  noValidate
                >
                  {/* Stepper Header */}
                  <div className="grid grid-cols-4 gap-3 pb-6 border-b border-[#E2E8F0]">
                    {[
                      { num: 1, label: 'Category' },
                      { num: 2, label: 'Evidence' },
                      { num: 3, label: 'Reporting' },
                      { num: 4, label: 'Contact' },
                    ].map((s) => (
                      <div
                        key={s.num}
                        className={`pt-2.5 border-t-2 transition-colors ${
                          step >= s.num ? 'border-[#D4AF37]' : 'border-[#E2E8F0]'
                        }`}
                      >
                        <div className="text-[11px] font-mono-tabular text-[#475569]">
                          0{s.num}
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            step === s.num ? 'text-[#0A0A0A]' : 'text-[#475569]'
                          }`}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {stepError && (
                    <div
                      role="alert"
                      className="mt-5 p-4 rounded-xl border border-[#D4AF37] bg-[#FCF8EA] text-xs font-medium text-[#0A0A0A]"
                    >
                      {stepError}
                    </div>
                  )}

                  {submitting && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mt-5 p-4 rounded-xl border border-[#D4AF37]/70 bg-[#FCF8EA]/70 flex items-center gap-3 text-xs font-medium text-[#0A0A0A]"
                    >
                      <Loader2
                        className="w-4 h-4 text-[#946E00] animate-spin shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        Generating your isolated Case Reference ID and committing encrypted intake
                        records...
                      </span>
                    </div>
                  )}

                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-bold text-[#0A0A0A] mb-3">
                          1. Select Primary Loss Category
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {LOSS_CATEGORIES.map((cat) => (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setLossCategory(cat.value)}
                              className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                                lossCategory === cat.value
                                  ? 'border-[#D4AF37] bg-[#FCF8EA]/70 shadow-xs'
                                  : 'border-[#E2E8F0] bg-white/90 hover:bg-white hover:border-[#CBD5E1] hover:shadow-xs'
                              }`}
                            >
                              <div className="text-sm font-semibold text-[#0A0A0A]">
                                {cat.label}
                              </div>
                              <div className="text-xs text-[#475569] mt-1">{cat.hint}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="scam-type-select"
                          className="block text-sm font-bold text-[#0A0A0A] mb-2"
                        >
                          2. Closest Specific Scam Type
                        </label>
                        <select
                          id="scam-type-select"
                          value={scamTypeSlug}
                          onChange={(e) => setScamTypeSlug(e.target.value)}
                          className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37]"
                        >
                          {SCAM_TYPES_DATA.map((scam) => (
                            <option key={scam.slug} value={scam.slug}>
                              {scam.indexLabel}. {scam.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="loss-amount"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Estimated Loss Amount
                          </label>
                          <input
                            id="loss-amount"
                            type="number"
                            min={0}
                            step="any"
                            value={estimatedLossAmount}
                            onChange={(e) => setEstimatedLossAmount(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="loss-currency"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Asset / Currency
                          </label>
                          <select
                            id="loss-currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                          >
                            {['GBP', 'USD', 'EUR', 'BTC', 'ETH', 'USDT', 'USDC', 'OTHER'].map(
                              (c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="incident-date"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Approximate Transfer Date
                          </label>
                          <input
                            id="incident-date"
                            type="date"
                            value={incidentDate}
                            onChange={(e) => setIncidentDate(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="platform-names"
                          className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                        >
                          Platform, App, or Counterparty Domain / Alias (Optional)
                        </label>
                        <input
                          id="platform-names"
                          type="text"
                          maxLength={BLUEPRINT_LIMITS.MAX_PLATFORM_LEN}
                          placeholder="e.g. apex-quant-capital.com, Telegram @broker_desk"
                          value={platformNames}
                          onChange={(e) => setPlatformNames(e.target.value)}
                          className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="wallet-addresses"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Destination Wallet Address(es) (One per line)
                          </label>
                          <textarea
                            id="wallet-addresses"
                            rows={3}
                            placeholder="0x... or bc1q... or T..."
                            value={walletsText}
                            onChange={(e) => setWalletsText(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="tx-hashes"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Transaction Hash(es) / TXIDs (One per line)
                          </label>
                          <textarea
                            id="tx-hashes"
                            rows={3}
                            placeholder="Paste TXIDs if available"
                            value={txHashesText}
                            onChange={(e) => setTxHashesText(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="narrative-summary"
                          className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                        >
                          Summary of Events * (Minimum 20 characters)
                        </label>
                        <textarea
                          id="narrative-summary"
                          rows={4}
                          required
                          maxLength={BLUEPRINT_LIMITS.MAX_NARRATIVE_LEN}
                          placeholder="Briefly describe how contact began, which exchange or bank funded the transfer, and what happened when you attempted to withdraw."
                          value={narrativeSummary}
                          onChange={(e) => setNarrativeSummary(e.target.value)}
                          className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 space-y-5"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#0A0A0A]">
                          3. Have You Reported This Incident Yet?
                        </p>
                        <p className="text-xs text-[#475569] mt-1">
                          Select all agencies, banks, or legal representatives already notified.
                        </p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {AUTHORITY_OPTIONS.map((authName) => {
                            const selected = reportedAuthorities.includes(authName);
                            return (
                              <button
                                key={authName}
                                type="button"
                                onClick={() => toggleAuthority(authName)}
                                className={`p-3.5 rounded-xl border text-left text-sm flex items-center justify-between transition-all duration-150 cursor-pointer ${
                                  selected
                                    ? 'border-[#D4AF37] bg-[#FCF8EA]/70 font-semibold shadow-xs'
                                    : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
                                }`}
                              >
                                <span>{authName}</span>
                                {selected && (
                                  <Check className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Full Name (or Preferred Alias) *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            maxLength={BLUEPRINT_LIMITS.MAX_NAME_LEN}
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Confidential Email Address *
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            maxLength={BLUEPRINT_LIMITS.MAX_EMAIL_LEN}
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Telephone Number (Optional)
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            maxLength={BLUEPRINT_LIMITS.MAX_PHONE_LEN}
                            placeholder="+44 ..."
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="preferred-contact"
                            className="block text-xs font-semibold text-[#0A0A0A] mb-1.5"
                          >
                            Preferred Contact Channel
                          </label>
                          <select
                            id="preferred-contact"
                            value={preferredContact}
                            onChange={(e) =>
                              setPreferredContact(e.target.value as PreferredContact)
                            }
                            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                          >
                            <option value="email">Confidential Email</option>
                            <option value="phone">Direct Telephone Consultation</option>
                            <option value="encrypted_signal">Encrypted Signal Briefing</option>
                          </select>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentAcknowledged}
                          onChange={(e) => setConsentAcknowledged(e.target.checked)}
                          className="mt-1 accent-[#D4AF37] w-4 h-4 shrink-0"
                        />
                        <span className="text-xs text-[#475569] leading-relaxed">
                          I understand that Chiron Investigations Ltd provides independent forensic
                          analysis and documentation, is not a law firm or tax adviser, and cannot
                          guarantee asset recovery or third-party exchange action.
                        </span>
                      </label>
                    </motion.div>
                  )}

                  {/* Wizard Navigation Controls */}
                  <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setStepError('');
                          setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 luxury-btn-secondary text-xs font-semibold cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Previous</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#475569]">
                        Step {step} of 4 · Confidential
                      </span>
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 px-6 py-2.5 luxury-btn-primary text-xs font-semibold cursor-pointer group"
                      >
                        <span>Continue</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-3 luxury-btn-primary text-xs font-semibold disabled:opacity-70 cursor-pointer"
                      >
                        {submitting ? (
                          <Loader2
                            className="w-3.5 h-3.5 text-[#0A0A0A] animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-[#0A0A0A]" aria-hidden="true" />
                        )}
                        <span>
                          {submitting ? 'Encrypting & Submitting...' : 'Submit Confidential Case'}
                        </span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </Reveal>

            {/* Right Sidebar: Direct Office Contact & Security Assurances */}
            <Reveal delay={0.1} className="lg:col-span-4 space-y-6">
              <aside className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-[#0A0A0A]">Direct Investigative Desk</h2>
                <div className="space-y-3 text-xs text-[#475569]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-[#0A0A0A]">Registered Office</div>
                      <div>65 The Base, Victoria Road, Dartford, DA1 5FS</div>
                      <div className="mt-1 text-[11px] font-mono-tabular text-[#475569]">
                        Companies House Reg: 10798623
                      </div>
                      <div className="mt-1 text-[11px] text-[#475569]">
                        United Kingdom [HQ] · Turkey · Cyprus · Georgia · Netherlands
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-[#0A0A0A]">Direct Telephone</div>
                      <a
                        href="tel:+447348226461"
                        className="font-mono-tabular hover:text-[#946E00] hover:underline transition-colors"
                      >
                        +44 73 4822 6461
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1.5">
                      <div>
                        <div className="font-semibold text-[#0A0A0A]">Main Inquiries</div>
                        <a
                          href="mailto:info@chironinvestigations.co.uk"
                          className="hover:text-[#946E00] hover:underline break-all transition-colors"
                        >
                          info@chironinvestigations.co.uk
                        </a>
                      </div>
                      <div>
                        <div className="font-semibold text-[#0A0A0A]">Recovery Department</div>
                        <a
                          href="mailto:recoverydept@chironinvestigations.co.uk"
                          className="hover:text-[#946E00] hover:underline break-all transition-colors"
                        >
                          recoverydept@chironinvestigations.co.uk
                        </a>
                      </div>
                      <div>
                        <div className="font-semibold text-[#0A0A0A]">
                          Edward Camillieri (Principal Investigator)
                        </div>
                        <a
                          href="mailto:edward.camillieri@chironinvestigations.co.uk"
                          className="hover:text-[#946E00] hover:underline break-all transition-colors"
                        >
                          edward.camillieri@chironinvestigations.co.uk
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-3 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-[#0A0A0A]">PII &amp; Security Controls</h3>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Your contact details are isolated from public status lookups via SHA-256
                  credential tokens. Never share private seed phrases or wallet recovery words—we
                  only ever review public wallet addresses and transaction hashes.
                </p>
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <Link
                    to="/portal"
                    className="text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline transition-colors"
                  >
                    Already have a Case Reference ID? Open Portal →
                  </Link>
                </div>
              </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
