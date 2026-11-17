import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileCheck2, FileX2, ShieldAlert } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal, RevealItem, RevealStagger } from '../components/MotionPrimitives';
import { ResilientImage } from '../components/ResilientImage';
import { EmptyStateCard } from '../components/StateFeedback';
import { getServiceBySlug, SERVICES_DATA } from '../data/servicesData';

export const ServicesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const activeService = slug ? getServiceBySlug(slug) : undefined;

  if (slug && !activeService) {
    return (
      <div className="bg-white min-h-[60vh]">
        <Breadcrumbs items={[{ label: 'Services', to: '/services' }, { label: 'Not Found' }]} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmptyStateCard
            icon={FileX2}
            title="Service Not Found"
            description="The requested advisory service route could not be located. Return to our directory to browse all six core forensic services."
            actionLabel="Return to Services Overview"
            actionTo="/services"
          />
        </div>
      </div>
    );
  }

  if (activeService) {
    return (
      <div className="bg-white text-[#0A0A0A]">
        <Breadcrumbs
          items={[
            { label: 'Services', to: '/services' },
            { label: activeService.shortTitle },
          ]}
        />

        <section className="border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <HeroReveal className="lg:col-span-8">
                <p className="text-xs font-semibold text-[#946E00]">
                  {activeService.indexLabel} · {activeService.category}
                </p>
                <h1
                  className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight"
                  style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)', textWrap: 'balance' }}
                >
                  {activeService.title}
                </h1>
                <p className="mt-4 text-base text-[#334155] leading-relaxed max-w-2xl">
                  {activeService.heroStatement}
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E2E8F0] pt-6">
                  <div>
                    <div className="text-xs text-[#475569]">Typical Turnaround</div>
                    <div className="text-sm font-semibold text-[#0A0A0A] mt-1 font-mono-tabular">
                      {activeService.turnaround}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#475569]">Jurisdictions</div>
                    <div className="text-sm font-semibold text-[#0A0A0A] mt-1">
                      {activeService.jurisdictions}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#475569]">Primary Output</div>
                    <div className="text-sm font-semibold text-[#0A0A0A] mt-1">
                      {activeService.deliverableFormat}
                    </div>
                  </div>
                </div>
              </HeroReveal>

              <HeroReveal
                delay={0.08}
                className="lg:col-span-4 glass-panel rounded-2xl p-6 border-[#D4AF37]/70"
              >
                <h2 className="text-sm font-bold text-[#0A0A0A]">
                  Request Feasibility Check for {activeService.shortTitle}
                </h2>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Share your transaction IDs or incident summary. We assess whether this service
                  fits your facts before proposing any scope.
                </p>
                <div className="mt-5 space-y-3">
                  <Link
                    to={`/assessment?service=${activeService.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 luxury-btn-primary text-xs font-semibold group"
                  >
                    <span>Start Free Case Assessment</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    to="/portal"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 luxury-btn-secondary text-xs font-semibold"
                  >
                    Existing Client Lookup
                  </Link>
                </div>
              </HeroReveal>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <Reveal className="lg:col-span-7 space-y-6">
                <h2 className="text-xl font-bold text-[#0A0A0A]">Investigative Scope</h2>
                <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
                  {activeService.overview.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#E2E8F0]">
                  <h3 className="text-lg font-bold text-[#0A0A0A] mb-5">
                    Three-Stage Delivery Methodology
                  </h3>
                  <RevealStagger className="space-y-4">
                    {activeService.methodologySteps.map((m) => (
                      <RevealItem key={m.step}>
                        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-xs hover:border-[#D4AF37]/70 hover:shadow-[0_10px_24px_-10px_rgba(10,10,10,0.08)] transition-all duration-200">
                          <div className="text-xs font-mono-tabular font-semibold text-[#946E00]">
                            Stage {m.step}
                          </div>
                          <div className="text-sm font-bold text-[#0A0A0A] mt-1">{m.title}</div>
                          <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                            {m.detail}
                          </p>
                        </div>
                      </RevealItem>
                    ))}
                  </RevealStagger>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_6px_22px_-10px_rgba(10,10,10,0.06)] hover:shadow-[0_12px_30px_-10px_rgba(10,10,10,0.1)] transition-shadow duration-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FileCheck2 className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-[#0A0A0A]">Tangible Deliverables</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-[#334155]">
                    {activeService.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-[#0A0A0A] mb-3">When This Fits Best</h3>
                  <ul className="space-y-2.5 text-xs text-[#475569] leading-relaxed">
                    {activeService.idealFor.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="font-bold text-[#C59B27]">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 flex items-start gap-3 shadow-xs">
                  <ShieldAlert className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {activeService.disclaimerNote}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Cross-Navigation to Other Services */}
        <section className="bg-[#F8FAFC] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-sm font-bold text-[#0A0A0A] mb-5">Other Advisory Services</h2>
            </Reveal>
            <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SERVICES_DATA.filter((s) => s.slug !== activeService.slug).map((s) => (
                <RevealItem key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="block h-full bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#D4AF37] p-5 shadow-xs hover:shadow-[0_12px_28px_-10px_rgba(10,10,10,0.1)] hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="text-xs text-[#946E00] font-mono-tabular font-semibold">
                      {s.indexLabel} · {s.category}
                    </div>
                    <div className="text-sm font-bold text-[#0A0A0A] mt-1 group-hover:text-[#946E00] transition-colors">
                      {s.title}
                    </div>
                    <p className="text-xs text-[#475569] mt-2 line-clamp-2">{s.summary}</p>
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>
      </div>
    );
  }

  // Services Hub Overview (/services)
  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs items={[{ label: 'Services' }]} />

      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <HeroReveal className="lg:col-span-7">
              <p className="text-xs font-semibold text-[#946E00]">Six Core Practice Areas</p>
              <h1
                className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight"
                style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
              >
                Blockchain Tracing, Fraud Investigation &amp; Asset Recovery Advisory
              </h1>
              <p className="mt-4 text-base text-[#475569] leading-relaxed max-w-2xl">
                Every mandate begins with honest technical feasibility screening across our six
                core investigative disciplines—from rapid chain attribution and law enforcement
                support to proactive scam prevention advisory.
              </p>
            </HeroReveal>
            <HeroReveal delay={0.08} className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden shadow-[0_12px_34px_-12px_rgba(10,10,10,0.1)]">
                <ResilientImage
                  src="/src/assets/images/forensic_dossier_showcase_1794892808050.jpg"
                  alt="Chiron Investigations bound forensic evidence dossiers and clustering graph"
                  className="w-full aspect-[4/3] object-cover"
                  fallbackTitle="Forensic Evidence Dossiers"
                />
              </div>
            </HeroReveal>
          </div>
        </div>
      </section>

      <section className="py-16 bg-architectural-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((service) => (
              <RevealItem key={service.slug}>
                <div className="h-full glass-panel rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_18px_42px_-12px_rgba(10,10,10,0.14)] transition-all duration-200 group">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#475569] pb-4 border-b border-[#E2E8F0]">
                      <span className="font-semibold text-[#946E00]">
                        {service.indexLabel} · {service.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mt-5 group-hover:text-[#946E00] transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-sm text-[#475569] mt-3 leading-relaxed">{service.summary}</p>
                    <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-2">
                      <div className="text-xs font-semibold text-[#0A0A0A]">Key Deliverables</div>
                      <ul className="space-y-1.5 text-xs text-[#475569]">
                        {service.deliverables.slice(0, 3).map((d) => (
                          <li key={d}>· {d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-7 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline transition-colors"
                    >
                      <span>Explore {service.shortTitle}</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>
    </div>
  );
};
