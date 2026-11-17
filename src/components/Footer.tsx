import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { SCAM_TYPES_DATA } from '../data/scamTypesData';
import { Reveal } from './MotionPrimitives';

interface FooterProps {
  onOpenCookieSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCookieSettings }) => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] text-[#0A0A0A]">
      <Reveal yOffset={12}>
        <div className="max-w-7xl mx-auto px-7 sm:px-6 lg:px-8 py-14">
          {/* Top Row: 4 Columns (1: Brand & Address, 2: All Contact Information, 3: Scam Types, 4: Services) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.05fr_1.15fr_1fr_0.95fr] gap-y-10 gap-x-8 pb-12 border-b border-[#E2E8F0]">
          {/* Column 1: Brand & Registered Office Address */}
          <div className="space-y-4">
            <Link
              to="/"
              className="font-display text-lg font-bold tracking-tight text-[#0A0A0A] hover:opacity-80 transition-opacity inline-block"
            >
              Chiron Investigations
            </Link>
            <p className="text-sm text-[#475569] leading-relaxed">
              Independent cybercrime intelligence, multi-chain cryptocurrency tracing, and forensic
              loss documentation supporting victims, solicitors, and corporate counsel worldwide.
            </p>
            <div className="flex items-start gap-2.5 pt-1 text-xs text-[#475569]">
              <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <div className="font-semibold text-[#0A0A0A]">Registered Office</div>
                <div className="mt-0.5 leading-relaxed">
                  65 The Base, Victoria Road, Dartford, DA1 5FS
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 text-xs font-medium text-[#475569]">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0A0A0A] underline-offset-4 hover:underline transition-colors"
              >
                LinkedIn
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0A0A0A] underline-offset-4 hover:underline transition-colors"
              >
                X (Advisory)
              </a>
              <span aria-hidden="true">·</span>
              <Link
                to="/admin"
                className="hover:text-[#0A0A0A] underline-offset-4 hover:underline transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Column 2: All Contact Information */}
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-[#0A0A0A] mb-4">
              Contact Information
            </h3>
            <div className="space-y-3.5 text-xs text-[#475569]">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="font-semibold text-[#0A0A0A]">Direct Telephone</div>
                  <a
                    href="tel:+447348226461"
                    className="font-mono-tabular text-[#334155] hover:text-[#946E00] hover:underline transition-colors inline-block mt-0.5"
                  >
                    +44 73 4822 6461
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle
                  className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-[#0A0A0A]">WhatsApp Investigative Desk</div>
                  <a
                    href="https://wa.me/447348226461"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#334155] hover:text-[#946E00] hover:underline transition-colors inline-block mt-0.5"
                  >
                    Message +44 73 4822 6461
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="font-semibold text-[#0A0A0A]">Main Inquiries</div>
                  <a
                    href="mailto:info@chironinvestigations.co.uk"
                    className="text-[#334155] hover:text-[#946E00] hover:underline transition-colors break-all inline-block mt-0.5"
                  >
                    info@chironinvestigations.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="font-semibold text-[#0A0A0A]">Recovery Department</div>
                  <a
                    href="mailto:recoverydept@chironinvestigations.co.uk"
                    className="text-[#334155] hover:text-[#946E00] hover:underline transition-colors break-all inline-block mt-0.5"
                  >
                    recoverydept@chironinvestigations.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="font-semibold text-[#0A0A0A]">
                    Edward Camillieri (Managing Director)
                  </div>
                  <a
                    href="mailto:edward.camillieri@chironinvestigations.co.uk"
                    className="text-[#334155] hover:text-[#946E00] hover:underline transition-colors break-all inline-block mt-0.5"
                  >
                    edward.camillieri@chironinvestigations.co.uk
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Scam Types (extra left padding on desktop for clean separation from Contact Information) */}
          <div className="lg:pl-12">
            <h3 className="text-xs font-semibold tracking-wide text-[#0A0A0A] mb-4">
              Scam Types
            </h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              {SCAM_TYPES_DATA.slice(0, 7).map((scam) => (
                <li key={scam.slug}>
                  <Link
                    to={`/scam-types/${scam.slug}`}
                    className="hover:text-[#0A0A0A] hover:translate-x-0.5 inline-block transition-all duration-150"
                  >
                    {scam.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/scam-types"
                  className="text-[#946E00] font-semibold hover:underline inline-block pt-1"
                >
                  View all 9 scam types →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Services */}
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-[#0A0A0A] mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              {SERVICES_DATA.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="hover:text-[#0A0A0A] hover:translate-x-0.5 inline-block transition-all duration-150"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="text-[#946E00] font-semibold hover:underline inline-block pt-1"
                >
                  All 6 services →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright Bottom Row */}
        <div className="pt-8 space-y-4">
          <div className="p-5 sm:p-6 glass-panel rounded-2xl text-xs text-[#475569] leading-relaxed">
            <strong className="text-[#0A0A0A]">Regulatory &amp; Legal Disclaimer:</strong> Chiron
            Investigations Ltd (Companies House Reg. No. 10798623 · 65 The Base, Victoria Road,
            Dartford, DA1 5FS) is an independent cybercrime intelligence and blockchain forensic
            consultancy. We are not a law firm, regulated financial services provider, or tax
            adviser, and we do not provide legal representation or tax filing advice. No outcome or
            asset recovery is ever guaranteed; freeze actions and asset restitution depend
            exclusively upon third-party exchange compliance, law enforcement intervention, and
            court orders.
          </div>

          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left gap-3 sm:gap-4 pt-1 text-xs text-[#475569]">
            <div>© 2020 - 2026 Chiron Investigations Ltd. All rights reserved.</div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
              <button
                type="button"
                onClick={onOpenCookieSettings}
                className="text-[#0A0A0A] font-medium hover:underline cursor-pointer"
              >
                Cookie Preferences
              </button>
            </div>
          </div>
        </div>
        </div>
      </Reveal>
    </footer>
  );
};
