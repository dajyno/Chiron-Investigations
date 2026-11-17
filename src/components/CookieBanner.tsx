import React, { useState } from 'react';
import { Cookie, Settings2, X } from 'lucide-react';

export interface CookiePreferences {
  functional: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'chiron_cookie_consent_v1';

export function getSavedCookiePreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

interface CookieBannerProps {
  visible: boolean;
  onClose: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ visible, onClose }) => {
  const existing = getSavedCookiePreferences();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState(existing?.preferences ?? false);
  const [statistics, setStatistics] = useState(existing?.statistics ?? false);
  const [marketing, setMarketing] = useState(existing?.marketing ?? false);

  if (!visible) return null;

  const persist = (next: Omit<CookiePreferences, 'updatedAt'>) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...next, updatedAt: new Date().toISOString() })
      );
    } catch {
      // Ignore storage failures
    }
    onClose();
  };

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed bottom-20 left-4 right-4 z-50 max-w-4xl mx-auto bg-white/88 backdrop-blur-xl rounded-2xl border border-[#CBD5E1] p-6 shadow-[0_24px_60px_-15px_rgba(10,10,10,0.22)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-[#0A0A0A]">
              Privacy &amp; Cookie Consent Preferences
            </h2>
            <p className="text-xs text-[#475569] mt-1 leading-relaxed max-w-2xl">
              Chiron Investigations uses essential functional storage for session integrity and case
              portal security. Optional preference, statistics, and marketing categories remain
              disabled unless you choose to enable them.
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Dismiss cookie banner"
          onClick={() =>
            persist({ functional: true, preferences: false, statistics: false, marketing: false })
          }
          className="text-[#475569] hover:text-[#0A0A0A] hover:bg-[#F1F5F9] rounded-lg p-1.5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC]/80 border border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0A0A0A]">Functional</span>
              <span className="text-[11px] font-medium text-[#475569]">Always Active</span>
            </div>
            <p className="text-[11px] text-[#475569] mt-1">
              Required for portal access, CSRF protection, and form state.
            </p>
          </div>

          <label className="p-3.5 rounded-xl bg-[#F8FAFC]/80 border border-[#E2E8F0] hover:border-[#D4AF37]/60 flex flex-col justify-between transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0A0A0A]">Preferences</span>
              <input
                type="checkbox"
                checked={preferences}
                onChange={(e) => setPreferences(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4"
              />
            </div>
            <p className="text-[11px] text-[#475569] mt-1">
              Remembers regional currency and jurisdiction filters.
            </p>
          </label>

          <label className="p-3.5 rounded-xl bg-[#F8FAFC]/80 border border-[#E2E8F0] hover:border-[#D4AF37]/60 flex flex-col justify-between transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0A0A0A]">Statistics</span>
              <input
                type="checkbox"
                checked={statistics}
                onChange={(e) => setStatistics(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4"
              />
            </div>
            <p className="text-[11px] text-[#475569] mt-1">
              Aggregated, non-identifying page telemetry to improve guidance.
            </p>
          </label>

          <label className="p-3.5 rounded-xl bg-[#F8FAFC]/80 border border-[#E2E8F0] hover:border-[#D4AF37]/60 flex flex-col justify-between transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0A0A0A]">Marketing</span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4"
              />
            </div>
            <p className="text-[11px] text-[#475569] mt-1">
              Measures referral attribution from educational advisory articles.
            </p>
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0A0A0A] transition-colors cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showDetails ? 'Hide Categories' : 'Manage Categories'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              persist({ functional: true, preferences: false, statistics: false, marketing: false })
            }
            className="px-4 py-2 text-xs font-medium luxury-btn-secondary cursor-pointer"
          >
            Deny Non-Essential
          </button>
          {showDetails && (
            <button
              type="button"
              onClick={() => persist({ functional: true, preferences, statistics, marketing })}
              className="px-4 py-2 text-xs font-semibold luxury-btn-secondary cursor-pointer"
            >
              Save Preferences
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              persist({ functional: true, preferences: true, statistics: true, marketing: true })
            }
            className="px-5 py-2 text-xs font-semibold luxury-btn-primary cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
};
