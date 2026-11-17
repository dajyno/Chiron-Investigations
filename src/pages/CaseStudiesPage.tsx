import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, SearchX } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeroReveal, Reveal, RevealItem, RevealStagger } from '../components/MotionPrimitives';
import { ContentGridSkeleton, EmptyStateCard } from '../components/StateFeedback';
import { CASE_STUDIES, CaseStudy, TESTIMONIALS } from '../data/editorialData';

type CategoryFilter = 'All Cases' | CaseStudy['category'];

const FILTER_OPTIONS: CategoryFilter[] = [
  'All Cases',
  'Pig Butchering',
  'Wallet Drains',
  'Wire & APP Fraud',
  'Tax Documentation',
];

export const CaseStudiesPage: React.FC = () => {
  const [filter, setFilter] = useState<CategoryFilter>('All Cases');
  const [query, setQuery] = useState('');
  const [isGridUpdating, setIsGridUpdating] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const triggerGridRefresh = () => {
    setIsGridUpdating(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsGridUpdating(false);
    }, 180);
  };

  const handleSelectFilter = (option: CategoryFilter) => {
    if (option === filter) return;
    setFilter(option);
    triggerGridRefresh();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    triggerGridRefresh();
  };

  const trimmedQuery = query.trim().toLowerCase();

  const visibleCases = CASE_STUDIES.filter((item) => {
    const matchesCategory = filter === 'All Cases' || item.category === filter;
    if (!matchesCategory) return false;
    if (!trimmedQuery) return true;
    const haystack = [
      item.caseCode,
      item.title,
      item.category,
      item.jurisdiction,
      item.summary,
      item.methodology,
      item.resolution,
      ...item.chainsTraced,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(trimmedQuery);
  });

  const handleResetFilters = () => {
    setFilter('All Cases');
    setQuery('');
    triggerGridRefresh();
  };

  return (
    <div className="bg-white text-[#0A0A0A]">
      <Breadcrumbs items={[{ label: 'Case Studies' }]} />

      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <HeroReveal>
            <p className="text-xs font-semibold text-[#946E00]">Anonymized Mandates</p>
            <h1
              className="font-display font-bold text-[#0A0A0A] mt-2 leading-tight max-w-3xl"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
            >
              Forensic Case Studies &amp; Documented Outcomes
            </h1>
            <p className="mt-4 text-base text-[#475569] leading-relaxed max-w-2xl">
              Every dossier below reflects real investigative structures anonymized to protect
              client confidentiality—covering both successful VASP attribution referrals and honest
              irrecoverability tax-loss filings.
            </p>
          </HeroReveal>

          {/* Interactive Filter Controls + Keyword Search */}
          <HeroReveal
            delay={0.08}
            className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] w-fit shadow-xs">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectFilter(option)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    filter === option
                      ? 'bg-white text-[#0A0A0A] border border-[#D4AF37]/80 shadow-xs font-semibold'
                      : 'text-[#475569] hover:text-[#0A0A0A] hover:bg-white/60'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Filter case studies by chain, jurisdiction, or keyword"
                placeholder="Search chain, jurisdiction..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white pl-10 pr-4 py-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#D4AF37] shadow-xs transition-colors"
              />
            </div>
          </HeroReveal>
        </div>
      </section>

      <section className="border-b border-[#E2E8F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isGridUpdating ? (
            <ContentGridSkeleton cards={4} columns={2} />
          ) : visibleCases.length === 0 ? (
            <EmptyStateCard
              icon={SearchX}
              title="No Matching Case Dossiers"
              description={`No anonymized dossiers matched ${
                trimmedQuery ? `"${query.trim()}" ` : ''
              }within ${filter}. Reset your filters to browse all documented outcomes.`}
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <RevealStagger
              key={`${filter}-${trimmedQuery}`}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {visibleCases.map((study) => (
                <RevealItem key={study.id}>
                  <article className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-8 flex flex-col justify-between shadow-[0_6px_24px_-10px_rgba(10,10,10,0.06)] hover:shadow-[0_16px_40px_-12px_rgba(10,10,10,0.12)] hover:border-[#D4AF37]/80 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0] text-xs text-[#475569]">
                        <span className="font-mono-tabular font-semibold text-[#946E00]">
                          {study.caseCode}
                        </span>
                        <span>
                          {study.category} · {study.jurisdiction}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-[#0A0A0A] mt-5 group-hover:text-[#946E00] transition-colors">
                        {study.title}
                      </h2>

                      <div className="mt-5 grid grid-cols-3 gap-4 py-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4">
                        <div>
                          <div className="text-[11px] text-[#475569]">Disputed Value</div>
                          <div className="text-xs font-bold text-[#0A0A0A] mt-0.5 font-mono-tabular">
                            {study.lossAmount}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#475569]">Key Outcome</div>
                          <div className="text-xs font-bold text-[#946E00] mt-0.5">
                            {study.outcomeMetric}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#475569]">Turnaround</div>
                          <div className="text-xs font-bold text-[#0A0A0A] mt-0.5 font-mono-tabular">
                            {study.timeframe}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 text-sm text-[#334155] leading-relaxed">
                        <p>
                          <strong className="text-[#0A0A0A]">Incident: </strong>
                          {study.summary}
                        </p>
                        <p>
                          <strong className="text-[#0A0A0A]">Forensic Method: </strong>
                          {study.methodology}
                        </p>
                        <p>
                          <strong className="text-[#0A0A0A]">Resolution: </strong>
                          {study.resolution}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                      <span>Rails Traced: {study.chainsTraced.join(' · ')}</span>
                      <Link
                        to="/assessment"
                        className="font-semibold text-[#0A0A0A] hover:text-[#946E00] hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Assess Similar Case</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealStagger>
          )}
        </div>
      </section>

      <section className="bg-architectural-grid py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-lg font-bold text-[#0A0A0A] mb-6">Verified Client Statements</h2>
          </Reveal>
          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <RevealItem key={t.id}>
                <div className="h-full glass-panel rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:border-[#D4AF37]/80 hover:shadow-[0_14px_34px_-10px_rgba(10,10,10,0.12)] transition-all duration-200">
                  <p className="text-sm text-[#0A0A0A] leading-relaxed">“{t.quote}”</p>
                  <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-xs">
                    <div className="font-semibold text-[#0A0A0A]">{t.author}</div>
                    <div className="text-[#475569]">
                      {t.role} · {t.jurisdiction}
                    </div>
                    <div className="text-[#946E00] font-semibold mt-1">{t.outcome}</div>
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
