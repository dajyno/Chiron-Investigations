import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckSquare, ShieldCheck, Square } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal, RevealItem, RevealStagger } from '../components/MotionPrimitives';

const METHODOLOGY_PHASES = [
  {
    phase: 'Phase 01',
    duration: 'Hours 0–24',
    title: 'Confidential Intake & Viability Triage',
    summary:
      'We verify the initial chain of custody, check whether funds reached regulated custodians or domestic banking rails, and advise candidly on feasibility before any paid work begins.',
    actions: [
      'Review victim-provided TXIDs, wallet addresses, and platform domains',
      'Perform rapid 2–3 hop screening to check for KYC exchange exposure vs. sanctioned mixers',
      'Issue clear written guidance: Recovery Referral Path or Tax-Loss Documentation Path',
    ],
  },
  {
    phase: 'Phase 02',
    duration: 'Days 2–7',
    title: 'Multi-Chain Tracing, Clustering & OSINT Enrichment',
    summary:
      'Specialists execute manual and heuristic graph tracing across UTXO, EVM, Tron, and Solana networks while correlating infrastructure hosted by the perpetrator syndicate.',
    actions: [
      'De-obfuscate peel chains, decentralized exchange swaps, and cross-chain bridges',
      'Correlate domain WHOIS history, hosting IP clusters, and spoofed trading app binaries',
      'Identify specific Virtual Asset Service Provider (VASP) deposit addresses and timestamps',
    ],
  },
  {
    phase: 'Phase 03',
    duration: 'Days 7–12',
    title: 'Legal, Law Enforcement & Fiscal Coordination',
    summary:
      'Findings are compiled into an agency-legible dossier designed for immediate action by police cybercrime units, bank fraud teams, civil solicitors, or chartered tax advisers.',
    actions: [
      'Deliver court-formatted chain-of-custody PDF and CSV hash schedules',
      'Prepare Action Fraud, FBI IC3, or Financial Ombudsman (APP fraud) referral briefs',
      'Provide Section 165 / HMRC Negligible Value valuation packs where tracing confirms unrecoverability',
    ],
  },
];

const EVIDENCE_CHECKLIST = [
  'Originating exchange or bank account purchase receipts',
  'All destination cryptocurrency wallet addresses provided by the counterparty',
  'Transaction hashes (TXIDs) for every outbound transfer',
  'Platform URLs, app installer links, or broker account screenshots',
  'Preserved WhatsApp, Telegram, email, or SMS conversation logs',
  'Existing Action Fraud, IC3, or bank fraud reference numbers (if already filed)',
];

export const HowItWorksPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (label: string) => {
    setCheckedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs items={[{ label: 'How It Works' }]} />

      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <HeroReveal>
            <p className="text-xs font-semibold text-[#946E00]">Forensic Methodology</p>
            <h1
              className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight max-w-3xl"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
            >
              From Fragmented Screenshots to Court-Formatted Attribution
            </h1>
            <p className="mt-4 text-base text-[#475569] leading-relaxed max-w-2xl">
              Our three-phase process eliminates guesswork. You know within 24 hours of intake
              whether on-chain attribution can support a referral—or whether documented loss
              verification is the most responsible course.
            </p>
          </HeroReveal>
        </div>
      </section>

      <section className="border-b border-[#E2E8F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger className="space-y-6">
            {METHODOLOGY_PHASES.map((item) => (
              <RevealItem key={item.phase}>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)] hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/80 transition-all duration-200">
                  <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#E2E8F0] pb-6 lg:pb-0 lg:pr-8">
                    <div className="text-xs font-mono-tabular font-semibold text-[#946E00]">
                      {item.phase} · {item.duration}
                    </div>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mt-2">{item.title}</h2>
                    <p className="text-sm text-[#475569] mt-3 leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="lg:col-span-8 flex flex-col justify-center">
                    <div className="text-xs font-semibold text-[#0A0A0A] mb-3">
                      Operational Activities
                    </div>
                    <ul className="space-y-3 text-sm text-[#334155]">
                      {item.actions.map((action) => (
                        <li key={action} className="flex items-start gap-3">
                          <ShieldCheck
                            className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Interactive Evidence Readiness Checklist */}
      <section className="bg-architectural-grid py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="glass-panel rounded-2xl p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <p className="text-xs font-semibold text-[#946E00]">Pre-Intake Preparation</p>
                  <h2 className="text-xl font-bold text-[#0A0A0A] mt-1">
                    Interactive Evidence Readiness Checklist
                  </h2>
                </div>
                <div className="text-xs font-mono-tabular font-semibold text-[#0A0A0A] bg-[#FCF8EA] border border-[#D4AF37]/60 rounded-xl px-3.5 py-2">
                  {completedCount} / {EVIDENCE_CHECKLIST.length} Prepared
                </div>
              </div>

              <p className="text-sm text-[#475569] mt-4">
                You do not need every item below to request an assessment—our analysts can often
                reconstruct missing hashes from exchange withdrawal exports—but ticking what you
                have helps speed up triage.
              </p>

              <div className="mt-6 space-y-2.5">
                {EVIDENCE_CHECKLIST.map((label) => {
                  const checked = !!checkedItems[label];
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleItem(label)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                        checked
                          ? 'border-[#D4AF37] bg-[#FCF8EA]/60 shadow-xs'
                          : 'border-[#E2E8F0] bg-white/85 hover:bg-white hover:border-[#CBD5E1] hover:shadow-xs'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#C59B27] shrink-0" aria-hidden="true" />
                      ) : (
                        <Square className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                      )}
                      <span className="text-sm text-[#0A0A0A]">{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#475569]">
                  Ready to submit your details securely? You will receive a Portal Reference ID
                  immediately.
                </span>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 px-5 py-3 luxury-btn-primary text-xs font-semibold group"
                >
                  <span>Proceed to Assessment Wizard</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
