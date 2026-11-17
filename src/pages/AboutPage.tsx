import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Lock, Scale, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal, RevealItem, RevealStagger } from '../components/MotionPrimitives';
import { ResilientImage } from '../components/ResilientImage';
import { TEAM_MEMBERS } from '../data/editorialData';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <HeroReveal className="lg:col-span-7">
              <p className="text-xs font-semibold text-[#946E00]">
                Chiron Investigations Ltd · 65 The Base, Victoria Road, Dartford, DA1 5FS
              </p>
              <h1
                className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight"
                style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
              >
                Intelligence-Grade Forensic Discipline for Digital Asset Disputes
              </h1>
              <p className="mt-4 text-base text-[#475569] leading-relaxed max-w-2xl">
                Headquartered at 65 The Base, Victoria Road, Dartford, DA1 5FS and founded by
                former financial crime specialists, blockchain analysts, and public-sector cyber
                intelligence researchers, Chiron Investigations bridges the gap between distressed
                fraud victims and the evidentiary standards demanded by law enforcement, banks, and
                civil courts.
              </p>
            </HeroReveal>
            <HeroReveal delay={0.08} className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden shadow-[0_12px_34px_-12px_rgba(10,10,10,0.1)] hover:shadow-[0_18px_44px_-12px_rgba(10,10,10,0.16)] transition-shadow duration-200">
                <ResilientImage
                  src="/src/assets/images/hero_forensic_briefing_1794892806078.jpg"
                  alt="Chiron Investigations forensic briefing suite"
                  className="w-full aspect-[16/10] object-cover"
                  fallbackTitle="65 The Base, Victoria Road, Dartford, DA1 5FS"
                />
              </div>
            </HeroReveal>
          </div>
        </div>
      </section>

      {/* Pedigree & Compliance Standards */}
      <section className="border-b border-[#E2E8F0] bg-architectural-grid py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-8">
              Institutional Pedigree &amp; Compliance Commitments
            </h2>
          </Reveal>
          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RevealItem>
              <div className="h-full glass-panel rounded-2xl p-6 hover:-translate-y-0.5 hover:border-[#D4AF37]/80 hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.12)] transition-all duration-200">
                <ShieldCheck className="w-5 h-5 text-[#C59B27] mb-3" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#0A0A0A]">Defence &amp; Cyber Alumni</h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Senior leadership includes alumni of NATO cooperative cyber research initiatives
                  and UK financial intelligence desks.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full glass-panel rounded-2xl p-6 hover:-translate-y-0.5 hover:border-[#D4AF37]/80 hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.12)] transition-all duration-200">
                <Lock className="w-5 h-5 text-[#C59B27] mb-3" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#0A0A0A]">Strict Data Governance</h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Companies House Reg. 10798623 with UK GDPR-aligned intake handling,
                  compartmentalized PII storage, and encrypted lookup tokens.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full glass-panel rounded-2xl p-6 hover:-translate-y-0.5 hover:border-[#D4AF37]/80 hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.12)] transition-all duration-200">
                <Scale className="w-5 h-5 text-[#C59B27] mb-3" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#0A0A0A]">Ethical Fee Transparency</h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Clear fixed-scope fees agreed only after initial viability triage. We never demand
                  unverified &quot;release taxes&quot; or guarantee recovery.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full glass-panel rounded-2xl p-6 hover:-translate-y-0.5 hover:border-[#D4AF37]/80 hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.12)] transition-all duration-200">
                <Award className="w-5 h-5 text-[#C59B27] mb-3" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#0A0A0A]">Evidentiary Rigour</h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Every clustering assertion is backed by reproducible TXIDs, block heights, and
                  documented attribution heuristics.
                </p>
              </div>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* Full Leadership & Specialist Profiles */}
      <section className="border-b border-[#E2E8F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#946E00]">Leadership &amp; Analysts</p>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mt-1">Investigative Specialists</h2>
          </Reveal>

          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <RevealItem key={member.id}>
                <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden flex flex-col justify-between shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)] hover:shadow-[0_16px_38px_-12px_rgba(10,10,10,0.12)] hover:border-[#D4AF37]/80 hover:-translate-y-1 transition-all duration-200 group">
                  <div>
                    <div className="aspect-[4/3] bg-[#F1F5F9] border-b border-[#E2E8F0] overflow-hidden">
                      {member.image ? (
                        <ResilientImage
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                          fallbackTitle={member.name}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <span className="font-display text-3xl font-bold text-[#0A0A0A]">
                            {member.initials}
                          </span>
                          <span className="text-xs text-[#475569] mt-1">{member.role}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-[#475569]">{member.credentials}</div>
                      <h3 className="text-lg font-bold text-[#0A0A0A] mt-1">{member.name}</h3>
                      <div className="text-xs font-semibold text-[#946E00] mt-0.5">
                        {member.role}
                      </div>
                      <p className="text-sm text-[#475569] mt-3 leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="py-12 bg-[#F8FAFC]">
        <Reveal>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0A0A0A]">
                Need an independent preliminary opinion on your case?
              </h2>
              <p className="text-sm text-[#475569] mt-1">
                Start a confidential case review or speak directly with our UK investigative desk.
              </p>
            </div>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 luxury-btn-primary text-xs font-semibold shrink-0 group"
            >
              <span>Request Free Assessment</span>
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
