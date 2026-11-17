import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckSquare, FileX2, Shield } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal, RevealItem, RevealStagger } from '../components/MotionPrimitives';
import { EmptyStateCard } from '../components/StateFeedback';
import { getScamTypeBySlug, SCAM_TYPES_DATA } from '../data/scamTypesData';
import { getServiceBySlug } from '../data/servicesData';

export const ScamTypesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const activeScam = slug ? getScamTypeBySlug(slug) : undefined;

  if (slug && !activeScam) {
    return (
      <div className="bg-white min-h-[60vh]">
        <Breadcrumbs items={[{ label: 'Scam Types', to: '/scam-types' }, { label: 'Not Found' }]} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmptyStateCard
            icon={FileX2}
            title="Scam Type Not Found"
            description="The requested scam category could not be located. Return to our Scam Types directory to browse all nine investigated categories."
            actionLabel="View All Scam Types"
            actionTo="/scam-types"
          />
        </div>
      </div>
    );
  }

  if (activeScam) {
    const recommendedService = getServiceBySlug(activeScam.recommendedServiceSlug);

    return (
      <div className="bg-white text-[#0A0A0A]">
        <Breadcrumbs
          items={[
            { label: 'Scam Types', to: '/scam-types' },
            { label: activeScam.shortTitle },
          ]}
        />

        <section className="border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <HeroReveal className="lg:col-span-8">
                <h1
                  className="font-display font-bold text-[#0A0A0A] leading-tight"
                  style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)', textWrap: 'balance' }}
                >
                  {activeScam.title}
                </h1>
                <p className="mt-4 text-base text-[#334155] leading-relaxed max-w-2xl">
                  {activeScam.summary}
                </p>
                <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-xs text-[#475569]">
                  <span className="font-semibold text-[#0A0A0A]">Primary Vectors: </span>
                  <span>{activeScam.primaryVectors}</span>
                </div>
              </HeroReveal>

              <HeroReveal
                delay={0.08}
                className="lg:col-span-4 glass-panel rounded-2xl p-6 border-[#D4AF37]/70"
              >
                <h2 className="text-sm font-bold text-[#0A0A0A]">
                  Affected by {activeScam.shortTitle}?
                </h2>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Launch our confidential assessment pre-configured for this fraud category. Do not
                  pay secondary &quot;tax release&quot; demands.
                </p>
                <Link
                  to={`/assessment?scam=${activeScam.slug}`}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 luxury-btn-primary text-xs font-semibold group"
                >
                  <span>Assess This Case Confidentially</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </HeroReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <Reveal className="lg:col-span-7 space-y-6">
                <h2 className="text-xl font-bold text-[#0A0A0A]">How This Fraud Operates</h2>
                <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
                  {activeScam.description.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="rounded-2xl border border-[#D4AF37]/60 bg-[#FCF8EA]/50 p-6 mt-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-[#0A0A0A]">
                      Realistic Investigative Outlook
                    </h3>
                  </div>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    {activeScam.recoveryOutlook}
                  </p>
                  {recommendedService && (
                    <Link
                      to={`/services/${recommendedService.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline mt-4 transition-colors group"
                    >
                      <span>Recommended Service: {recommendedService.title}</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.08} className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)]">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-[#0A0A0A]">Common Warning Indicators</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-[#334155]">
                    {activeScam.warningSigns.map((sign) => (
                      <li key={sign} className="flex items-start gap-2.5">
                        <span className="text-[#C59B27] font-bold">·</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckSquare className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-[#0A0A0A]">
                      Evidence to Preserve Immediately
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm text-[#334155]">
                    {activeScam.evidenceNeeded.map((ev) => (
                      <li key={ev} className="flex items-start gap-2.5">
                        <span className="text-[#C59B27] font-bold">·</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-[#0A0A0A]">All Investigated Scam Types</h2>
                <Link to="/scam-types" className="text-xs font-semibold text-[#946E00] hover:underline">
                  View Hub
                </Link>
              </div>
            </Reveal>
            <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SCAM_TYPES_DATA.filter((item) => item.slug !== activeScam.slug)
                .slice(0, 4)
                .map((item) => (
                  <RevealItem key={item.slug}>
                    <Link
                      to={`/scam-types/${item.slug}`}
                      className="block h-full bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#D4AF37] p-4 shadow-xs hover:shadow-[0_12px_28px_-10px_rgba(10,10,10,0.1)] hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div className="text-sm font-bold text-[#0A0A0A] group-hover:text-[#946E00] transition-colors">
                        {item.shortTitle}
                      </div>
                    </Link>
                  </RevealItem>
                ))}
            </RevealStagger>
          </div>
        </section>
      </div>
    );
  }

  // Hub View (/scam-types)
  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs items={[{ label: 'Scam Types' }]} />

      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <HeroReveal>
            <p className="text-xs font-semibold text-[#946E00]">Fraud Intelligence Directory</p>
            <h1
              className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight max-w-3xl"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
            >
              Nine Cyber-Fraud &amp; Asset Diversion Categories We Investigate
            </h1>
            <p className="mt-4 text-base text-[#475569] leading-relaxed max-w-2xl">
              Every fraud vector leaves distinct technical footprints—from smart-contract approvals
              to Faster Payments mule networks. Select your scam category to see what evidence
              matters most.
            </p>
          </HeroReveal>
        </div>
      </section>

      <section className="py-16 bg-architectural-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCAM_TYPES_DATA.map((scam) => (
              <RevealItem key={scam.slug}>
                <Link
                  to={`/scam-types/${scam.slug}`}
                  className="h-full glass-panel rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_18px_42px_-12px_rgba(10,10,10,0.14)] transition-all duration-200 group"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#0A0A0A] group-hover:text-[#946E00] transition-colors">
                      {scam.title}
                    </h2>
                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">{scam.summary}</p>
                    <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs text-[#334155]">
                      <span className="font-semibold text-[#0A0A0A]">Vectors: </span>
                      {scam.primaryVectors}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#0A0A0A] group-hover:text-[#946E00] transition-colors">
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
    </div>
  );
};
