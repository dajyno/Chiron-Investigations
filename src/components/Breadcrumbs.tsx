import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
          <li>
            <Link to="/" className="hover:text-[#0A0A0A] transition-colors">
              Home
            </Link>
          </li>
          {items.map((item, idx) => (
            <React.Fragment key={`${item.label}-${idx}`}>
              <li aria-hidden="true" className="text-[#94A3B8]">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                {item.to && idx < items.length - 1 ? (
                  <Link to={item.to} className="hover:text-[#0A0A0A] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#0A0A0A] font-medium" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};
