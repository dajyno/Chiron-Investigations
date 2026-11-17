import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  MapPin,
  Pause,
  Phone,
  Play,
  Scale,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { HeroReveal, Reveal, RevealItem, RevealStagger } from '../components/MotionPrimitives';
import { ResilientImage } from '../components/ResilientImage';
import { VerifyCaseWidget } from '../components/VerifyCaseWidget';
import { SCAM_TYPES_DATA } from '../data/scamTypesData';
import {
  FEATURED_IN_OUTLETS,
  GLOBAL_JURISDICTIONS,
  REVIEWS_GRID,
  TEAM_MEMBERS,
  TESTIMONIALS,
} from '../data/editorialData';

export const HomePage: React.FC = () => {
  const [teamIndex, setTeamIndex] = useState(0);
  const [teamPaused, setTeamPaused] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [briefingOpen, setBriefingOpen] = useState(false);

  useEffect(() => {
    if (teamPaused) return;
    const timer = window.setInterval(() => {
      setTeamIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [teamPaused]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const activeTestimonial = TESTIMONIALS[testimonialIndex];

  return (
    <div className="bg-white text-[#0A0A0A]">
      {/* 1. HERO SECTION */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <HeroReveal className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-[#475569] mb-4">
                  United Kingdom Financial Intelligence · Global Blockchain Forensics · International
                </p>
                <h1
                  className="font-display font-bold text-[#0A0A0A] tracking-tight leading-[1.08] max-w-2xl"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.65rem)', textWrap: 'balance' }}
                >
                  Have you lost cryptocurrency or funds to an online scam?
                </h1>
                <p className="mt-5 text-lg text-[#334155] italic leading-relaxed max-w-xl">
                  Take a breath. Whether you were misled by a fraudulent trading platform, a romance
                  contact, or a wallet drain, you deserve an honest forensic answer—never pressure
                  or false promises.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/assessment"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 luxury-btn-primary text-sm font-semibold whitespace-nowrap shrink-0 group"
                  >
                    <span>Start Free Case Assessment</span>
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                  <a
                    href="tel:+447348226461"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 luxury-btn-secondary text-sm font-semibold whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                    <span>Speak with an investigator</span>
                  </a>
                </div>

                <p className="mt-4 text-xs text-[#475569]">
                  100% confidential · no obligation · no guaranteed outcomes
                </p>
              </div>
            </HeroReveal>

            {/* Video Briefing Embed Card with Frosted Glass Controls */}
            <HeroReveal delay={0.1} className="lg:col-span-5 flex flex-col">
              <div className="relative flex-1 min-h-[280px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden flex flex-col shadow-[0_14px_38px_-12px_rgba(10,10,10,0.12)] hover:shadow-[0_20px_48px_-12px_rgba(10,10,10,0.16)] transition-shadow duration-300 group">
                <div className="relative flex-1 min-h-[220px] overflow-hidden">
                  <ResilientImage
                    src="/src/assets/images/hero_forensic_briefing_1794892806078.jpg"
                    alt="Chiron Investigations briefing room"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    fallbackTitle="Forensic Briefing Room"
                  />
                  <div className="absolute inset-0 bg-black/28 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setBriefingOpen(true)}
                      aria-label="Play investigator briefing overview"
                      className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/85 backdrop-blur-md text-[#0A0A0A] border border-white/80 text-xs font-semibold shadow-[0_10px_28px_rgba(10,10,10,0.22)] hover:bg-white hover:scale-[1.03] transition-all duration-200 cursor-pointer"
                    >
                      <Play className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                      <span>Watch 2-Min Intake Briefing</span>
                    </button>
                  </div>
                </div>
                <div className="px-5 py-3.5 bg-white/90 backdrop-blur-md border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                  <span className="font-semibold text-[#0A0A0A]">
                    What Realistic Recovery Looks Like
                  </span>
                  <span className="font-mono-tabular">02:18 · Transcript Available</span>
                </div>
              </div>
            </HeroReveal>
          </div>

          {/* 4-column Institutional KPI Strip */}
          <HeroReveal delay={0.16}>
            <div className="mt-12 pt-8 border-t border-[#E2E8F0] grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-xl p-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="font-display font-bold text-2xl text-[#0A0A0A] font-mono-tabular">
                  £42.8M+
                </div>
                <div className="text-xs text-[#475569] mt-1">
                  Illicit asset flows traced across 14 blockchains (2022–2026)
                </div>
              </div>
              <div className="rounded-xl p-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="font-display font-bold text-2xl text-[#0A0A0A] font-mono-tabular">
                  24 hrs
                </div>
                <div className="text-xs text-[#475569] mt-1">
                  Initial triage turnaround on confidential case assessments
                </div>
              </div>
              <div className="rounded-xl p-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="font-display font-bold text-2xl text-[#0A0A0A] font-mono-tabular">
                  38+
                </div>
                <div className="text-xs text-[#475569] mt-1">
                  Countries covered with law enforcement &amp; counsel referrals
                </div>
              </div>
              <div className="rounded-xl p-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="font-display font-bold text-2xl text-[#0A0A0A] font-mono-tabular">
                  100%
                </div>
                <div className="text-xs text-[#475569] mt-1">
                  Transparent feasibility screening prior to any paid mandate
                </div>
              </div>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* Briefing Video Modal */}
      {briefingOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="briefing-modal-title"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] shadow-[0_28px_70px_-15px_rgba(10,10,10,0.28)] max-w-2xl w-full p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <p className="text-xs font-semibold text-[#946E00]">Executive Intake Briefing</p>
                <h2 id="briefing-modal-title" className="text-xl font-bold text-[#0A0A0A] mt-1">
                  How Chiron Evaluates Cryptocurrency &amp; Wire Fraud Cases
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close briefing dialog"
                onClick={() => setBriefingOpen(false)}
                className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#0A0A0A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-5 space-y-4 text-sm text-[#334155] leading-relaxed">
              <div className="aspect-video rounded-xl bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center border border-[#E2E8F0]">
                <ShieldCheck className="w-8 h-8 text-[#D4AF37] mb-3" aria-hidden="true" />
                <p className="text-sm font-medium max-w-md">
                  Principal Investigator Edward Camillieri explains our two-path triage framework:
                  verifying VASP exit routes before recommending tracing, or issuing tax-loss
                  documentation when recovery is unviable.
                </p>
                <p className="text-xs text-[#94A3B8] mt-3 font-mono-tabular">
                  CHIRON BRIEFING · UK HEADQUARTERS · SECURE TRANSCRIPT BELOW
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-xs text-[#475569] space-y-2">
                <p>
                  <strong className="text-[#0A0A0A]">00:00 – 00:45:</strong> Why immediate evidence
                  preservation (TXIDs, wallet strings, domain screenshots, bank MT103 slips) matters
                  more than confronting perpetrators.
                </p>
                <p>
                  <strong className="text-[#0A0A0A]">00:45 – 01:35:</strong> Separating viable
                  exchange-attributed cases from mixed or unrecoverable transfers—so you never pay
                  for speculative tracing.
                </p>
                <p>
                  <strong className="text-[#0A0A0A]">01:35 – 02:18:</strong> Submitting structured
                  dossiers to Action Fraud, FBI IC3, Financial Ombudsman adjudicators, or your tax
                  adviser.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBriefingOpen(false)}
                  className="px-4 py-2 text-xs font-medium luxury-btn-secondary cursor-pointer"
                >
                  Close Briefing
                </button>
                <Link
                  to="/assessment"
                  onClick={() => setBriefingOpen(false)}
                  className="px-5 py-2 text-xs font-semibold luxury-btn-primary"
                >
                  Begin Free Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEATURED IN LOGO MARQUEE */}
      <section aria-label="Featured media outlets" className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <Reveal yOffset={12}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-xs font-semibold text-[#475569] whitespace-nowrap shrink-0">
              Commentary &amp; Citations In
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee flex items-center gap-12">
                {[...FEATURED_IN_OUTLETS, ...FEATURED_IN_OUTLETS].map((outlet, idx) => (
                  <span
                    key={`${outlet}-${idx}`}
                    className="font-display text-sm font-semibold tracking-tight text-[#334155] whitespace-nowrap"
                  >
                    {outlet}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. TRUST STRIP */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#D4AF37]/60 bg-white p-5 shadow-[0_6px_22px_-8px_rgba(212,175,55,0.16)] hover:shadow-[0_12px_30px_-8px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all duration-200">
                <h2 className="text-sm font-semibold text-[#0A0A0A]">Who We Are</h2>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Former financial crime analysts, intelligence officers, and certified fraud
                  examiners operating independently from 65 The Base, Victoria Road, Dartford, DA1
                  5FS.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_18px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_12px_28px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/70 hover:-translate-y-0.5 transition-all duration-200">
                <h2 className="text-sm font-semibold text-[#0A0A0A]">Global Reach</h2>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Cross-border evidentiary formatting aligned with Action Fraud, UK ROCUs, FBI IC3,
                  Europol liaison desks, and Singapore CAD.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_18px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_12px_28px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/70 hover:-translate-y-0.5 transition-all duration-200">
                <h2 className="text-sm font-semibold text-[#0A0A0A]">Corporate Registrations</h2>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed font-mono-tabular">
                  Companies House: 10798623
                  <br />
                  Registered Office: Dartford, UK
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_18px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_12px_28px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/70 hover:-translate-y-0.5 transition-all duration-200">
                <h2 className="text-sm font-semibold text-[#0A0A0A]">No False Promises</h2>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  We decline engagements where on-chain tracing offers zero realistic prospect, or
                  guide clients openly toward verified tax-loss documentation.
                </p>
              </div>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* VERIFY CASE ID WIDGET (No Login Required) */}
      <VerifyCaseWidget />

      {/* 4. THE PEOPLE ON YOUR CASE (Auto-Scrolling Team Carousel) */}
      <section className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
                  The People on Your Case
                </h2>
                <p className="text-sm text-[#475569] mt-2 max-w-2xl">
                  Every file is reviewed by named human specialists—never outsourced call centres or
                  automated script mills.
                </p>
              </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label={teamPaused ? 'Resume team carousel' : 'Pause team carousel'}
                onClick={() => setTeamPaused((prev) => !prev)}
                className="p-2.5 rounded-full border border-[#E2E8F0] bg-white shadow-xs hover:bg-[#FCF8EA] hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                {teamPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                type="button"
                aria-label="Previous team specialist"
                onClick={() =>
                  setTeamIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length)
                }
                className="p-2.5 rounded-full border border-[#E2E8F0] bg-white shadow-xs hover:bg-[#FCF8EA] hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next team specialist"
                onClick={() => setTeamIndex((prev) => (prev + 1) % TEAM_MEMBERS.length)}
                className="p-2.5 rounded-full border border-[#E2E8F0] bg-white shadow-xs hover:bg-[#FCF8EA] hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                to="/about"
                className="ml-2 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline whitespace-nowrap transition-colors"
              >
                Full Team &amp; Pedigree →
              </Link>
            </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const member = TEAM_MEMBERS[(teamIndex + offset) % TEAM_MEMBERS.length];
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0.7, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col shadow-[0_6px_24px_-10px_rgba(10,10,10,0.06)] hover:shadow-[0_18px_40px_-12px_rgba(10,10,10,0.12)] hover:-translate-y-1 hover:border-[#D4AF37]/80 transition-all duration-200 group"
                >
                  <div className="aspect-[4/3] bg-[#F1F5F9] border-b border-[#E2E8F0] overflow-hidden">
                    {member.image ? (
                      <ResilientImage
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                        fallbackTitle={member.name}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F1F5F9] text-[#0A0A0A]">
                        <span className="font-display text-3xl font-bold tracking-tight">
                          {member.initials}
                        </span>
                        <span className="text-xs text-[#475569] mt-1">{member.role}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-[#475569]">{member.credentials}</p>
                      <h3 className="text-lg font-bold text-[#0A0A0A] mt-1">{member.name}</h3>
                      <p className="text-xs font-semibold text-[#946E00] mt-0.5">{member.role}</p>
                      <p className="text-sm text-[#475569] mt-3 leading-relaxed">{member.bio}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
                      <Link
                        to="/about"
                        className="text-xs font-semibold text-[#0A0A0A] group-hover:text-[#946E00] hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        <span>View specialist profile</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TWO PATHS */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
              Two Clear Paths Based on What the Blockchain Actually Shows
            </h2>
            <p className="text-sm text-[#475569] mt-2 leading-relaxed">
              Before recommending any formal engagement, we evaluate whether your stolen assets can
              be traced to an identifiable custodian—or whether fiscal loss documentation protects
              your position best.
            </p>
          </Reveal>

          <RevealStagger className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Path 1 */}
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#D4AF37]/80 bg-white p-8 flex flex-col justify-between shadow-[0_8px_30px_-10px_rgba(212,175,55,0.18)] hover:shadow-[0_18px_44px_-12px_rgba(212,175,55,0.28)] hover:-translate-y-0.5 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                  <span className="text-xs font-semibold text-[#946E00]">
                    Path 01 · Recovery &amp; Referral
                  </span>
                  <Search className="w-5 h-5 text-[#C59B27]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mt-5">
                  Trace Funds &amp; Build Evidentiary Referral Dossiers
                </h3>
                <p className="text-sm text-[#475569] mt-3 leading-relaxed">
                  When funds flow into KYC-regulated exchanges, brokerages, or UK/EU bank accounts,
                  we map every hop and compile agency-ready packages for Action Fraud, local police
                  cyber units, FBI IC3, banks (APP reimbursement), and civil litigation solicitors.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-[#0A0A0A]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C59B27] font-bold">·</span>
                    <span>Multi-chain wallet clustering &amp; bridge attribution</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C59B27] font-bold">·</span>
                    <span>VASP deposit identification for preservation requests</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C59B27] font-bold">·</span>
                    <span>APP bank transfer &amp; Financial Ombudsman evidence packs</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-5 border-t border-[#E2E8F0] flex flex-wrap gap-5">
                <Link
                  to="/services/blockchain-tracing"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline transition-colors group"
                >
                  <span>Blockchain Tracing</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/services/law-enforcement-support"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline transition-colors group"
                >
                  <span>Law Enforcement Support</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
              </div>
            </RevealItem>

            {/* Path 2 */}
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 backdrop-blur-sm p-8 flex flex-col justify-between shadow-[0_6px_24px_-10px_rgba(10,10,10,0.05)] hover:shadow-[0_16px_38px_-12px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/70 hover:-translate-y-0.5 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                  <span className="text-xs font-semibold text-[#475569]">
                    Path 02 · Financial Preservation
                  </span>
                  <FileText className="w-5 h-5 text-[#C59B27]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mt-5">
                  Substantiated Tax &amp; Capital Loss Documentation
                </h3>
                <p className="text-sm text-[#475569] mt-3 leading-relaxed">
                  If initial triage shows your assets passed through sanctioned mixers, defunct
                  offshore entities, or unrecoverable pools, we tell you plainly—and prepare
                  audit-ready deprivation and valuation documentation for your CPA or chartered
                  accountant.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-[#0A0A0A]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C59B27] font-bold">·</span>
                    <span>US IRS Section 165(c)(2) &amp; casualty/theft substantiation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C59B27] font-bold">·</span>
                    <span>UK HMRC Capital Gains Negligible Value schedules</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C59B27] font-bold">·</span>
                    <span>Verified acquisition cost basis &amp; irrecoverability memo</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-5 border-t border-[#E2E8F0] flex flex-wrap gap-5">
                <Link
                  to="/services/asset-recovery-solutions"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline transition-colors group"
                >
                  <span>Asset Recovery Solutions</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/services/cryptocurrency-scams"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline transition-colors group"
                >
                  <span>Cryptocurrency Scams Triage</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
              </div>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* 6. TESTIMONIAL CAROUSEL */}
      <section className="border-b border-[#E2E8F0] bg-architectural-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-[#946E00]">Verified Client Outcomes</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() =>
                    setTestimonialIndex(
                      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                    )
                  }
                  className="p-2.5 rounded-full border border-[#E2E8F0] bg-white shadow-xs hover:bg-[#FCF8EA] hover:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
                  className="p-2.5 rounded-full border border-[#E2E8F0] bg-white shadow-xs hover:bg-[#FCF8EA] hover:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-8 sm:p-10 transition-shadow duration-200 hover:shadow-[0_18px_48px_-14px_rgba(10,10,10,0.12)]">
              <blockquote className="text-lg sm:text-xl font-medium text-[#0A0A0A] leading-relaxed">
                “{activeTestimonial.quote}”
              </blockquote>
              <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#475569]">
                <div>
                  <span className="font-semibold text-[#0A0A0A]">{activeTestimonial.author}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{activeTestimonial.role}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{activeTestimonial.jurisdiction}</span>
                </div>
                <div className="font-semibold text-[#946E00]">{activeTestimonial.outcome}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. CONFIDENTIAL ASSESSMENT CTA BANNER */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Reveal>
            <div className="rounded-2xl border border-[#D4AF37]/70 bg-white/90 backdrop-blur-md p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[0_12px_36px_-12px_rgba(212,175,55,0.2)] hover:shadow-[0_18px_46px_-12px_rgba(212,175,55,0.28)] transition-shadow duration-200">
              <div className="max-w-2xl">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A]">
                  Request a Confidential Forensic Feasibility Review
                </h2>
                <p className="text-sm text-[#475569] mt-2">
                  Submit wallet addresses, transaction hashes, or payment confirmations securely.
                  You receive an instant Case Reference ID to track triage progress in our Client
                  Portal.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to="/assessment"
                  className="px-5 py-3 luxury-btn-primary text-xs font-semibold whitespace-nowrap"
                >
                  Open Assessment Wizard
                </Link>
                <Link
                  to="/portal"
                  className="px-5 py-3 luxury-btn-secondary text-xs font-semibold whitespace-nowrap"
                >
                  Client Portal Lookup
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. EXPERT SPOTLIGHT */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <Reveal className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden shadow-[0_12px_34px_-12px_rgba(10,10,10,0.1)] hover:shadow-[0_18px_44px_-12px_rgba(10,10,10,0.16)] transition-shadow duration-200 group">
                <div className="overflow-hidden">
                  <ResilientImage
                    src="/src/assets/images/expert_spotlight_portrait_1794892806701.jpg"
                    alt="Edward Camillieri, Managing Director & Principal Investigator at Chiron Investigations"
                    className="w-full aspect-[4/5] object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                    fallbackTitle="Edward Camillieri"
                  />
                </div>
                <div className="p-5 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
                  <div className="text-sm font-bold text-[#0A0A0A]">Edward Camillieri</div>
                  <div className="text-xs text-[#475569]">
                    Managing Director &amp; Principal Investigator · United Kingdom
                  </div>
                  <a
                    href="mailto:edward.camillieri@chironinvestigations.co.uk"
                    className="inline-block text-xs font-semibold text-[#946E00] hover:underline mt-1.5 break-all"
                  >
                    edward.camillieri@chironinvestigations.co.uk
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7 space-y-5">
              <p className="text-xs font-semibold text-[#946E00]">Principal Investigator Note</p>
              <blockquote className="font-display text-2xl sm:text-3xl font-bold text-[#0A0A0A] leading-snug">
                “The worst disservice to a fraud victim is selling certainty where none exists. Our
                job is to replace panic with verifiable on-chain evidence.”
              </blockquote>
              <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
                Every week our UK desk turns away cases where upfront tracing fees would exceed any
                plausible recovery prospect. When a case is viable—because funds touched a regulated
                exchange or domestic payment rail—we build a dossier that police, banks, and
                solicitors can immediately act upon.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline transition-colors group"
                >
                  <span>Read about our intelligence standards &amp; ethics</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 9. FRAUD-TYPES GRID (9 CARDS) */}
      <section className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
                  Scam Types We Investigate
                </h2>
                <p className="text-sm text-[#475569] mt-2 max-w-2xl">
                  Select your situation below to review required evidence, warning indicators, and
                  realistic investigative pathways.
                </p>
              </div>
              <Link
                to="/scam-types"
                className="text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline whitespace-nowrap transition-colors"
              >
                View Scam Types Hub →
              </Link>
            </div>
          </Reveal>

          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCAM_TYPES_DATA.map((scam) => (
              <RevealItem key={scam.slug}>
                <Link
                  to={`/scam-types/${scam.slug}`}
                  className="h-full group bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#D4AF37] p-6 shadow-[0_4px_18px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-[#0A0A0A] group-hover:text-[#946E00] transition-colors">
                      {scam.title}
                    </h3>
                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">{scam.summary}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#0A0A0A]">
                    <span>Review evidence guide</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 10. WHAT HAPPENS NEXT (3 STEPS LINKING TO /process) */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">What Happens Next</h2>
              </div>
              <Link
                to="/process"
                className="text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline whitespace-nowrap transition-colors"
              >
                Read Full Forensic Methodology →
              </Link>
            </div>
          </Reveal>

          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/80 hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-xs font-mono-tabular font-semibold text-[#946E00]">
                  Step 01 · Day 1
                </div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mt-2">
                  Confidential Intake &amp; Triage
                </h3>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                  Submit TXIDs, receiving addresses, and platform details via our encrypted intake
                  wizard. An analyst reviews initial viability within 24 hours.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/80 hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-xs font-mono-tabular font-semibold text-[#946E00]">
                  Step 02 · Days 2–7
                </div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mt-2">
                  Multi-Chain Tracing &amp; Clustering
                </h3>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                  For instructed mandates, specialists trace cross-chain swaps, peel chains, and
                  OSINT infrastructure to attribute VASP endpoints.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/80 hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-xs font-mono-tabular font-semibold text-[#946E00]">
                  Step 03 · Days 7–12
                </div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mt-2">
                  Enforcement or Tax-Loss Dossier
                </h3>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                  Receive your court-formatted report for Action Fraud, FBI IC3, bank Ombudsman
                  appeals, or CPA Section 165 / HMRC filings.
                </p>
              </div>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* 11. REVIEWS GRID (6 CARDS) */}
      <section className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold text-[#946E00]">Client Feedback</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] mt-1">
                  Verified Advisory Reviews
                </h2>
              </div>
              <Link
                to="/case-studies"
                className="text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline whitespace-nowrap transition-colors"
              >
                Inspect Anonymized Case Dossiers →
              </Link>
            </div>
          </Reveal>

          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS_GRID.map((review) => (
              <RevealItem key={review.id}>
                <article className="h-full bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col justify-between shadow-[0_4px_20px_-8px_rgba(10,10,10,0.05)] hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.11)] hover:border-[#D4AF37]/70 hover:-translate-y-0.5 transition-all duration-200">
                  <div>
                    <div className="text-xs text-[#475569]">
                      {review.caseType} · {review.date}
                    </div>
                    <p className="text-sm text-[#0A0A0A] mt-3 leading-relaxed">“{review.quote}”</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#0A0A0A]">{review.author}</span>
                      <span className="text-[#475569]"> · {review.location}</span>
                    </div>
                    <span className="font-semibold text-[#946E00]">{review.outcome}</span>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 12. CLOSING CTA BANNER + REDESIGNED WE WORK GLOBALLY SECTION */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal>
            <div className="rounded-2xl border border-[#D4AF37]/70 bg-white p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-[0_14px_40px_-14px_rgba(212,175,55,0.22)] hover:shadow-[0_20px_52px_-14px_rgba(212,175,55,0.3)] transition-shadow duration-200">
              <Scale className="w-6 h-6 text-[#C59B27] mx-auto mb-3" aria-hidden="true" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
                Speak With an Investigator Before Paying Any Recovery Fee
              </h2>
              <p className="text-sm text-[#475569] mt-3 max-w-2xl mx-auto leading-relaxed">
                Submit your case particulars confidentially or call our investigative desk for an
                unhurried preliminary view. No obligation, no pressure, and zero upfront recovery
                guarantees.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/assessment"
                  className="px-6 py-3.5 luxury-btn-primary text-sm font-semibold"
                >
                  Start Free Case Assessment
                </Link>
                <a
                  href="tel:+447348226461"
                  className="px-6 py-3.5 luxury-btn-secondary text-sm font-semibold font-mono-tabular"
                >
                  Call +44 73 4822 6461
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Redesigned We Work Globally Section — Frosted Glass Jurisdiction Cards over Architectural Grid */}
        <div className="border-t border-[#E2E8F0] bg-architectural-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Reveal>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#946E00]">
                    <Globe className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                    <span>Cross-Border Mandate Coverage</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] mt-2">
                    We Work Globally
                  </h2>
                  <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                    Operating across five strategic investigative jurisdictions to coordinate
                    exchange preservation requests, evidentiary dossiers, and regional legal
                    liaison.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 luxury-btn-secondary text-xs font-semibold whitespace-nowrap self-start lg:self-auto"
                >
                  <span>Coordinate Cross-Border Intake</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {GLOBAL_JURISDICTIONS.map((item, idx) => {
                const isHq = idx === 0;
                return (
                  <RevealItem key={item.region}>
                    <div
                      className={`h-full glass-panel rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(10,10,10,0.14)] group ${
                        isHq
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                          : 'hover:border-[#D4AF37]/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-[#0A0A0A] group-hover:text-[#946E00] transition-colors">
                            {item.region}
                          </h3>
                          <MapPin
                            className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                              isHq
                                ? 'text-[#C59B27]'
                                : 'text-[#94A3B8] group-hover:text-[#C59B27]'
                            }`}
                            aria-hidden="true"
                          />
                        </div>

                        <p className="text-[11px] font-semibold text-[#946E00] mt-1">
                          {item.deskType}
                        </p>
                        <p className="text-xs text-[#475569] mt-3 leading-relaxed">{item.focus}</p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#E2E8F0]/80 flex items-center justify-between text-[11px] font-medium text-[#475569]">
                        <span>Active Liaison</span>
                        <span className="text-[#C59B27] font-semibold group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          </div>
        </div>
      </section>
    </div>
  );
};
