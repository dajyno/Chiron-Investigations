import React, { Suspense, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { MotionConfig, motion } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { CookieBanner, getSavedCookiePreferences } from './components/CookieBanner';
import { HeroReveal } from './components/MotionPrimitives';
import { PageRouteSkeleton } from './components/StateFeedback';
import { HomePage } from './pages/HomePage';
import { testConnection } from './lib/firebase';

const ServicesPage = React.lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const ScamTypesPage = React.lazy(() =>
  import('./pages/ScamTypesPage').then((m) => ({ default: m.ScamTypesPage }))
);
const HowItWorksPage = React.lazy(() =>
  import('./pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage }))
);
const CaseStudiesPage = React.lazy(() =>
  import('./pages/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage }))
);
const AboutPage = React.lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const AssessmentPage = React.lazy(() =>
  import('./pages/AssessmentPage').then((m) => ({ default: m.AssessmentPage }))
);
const PortalPage = React.lazy(() =>
  import('./pages/PortalPage').then((m) => ({ default: m.PortalPage }))
);
const AdminPage = React.lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Chiron Investigations | Cybercrime Forensics & Cryptocurrency Recovery',
  '/services': 'Forensic Services | Chiron Investigations',
  '/scam-types': 'Scam Types Investigated | Chiron Investigations',
  '/how-it-works': 'How It Works & Forensic Methodology | Chiron Investigations',
  '/process': 'Forensic Process | Chiron Investigations',
  '/case-studies': 'Case Studies & Outcomes | Chiron Investigations',
  '/about': 'About Us & Leadership | Chiron Investigations',
  '/assessment': 'Free Case Assessment | Chiron Investigations',
  '/contact': 'Contact & Intake | Chiron Investigations',
  '/portal': 'Client Case Portal | Chiron Investigations',
  '/admin': 'Investigator Admin Console | Chiron Investigations',
};

const ScrollAndMetaManager: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const baseKey =
      Object.keys(ROUTE_TITLES).find((key) =>
        key === '/' ? pathname === '/' : pathname.startsWith(key)
      ) || '/';
    document.title = ROUTE_TITLES[baseKey];
  }, [pathname]);

  return null;
};

const NotFoundPage: React.FC = () => (
  <div className="bg-white min-h-[60vh] flex items-center justify-center px-4 py-20">
    <HeroReveal className="max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center shadow-[0_12px_32px_-12px_rgba(10,10,10,0.08)]">
      <p className="text-xs font-mono-tabular font-semibold text-[#946E00]">404</p>
      <h1 className="text-xl font-bold text-[#0A0A0A] mt-2">Page Not Located</h1>
      <p className="text-sm text-[#475569] mt-2">
        The requested advisory route does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center mt-6 px-5 py-2.5 luxury-btn-primary text-xs font-semibold"
      >
        Return to Home
      </Link>
    </HeroReveal>
  </div>
);

const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const [cookieVisible, setCookieVisible] = useState<boolean>(false);
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  useEffect(() => {
    testConnection();
    const saved = getSavedCookiePreferences();
    if (!saved) {
      setCookieVisible(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <ScrollAndMetaManager />
      <Header />
      <main className="flex-1">
        <motion.div
          key={pathname}
          initial={{ opacity: 0.92, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<PageRouteSkeleton />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServicesPage />} />
              <Route path="/scam-types" element={<ScamTypesPage />} />
              <Route path="/scam-types/:slug" element={<ScamTypesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/process" element={<HowItWorksPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/contact" element={<AssessmentPage isContactRoute />} />
              <Route path="/portal" element={<PortalPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      </main>
      {!isAdminRoute && <FaqSection />}
      <Footer onOpenCookieSettings={() => setCookieVisible(true)} />
      <WhatsAppFloatingButton />
      <CookieBanner visible={cookieVisible} onClose={() => setCookieVisible(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}
