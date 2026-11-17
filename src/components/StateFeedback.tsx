import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-lg bg-[#E2E8F0]/80 ${className}`}
  />
);

/**
 * Skeleton loader for Case Verification widget and Portal Dossier view
 * during Firestore lookups.
 */
export const CaseDossierSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Verifying case reference status"
        className="mt-4 rounded-xl border border-[#E2E8F0] bg-white/95 p-4 sm:p-5 space-y-3.5 shadow-xs"
      >
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <SkeletonBlock className="h-3.5 w-48 bg-[#FCF8EA]" />
          <SkeletonBlock className="h-3.5 w-12" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-1.5">
              <SkeletonBlock className="h-2.5 w-24" />
              <SkeletonBlock className="h-4 w-36" />
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <SkeletonBlock className="h-3 w-40" />
          <SkeletonBlock className="h-3 w-28" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading case dossier"
      className="space-y-6"
    >
      <div className="glass-panel rounded-2xl border-[#D4AF37]/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="space-y-2.5 flex-1 min-w-[200px]">
            <SkeletonBlock className="h-3.5 w-36 bg-[#FCF8EA]" />
            <SkeletonBlock className="h-6 w-64 max-w-full" />
            <SkeletonBlock className="h-3 w-44" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-6 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-3.5 w-3.5 rounded-full" />
              </div>
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-4/5" />
            </div>
          ))}
        </div>

        <div className="pt-5 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-2">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-4">
        <SkeletonBlock className="h-4 w-52" />
        <SkeletonBlock className="h-16 w-full rounded-xl" />
        <SkeletonBlock className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for Portal sidebar linked cases list.
 */
export const AccountCasesSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => (
  <div role="status" aria-live="polite" aria-label="Loading linked cases" className="space-y-2.5">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2"
      >
        <SkeletonBlock className="h-3.5 w-32 bg-[#FCF8EA]" />
        <SkeletonBlock className="h-3 w-44" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton loader for multi-column content grids (Services, Scam Types, Reviews, Case Studies).
 */
export const ContentGridSkeleton: React.FC<{
  cards?: number;
  columns?: 2 | 3;
}> = ({ cards = 6, columns = 3 }) => {
  const gridCols =
    columns === 2
      ? 'grid-cols-1 lg:grid-cols-2 gap-8'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content grid"
      className={`grid ${gridCols}`}
    >
      {Array.from({ length: cards }).map((_, idx) => (
        <div
          key={idx}
          className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
              <SkeletonBlock className="h-3 w-28 bg-[#FCF8EA]" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
            <SkeletonBlock className="h-6 w-4/5" />
            <div className="space-y-2">
              <SkeletonBlock className="h-3.5 w-full" />
              <SkeletonBlock className="h-3.5 w-11/12" />
              <SkeletonBlock className="h-3.5 w-3/4" />
            </div>
            {columns === 2 && (
              <div className="grid grid-cols-3 gap-3 py-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4">
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-2.5 w-16" />
                  <SkeletonBlock className="h-3.5 w-20" />
                </div>
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-2.5 w-16" />
                  <SkeletonBlock className="h-3.5 w-24" />
                </div>
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-2.5 w-16" />
                  <SkeletonBlock className="h-3.5 w-14" />
                </div>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <SkeletonBlock className="h-3 w-36" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Full-page route hydration skeleton used as Suspense fallback while route bundles load.
 */
export const PageRouteSkeleton: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading page content"
    className="bg-white text-[#0A0A0A]"
  >
    <div className="border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4">
        <SkeletonBlock className="h-3 w-36 bg-[#FCF8EA]" />
        <SkeletonBlock className="h-10 w-2/3 max-w-xl" />
        <SkeletonBlock className="h-4 w-full max-w-2xl" />
        <SkeletonBlock className="h-4 w-5/6 max-w-xl" />
      </div>
    </div>
    <div className="py-16 bg-architectural-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContentGridSkeleton cards={6} columns={3} />
      </div>
    </div>
  </div>
);

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  compact?: boolean;
  className?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl text-center ${
        compact ? 'p-6 space-y-2.5' : 'p-8 sm:p-10 space-y-4'
      } ${className}`}
    >
      <div
        className={`mx-auto rounded-2xl border border-[#D4AF37]/40 bg-[#FCF8EA]/70 flex items-center justify-center ${
          compact ? 'w-10 h-10' : 'w-12 h-12'
        }`}
      >
        <Icon
          className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-[#C59B27]`}
          aria-hidden="true"
        />
      </div>
      <div className="space-y-1.5">
        <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-[#0A0A0A]`}>
          {title}
        </h3>
        <p
          className={`${
            compact ? 'text-xs' : 'text-sm'
          } text-[#475569] max-w-md mx-auto leading-relaxed`}
        >
          {description}
        </p>
      </div>
      {actionLabel && (actionTo || onAction) && (
        <div className="pt-1">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center justify-center px-5 py-2.5 luxury-btn-primary text-xs font-semibold"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center px-5 py-2.5 luxury-btn-secondary text-xs font-semibold cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
