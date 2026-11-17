export interface TeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  email?: string;
  image?: string;
  initials: string;
}

export interface CaseStudy {
  id: string;
  caseCode: string;
  title: string;
  category: 'Pig Butchering' | 'Wallet Drains' | 'Wire & APP Fraud' | 'Tax Documentation';
  jurisdiction: string;
  lossAmount: string;
  outcomeMetric: string;
  timeframe: string;
  chainsTraced: string[];
  summary: string;
  methodology: string;
  resolution: string;
}

export interface ClientReview {
  id: string;
  author: string;
  location: string;
  caseType: string;
  date: string;
  outcome: string;
  quote: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'edward-camillieri',
    name: 'Edward Camillieri',
    role: 'Managing Director & Principal Investigator',
    credentials: 'Former UK Financial Crime Liaison · CAMS',
    bio: 'Leads cross-border asset tracing mandates and law enforcement intelligence briefings across the United Kingdom, Turkey, Cyprus, Georgia, and the Netherlands.',
    email: 'edward.camillieri@chironinvestigations.co.uk',
    image: '/src/assets/images/expert_spotlight_portrait_1794892806701.jpg',
    initials: 'EC',
  },
  {
    id: 'eleanor-vance',
    name: 'Eleanor Vance',
    role: 'Head of Blockchain Forensics',
    credentials: 'CFE · Multi-Chain Cluster Architect',
    bio: 'Specializes in EVM smart-contract drainers, cross-chain bridge de-obfuscation, and VASP deposit attribution.',
    image: '/src/assets/images/team_analyst_portrait_1794892807921.jpg',
    initials: 'EV',
  },
  {
    id: 'alistair-finch',
    name: 'Alistair Finch',
    role: 'Director of Legal & Law Enforcement Liaison',
    credentials: 'Solicitor (Non-Practising) · OSINT Lead',
    bio: 'Structures court-formatted evidentiary packages for Action Fraud, Regional Organised Crime Units, and civil recovery counsel.',
    image: '/src/assets/images/team_legal_portrait_1794892807513.jpg',
    initials: 'AF',
  },
  {
    id: 'claire-beaumont',
    name: 'Claire Beaumont',
    role: 'Senior Tax & Loss Documentation Analyst',
    credentials: 'ACCA Affiliate · Valuation Forensics',
    bio: 'Prepares HMRC Negligible Value and IRS Section 165 loss substantiation packs when on-chain recovery is non-viable.',
    initials: 'CB',
  },
  {
    id: 'henrik-lindqvist',
    name: 'Dr. Henrik Lindqvist',
    role: 'Principal Threat Intelligence Researcher',
    credentials: 'PhD Distributed Systems · NATO Cooperative Cyber Alumni',
    bio: 'Maps transnational scam compound infrastructure, drainer kits, and illicit liquidity pools across European and APAC networks.',
    initials: 'HL',
  },
];

export const FEATURED_IN_OUTLETS = [
  'Financial Times',
  'City A.M.',
  'The Telegraph',
  'Reuters Legal',
  'Law Society Gazette',
  'Global Investigations Review',
  'CyberScoop',
];

export const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      'Chiron never promised a miracle. Within eight days they mapped every bridge hop of our stolen USDC to a Tier-1 exchange, giving our solicitors the exact attribution required for a disclosure order.',
    author: 'Graham Whitaker',
    role: 'Managing Partner, Whitaker & Co. Commercial Advisory',
    jurisdiction: 'Manchester, United Kingdom',
    outcome: '£184,000 traced to VASP custody in 8 days',
  },
  {
    id: 't2',
    quote:
      'After two recovery firms asked me for upfront percentages and vanished, Chiron gave me an honest assessment: my funds hit an unhosted mixer. Their Section 165 documentation pack saved me tens of thousands in verified tax offsets.',
    author: 'Rachelle Deschamps',
    role: 'Private Architecture Principal',
    jurisdiction: 'Boston, United States',
    outcome: '$240,000 Section 165 loss pack accepted by CPA',
  },
  {
    id: 't3',
    quote:
      'Local police initially closed our wire and crypto report for lack of leads. Chiron rebuilt the complete timeline and VASP cluster map, and the regional cyber unit reopened the file within two weeks.',
    author: 'David & Hannah Patel',
    role: 'Private Clients',
    jurisdiction: 'Surrey, United Kingdom',
    outcome: 'ROCU cybercrime file reopened & bank APP review upheld',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    caseCode: 'CASE DOSSIER · GB-2025-114',
    title: 'Cross-Chain Attribution of £310,000 Pig Butchering Syndicate',
    category: 'Pig Butchering',
    jurisdiction: 'United Kingdom & Singapore',
    lossAmount: '£310,000 USDT / ETH',
    outcomeMetric: '91% attributed to 2 KYC exchanges',
    timeframe: '9 Business Days',
    chainsTraced: ['Ethereum', 'Tron', 'Arbitrum'],
    summary:
      'A London-based consultant was groomed over four months via LinkedIn into funding a fraudulent DeFi liquidity-mining node.',
    methodology:
      'Chiron analysts traced 14 outbound USDT deposits through three bridge routers and matched gas-funding patterns to an operational syndicate consolidation cluster.',
    resolution:
      'Delivered a 42-page forensic dossier used by instructed London solicitors to obtain emergency freezing relief and formal VASP preservation notices.',
  },
  {
    id: 'cs-2',
    caseCode: 'CASE DOSSIER · US-2025-089',
    title: 'IRS Section 165 Substantiation Following Mixer Dispersion',
    category: 'Tax Documentation',
    jurisdiction: 'United States (California)',
    lossAmount: '$415,000 BTC / USDC',
    outcomeMetric: 'Full CPA audit pack accepted',
    timeframe: '6 Business Days',
    chainsTraced: ['Bitcoin', 'Ethereum'],
    summary:
      'A technology executive lost retirement savings to a spoofed institutional OTC platform whose exit nodes routed through sanctioned mixing infrastructure.',
    methodology:
      'Rather than advising costly speculative litigation, Chiron documented cost basis, wire provenance, on-chain deprivation, and formal irrecoverability.',
    resolution:
      'Client’s tax counsel utilized the verification schedule to substantiate a formal Section 165(c)(2) loss filing.',
  },
  {
    id: 'cs-3',
    caseCode: 'CASE DOSSIER · GB-2026-019',
    title: 'Permit2 Phishing Drain Attribution for Treasury Multisig',
    category: 'Wallet Drains',
    jurisdiction: 'United Kingdom & Switzerland',
    lossAmount: '£142,000 ETH / ERC-20',
    outcomeMetric: '100% exit route mapped',
    timeframe: '5 Business Days',
    chainsTraced: ['Ethereum', 'Base', 'Optimism'],
    summary:
      'A software founder signed a deceptive governance approval on a lookalike protocol domain, triggering an automated asset sweep.',
    methodology:
      'We separated the drainer operator’s 15% automated fee split from the attacker’s 85% swap path across decentralized aggregators to a European off-ramp.',
    resolution:
      'Preservation alert submitted via counsel within 96 hours; police cyber unit assigned an investigating officer.',
  },
  {
    id: 'cs-4',
    caseCode: 'CASE DOSSIER · GB-2025-203',
    title: 'APP Bank Transfer Fraud Evidentiary Pack for FOS Appeal',
    category: 'Wire & APP Fraud',
    jurisdiction: 'United Kingdom',
    lossAmount: '£68,500 GBP Faster Payments',
    outcomeMetric: 'Full bank reimbursement achieved',
    timeframe: '10 Business Days',
    chainsTraced: ['Faster Payments', 'Bitcoin'],
    summary:
      'A retired couple wired savings under bank-impersonation pressure into a third-party crypto broker controlled by scammers.',
    methodology:
      'Chiron reconstructed the spoofed caller metadata, documented missing confirmation-of-payee warnings, and traced the onward crypto liquidation.',
    resolution:
      'The Financial Ombudsman Service cited the structured chronology in directing reimbursement of the disputed transfers.',
  },
  {
    id: 'cs-5',
    caseCode: 'CASE DOSSIER · EU-2026-007',
    title: 'Fake Pre-IPO WhatsApp Syndicate Infrastructure Mapping',
    category: 'Pig Butchering',
    jurisdiction: 'Germany & United Kingdom',
    lossAmount: '€195,000 EUR / USDT',
    outcomeMetric: '18 linked victim clusters identified',
    timeframe: '11 Business Days',
    chainsTraced: ['Tron', 'BSC', 'Ethereum'],
    summary:
      'An engineering director deposited capital into a cloned equity-allocation portal promoted inside an impersonated analyst WhatsApp group.',
    methodology:
      'OSINT infrastructure correlation linked the app’s API endpoints and deposit wallets to 17 parallel European victim filings.',
    resolution:
      'Consolidated evidentiary report submitted to coordinated national cybercrime desks for multi-victim action.',
  },
  {
    id: 'cs-6',
    caseCode: 'CASE DOSSIER · GB-2026-031',
    title: 'HMRC Negligible Value Claim for Defunct Exchange Insolvency',
    category: 'Tax Documentation',
    jurisdiction: 'United Kingdom',
    lossAmount: '£94,200 Mixed Assets',
    outcomeMetric: 'Chartered accountant sign-off',
    timeframe: '5 Business Days',
    chainsTraced: ['Bitcoin', 'Solana', 'Ethereum'],
    summary:
      'A private investor required independent proof of asset lockup and historical sterling valuation for capital gains tax reporting.',
    methodology:
      'Reconciled original exchange CSV logs, deposit TXIDs, and public liquidation notices into a single auditable sterling ledger.',
    resolution:
      'Accepted by client’s chartered accountant for inclusion in self-assessment loss carry-forward schedules.',
  },
];

export const REVIEWS_GRID: ClientReview[] = [
  {
    id: 'r1',
    author: 'Martin Holloway',
    location: 'Bristol, UK',
    caseType: 'APP Bank Fraud',
    date: 'October 2026',
    outcome: 'FOS Dossier Delivered',
    quote:
      'Clear, factual, and completely transparent about fees and timelines. Their breakdown gave our bank dispute the credibility it was missing.',
  },
  {
    id: 'r2',
    author: 'Dr. Priya Nair',
    location: 'London, UK',
    caseType: 'Fake Investment Platform',
    date: 'September 2026',
    outcome: 'VASP Cluster Identified',
    quote:
      'Unlike aggressive recovery salespeople, Chiron’s analysts explained exactly where my ETH went and what law enforcement realistically needed.',
  },
  {
    id: 'r3',
    author: 'Kenneth Lindholm',
    location: 'Chicago, US',
    caseType: 'Pig Butchering',
    date: 'August 2026',
    outcome: 'Section 165 Pack Issued',
    quote:
      'When tracing showed the funds were unrecoverable, they told me immediately instead of stringing me along, and built an immaculate tax-loss package.',
  },
  {
    id: 'r4',
    author: 'Sophie Aldridge',
    location: 'Edinburgh, UK',
    caseType: 'Wallet Drain',
    date: 'September 2026',
    outcome: 'Police Referral Filed',
    quote:
      'Within a week I had a complete visual map of the drainer contract and the exchange exit wallet. Police Cyber Crime accepted the report on first review.',
  },
  {
    id: 'r5',
    author: 'Thomas Vance-Kerr',
    location: 'Dublin, Ireland',
    caseType: 'Corporate BEC / Crypto',
    date: 'July 2026',
    outcome: 'Counterparty Audit Complete',
    quote:
      'Discreet, measured, and forensic. Their corporate intelligence memo prevented us from wiring a second tranche to a shell counterparty.',
  },
  {
    id: 'r6',
    author: 'Naomi Okafor',
    location: 'Birmingham, UK',
    caseType: 'Romance Fraud',
    date: 'October 2026',
    outcome: 'Chronology & Tracing Complete',
    quote:
      'They treated a deeply distressing situation with dignity and zero judgment, turning hundreds of scattered screenshots into one clear dossier.',
  },
];

export const GLOBAL_JURISDICTIONS = [
  {
    index: '01',
    code: 'UK · GMT',
    region: 'United Kingdom [HQ]',
    deskType: 'Primary Headquarters',
    focus: 'Action Fraud, Regional Cyber Units, Bank APP Disputes & Solicitor Referrals',
  },
  {
    index: '02',
    code: 'TR · TRT',
    region: 'Turkey',
    deskType: 'Regional Liaison Desk',
    focus: 'Cross-Border VASP Attribution & Financial Intermediary Tracing',
  },
  {
    index: '03',
    code: 'CY · EET',
    region: 'Cyprus',
    deskType: 'Regional Liaison Desk',
    focus: 'Offshore Brokerage Entities, Payment Rail & Corporate Intelligence',
  },
  {
    index: '04',
    code: 'GE · GET',
    region: 'Georgia',
    deskType: 'Regional Liaison Desk',
    focus: 'Regional Exchange Off-Ramp Mapping & Evidentiary Coordination',
  },
  {
    index: '05',
    code: 'NL · CET',
    region: 'Netherlands',
    deskType: 'Regional Liaison Desk',
    focus: 'European Union Regulatory Packaging & Multi-Chain Graph Audits',
  },
];

export const FOOTER_FAQS = [
  {
    question: 'Do you guarantee recovery of stolen cryptocurrency?',
    answer:
      'No. Anyone promising guaranteed crypto recovery is misleading you. We provide independent forensic tracing, law-enforcement referral packages, and tax-loss documentation based strictly on verifiable evidence.',
  },
  {
    question: 'What happens during the free initial case assessment?',
    answer:
      'An investigator reviews your scam category, transaction hashes, and timeline within one business day to advise honestly whether tracing is technically viable or whether loss documentation is the more realistic route.',
  },
  {
    question: 'Are you a law firm or regulated tax adviser?',
    answer:
      'No. Chiron Investigations Ltd is an independent forensic intelligence consultancy. Where civil freezing orders or tax filings are required, we work alongside your instructed solicitor or chartered accountant.',
  },
];
