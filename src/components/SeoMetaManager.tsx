import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getServiceBySlug } from '../data/servicesData';
import { getScamTypeBySlug } from '../data/scamTypesData';

interface RouteMeta {
  title: string;
  description: string;
}

const DEFAULT_META: RouteMeta = {
  title: 'Chiron Investigations | Cybercrime Forensics & Cryptocurrency Recovery',
  description:
    'Independent cybercrime investigation, blockchain forensics, and cryptocurrency asset recovery advisory for victims and legal counsel.',
};

const STATIC_ROUTE_META: Record<string, RouteMeta> = {
  '/': DEFAULT_META,
  '/services': {
    title: 'Forensic Services | Chiron Investigations',
    description:
      'Explore our six core cybercrime forensic services, including multi-chain tracing, scam attribution, exchange liaison, and tax-loss packs.',
  },
  '/scam-types': {
    title: 'Scam Types Investigated | Chiron Investigations',
    description:
      'Review cryptocurrency, wire, and online fraud schemes investigated by Chiron Investigations, including fake platforms, pig butchering, and wallet drains.',
  },
  '/how-it-works': {
    title: 'How It Works & Forensic Methodology | Chiron Investigations',
    description:
      'Understand our four-stage cybercrime investigation process from encrypted case intake and TXID triage to multi-chain clustering and formal reporting.',
  },
  '/process': {
    title: 'Forensic Process | Chiron Investigations',
    description:
      'Step-by-step blockchain forensic triage, cross-chain attribution, and evidentiary reporting workflow at Chiron Investigations.',
  },
  '/case-studies': {
    title: 'Case Studies & Outcomes | Chiron Investigations',
    description:
      'Examine anonymized blockchain forensic case studies demonstrating cross-chain tracing, exchange attribution, and evidentiary documentation outcomes.',
  },
  '/about': {
    title: 'About Us & Leadership | Chiron Investigations',
    description:
      'Meet the leadership, certified forensic analysts, and UK investigative team behind Chiron Investigations Ltd (Companies House Reg. No. 10798623).',
  },
  '/assessment': {
    title: 'Free Case Assessment | Chiron Investigations',
    description:
      'Submit a confidential cybercrime or cryptocurrency loss assessment to receive a unique Case Reference ID and forensic triage review.',
  },
  '/contact': {
    title: 'Contact & Intake | Chiron Investigations',
    description:
      'Contact Chiron Investigations via direct telephone, WhatsApp investigative desk, email, or confidential assessment intake in Dartford, UK.',
  },
  '/portal': {
    title: 'Client Case Portal | Chiron Investigations',
    description:
      'Verify your Case Reference ID to inspect live forensic triage stages, assigned investigator details, and append supplementary transaction hashes.',
  },
  '/admin': {
    title: 'Investigator Admin Console | Chiron Investigations',
    description:
      'Restricted Chiron Investigations staff console for managing case intake dossiers, triage stages, analyst assignments, and staff accounts.',
  },
};

function resolveRouteMeta(pathname: string): RouteMeta {
  if (pathname.startsWith('/services/')) {
    const slug = pathname.replace('/services/', '').split('/')[0];
    const service = getServiceBySlug(slug);
    if (service) {
      return {
        title: `${service.title} | Chiron Investigations`,
        description: service.summary,
      };
    }
  }

  if (pathname.startsWith('/scam-types/')) {
    const slug = pathname.replace('/scam-types/', '').split('/')[0];
    const scam = getScamTypeBySlug(slug);
    if (scam) {
      return {
        title: `${scam.title} | Chiron Investigations`,
        description: scam.summary,
      };
    }
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return STATIC_ROUTE_META['/admin'];
  }

  return STATIC_ROUTE_META[pathname] || DEFAULT_META;
}

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLinkTag(rel: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export const SeoMetaManager: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const meta = resolveRouteMeta(pathname);
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${pathname}`;
    const ogImageUrl = `${origin}/src/assets/images/og-image.png`;
    const logoUrl = `${origin}/src/assets/images/chiron-logo.svg`;

    document.title = meta.title;
    upsertLinkTag('canonical', canonicalUrl);

    // Standard SEO
    upsertMetaTag('name', 'description', meta.description);

    // Open Graph
    upsertMetaTag('property', 'og:site_name', 'Chiron Investigations');
    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', meta.description);
    upsertMetaTag('property', 'og:image', ogImageUrl);
    upsertMetaTag('property', 'og:image:type', 'image/png');
    upsertMetaTag('property', 'og:image:alt', meta.title);
    upsertMetaTag('property', 'og:logo', logoUrl);

    // Twitter / X Cards
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', meta.title);
    upsertMetaTag('name', 'twitter:description', meta.description);
    upsertMetaTag('name', 'twitter:image', ogImageUrl);
    upsertMetaTag('name', 'twitter:image:alt', meta.title);

    // Schema.org JSON-LD
    const ldScript = document.getElementById('chiron-structured-data');
    if (ldScript) {
      ldScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Chiron Investigations',
        url: canonicalUrl,
        description: meta.description,
        logo: logoUrl,
        image: ogImageUrl,
        telephone: '+44 73 4822 6461',
        email: 'info@chironinvestigations.co.uk',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '65 The Base, Victoria Road',
          addressLocality: 'Dartford',
          postalCode: 'DA1 5FS',
          addressCountry: 'GB',
        },
      });
    }
  }, [pathname]);

  return null;
};
