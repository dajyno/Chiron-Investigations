import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { SCAM_TYPES_DATA } from '../data/scamTypesData';

type OpenMenu = 'services' | 'scams' | null;

export const Header: React.FC = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<OpenMenu>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isActivePath = (prefix: string) => {
    if (prefix === '/') return location.pathname === '/';
    return location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]/90 shadow-[0_4px_24px_-8px_rgba(10,10,10,0.06)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-[#0A0A0A] whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          Chiron Investigations
        </Link>

        {/* Zone 2: Primary Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#475569]"
        >
          {/* Services Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={openMenu === 'services'}
              onClick={() => setOpenMenu((prev) => (prev === 'services' ? null : 'services'))}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                isActivePath('/services')
                  ? 'text-[#0A0A0A] bg-[#FCF8EA] underline decoration-[#D4AF37] decoration-2 underline-offset-4'
                  : 'hover:text-[#0A0A0A] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openMenu === 'services' ? 'rotate-180 text-[#946E00]' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {openMenu === 'services' && (
              <div className="absolute left-0 top-full mt-2.5 w-[33rem] bg-white/90 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-3 shadow-[0_20px_48px_-12px_rgba(10,10,10,0.14)]">
                <div className="px-3 pb-2.5 border-b border-[#E2E8F0] mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0A0A0A]">
                    Six Core Advisory Services
                  </span>
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-[#946E00] hover:text-[#0A0A0A] hover:underline transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SERVICES_DATA.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="px-3 py-2.5 rounded-xl hover:bg-[#FCF8EA]/70 border border-transparent hover:border-[#D4AF37]/40 transition-all duration-150 text-left group"
                    >
                      <div className="text-xs font-semibold text-[#0A0A0A] group-hover:text-[#946E00] transition-colors">
                        {service.indexLabel}. {service.shortTitle}
                      </div>
                      <div className="text-[11px] text-[#475569] mt-0.5 line-clamp-1">
                        {service.category} · {service.turnaround}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scam Types Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={openMenu === 'scams'}
              onClick={() => setOpenMenu((prev) => (prev === 'scams' ? null : 'scams'))}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                isActivePath('/scam-types')
                  ? 'text-[#0A0A0A] bg-[#FCF8EA] underline decoration-[#D4AF37] decoration-2 underline-offset-4'
                  : 'hover:text-[#0A0A0A] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>Scam Types</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openMenu === 'scams' ? 'rotate-180 text-[#946E00]' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {openMenu === 'scams' && (
              <div className="absolute left-0 top-full mt-2.5 w-[35rem] bg-white/90 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-3 shadow-[0_20px_48px_-12px_rgba(10,10,10,0.14)]">
                <div className="px-3 pb-2.5 border-b border-[#E2E8F0] mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0A0A0A]">
                    Investigated Scam Types
                  </span>
                  <Link
                    to="/scam-types"
                    className="text-xs font-semibold text-[#946E00] hover:text-[#0A0A0A] hover:underline transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SCAM_TYPES_DATA.map((scam) => (
                    <Link
                      key={scam.slug}
                      to={`/scam-types/${scam.slug}`}
                      className="px-3 py-2 rounded-xl hover:bg-[#FCF8EA]/70 border border-transparent hover:border-[#D4AF37]/40 transition-all duration-150 group"
                    >
                      <div className="text-xs font-medium text-[#0A0A0A] group-hover:text-[#946E00] transition-colors">
                        {scam.indexLabel}. {scam.shortTitle}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/how-it-works"
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all duration-200 ${
              isActivePath('/how-it-works') || isActivePath('/process')
                ? 'text-[#0A0A0A] bg-[#FCF8EA] underline decoration-[#D4AF37] decoration-2 underline-offset-4'
                : 'hover:text-[#0A0A0A] hover:bg-[#F8FAFC]'
            }`}
          >
            How It Works
          </Link>

          <Link
            to="/case-studies"
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all duration-200 ${
              isActivePath('/case-studies')
                ? 'text-[#0A0A0A] bg-[#FCF8EA] underline decoration-[#D4AF37] decoration-2 underline-offset-4'
                : 'hover:text-[#0A0A0A] hover:bg-[#F8FAFC]'
            }`}
          >
            Case Studies
          </Link>

          <Link
            to="/about"
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all duration-200 ${
              isActivePath('/about')
                ? 'text-[#0A0A0A] bg-[#FCF8EA] underline decoration-[#D4AF37] decoration-2 underline-offset-4'
                : 'hover:text-[#0A0A0A] hover:bg-[#F8FAFC]'
            }`}
          >
            About
          </Link>

          <Link
            to="/portal"
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all duration-200 ${
              isActivePath('/portal')
                ? 'text-[#0A0A0A] bg-[#FCF8EA] underline decoration-[#D4AF37] decoration-2 underline-offset-4'
                : 'hover:text-[#0A0A0A] hover:bg-[#F8FAFC]'
            }`}
          >
            Client Portal
          </Link>
        </nav>

        {/* Zone 3: Single Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/assessment"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold luxury-btn-primary whitespace-nowrap shrink-0"
          >
            Free Assessment
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E2E8F0] bg-white/80 text-[#0A0A0A] hover:bg-[#F8FAFC] hover:border-[#0A0A0A] transition-all cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileSection((prev) => (prev === 'services' ? null : 'services'))
                }
                className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[#0A0A0A] border-b border-[#E2E8F0]"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileSection === 'services' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileSection === 'services' && (
                <div className="pl-3 py-2 space-y-1 bg-[#F8FAFC] rounded-xl my-1">
                  <Link
                    to="/services"
                    className="block py-1.5 text-xs font-semibold text-[#946E00]"
                  >
                    All Services Overview
                  </Link>
                  {SERVICES_DATA.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="block py-1.5 text-sm text-[#475569] hover:text-[#0A0A0A]"
                    >
                      {service.shortTitle}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setMobileSection((prev) => (prev === 'scams' ? null : 'scams'))}
                className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[#0A0A0A] border-b border-[#E2E8F0]"
              >
                <span>Scam Types</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileSection === 'scams' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileSection === 'scams' && (
                <div className="pl-3 py-2 space-y-1 bg-[#F8FAFC] rounded-xl my-1">
                  <Link
                    to="/scam-types"
                    className="block py-1.5 text-xs font-semibold text-[#946E00]"
                  >
                    All Scam Types Overview
                  </Link>
                  {SCAM_TYPES_DATA.map((scam) => (
                    <Link
                      key={scam.slug}
                      to={`/scam-types/${scam.slug}`}
                      className="block py-1.5 text-sm text-[#475569] hover:text-[#0A0A0A]"
                    >
                      {scam.shortTitle}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/how-it-works"
              className="block py-2.5 text-sm font-medium text-[#0A0A0A] border-b border-[#E2E8F0]"
            >
              How It Works
            </Link>
            <Link
              to="/case-studies"
              className="block py-2.5 text-sm font-medium text-[#0A0A0A] border-b border-[#E2E8F0]"
            >
              Case Studies
            </Link>
            <Link
              to="/about"
              className="block py-2.5 text-sm font-medium text-[#0A0A0A] border-b border-[#E2E8F0]"
            >
              About
            </Link>
            <Link
              to="/portal"
              className="block py-2.5 text-sm font-medium text-[#0A0A0A] border-b border-[#E2E8F0]"
            >
              Client Portal
            </Link>
            <Link
              to="/contact"
              className="block py-2.5 text-sm font-medium text-[#0A0A0A] border-b border-[#E2E8F0]"
            >
              Contact
            </Link>

            <div className="pt-3">
              <Link
                to="/assessment"
                className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold luxury-btn-primary"
              >
                Free Case Assessment
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
