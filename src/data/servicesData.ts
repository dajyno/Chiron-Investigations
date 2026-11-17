export interface ServiceOffering {
  slug: string;
  indexLabel: string;
  title: string;
  shortTitle: string;
  category: 'Forensic Analysis' | 'Investigation & Recovery' | 'Advisory & Compliance';
  summary: string;
  heroStatement: string;
  turnaround: string;
  jurisdictions: string;
  deliverableFormat: string;
  overview: string[];
  methodologySteps: {
    step: string;
    title: string;
    detail: string;
  }[];
  deliverables: string[];
  idealFor: string[];
  disclaimerNote: string;
}

export const SERVICES_DATA: ServiceOffering[] = [
  {
    slug: 'blockchain-tracing',
    indexLabel: '01',
    title: 'Blockchain Tracing',
    shortTitle: 'Blockchain Tracing',
    category: 'Forensic Analysis',
    summary:
      'Multi-chain forensic fund-flow mapping across UTXO, EVM, Solana, and Tron networks to identify exchange exit points and attributed clusters.',
    heroStatement:
      'Follow stolen digital assets across bridges, mixers, and liquidity pools to verifiable centralized off-ramps.',
    turnaround: '5–10 Business Days',
    jurisdictions: 'UK, EU, US, Singapore, UAE',
    deliverableFormat: 'Court-Formatted Forensic Report & Chain Graph',
    overview: [
      'Cryptocurrency fraudsters rarely leave assets in the initial deposit wallet. Funds are systematically split across peel chains, cross-chain bridges, decentralized swaps, and high-risk brokers within hours of a transfer.',
      'Our forensic analysts combine commercial-grade clustering heuristics with manual transaction-graph auditing to trace stolen BTC, ETH, USDT, USDC, SOL, and altcoins from victim wallets to KYC-enforced Virtual Asset Service Providers (VASPs).',
      'Every report documents exact transaction hashes, timestamps in UTC, block heights, intermediary smart-contract interactions, and attributed exchange deposit addresses suitable for submission to police cybercrime units or civil litigation counsel.',
    ],
    methodologySteps: [
      {
        step: '01',
        title: 'Seed Address & Hash Verification',
        detail:
          'We ingest every victim wallet address, bank-to-exchange purchase receipt, and deposit TXID to establish an indisputable chain of custody.',
      },
      {
        step: '02',
        title: 'Cross-Chain & Bridge De-Obfuscation',
        detail:
          'Analysts follow wrapped assets, decentralized exchange swaps, and chain-hopping bridges using deterministic timing and volume correlation.',
      },
      {
        step: '03',
        title: 'VASP Deposit Attribution',
        detail:
          'Funds reaching regulated exchanges or OTC desks are mapped to hot-wallet clusters with identifiable deposit tags or institutional custody markers.',
      },
    ],
    deliverables: [
      'Executive Chain-of-Custody Narrative (PDF)',
      'High-Resolution Visual Transaction Flow Diagrams',
      'Full CSV Appendix of Traced Hashes, Timestamps & Clusters',
      'VASP Compliance & Preservation Reference Summary',
    ],
    idealFor: [
      'Victims who transferred funds within the past 24 months and retain transaction IDs',
      'Cases where stolen assets entered major regulated exchanges',
      'Solicitors preparing Norwich Pharmacal or Bankers Trust disclosure applications',
    ],
    disclaimerNote:
      'Tracing establishes where funds moved and which entities control destination wallets; asset freezing or return requires cooperation from the receiving exchange or a court order.',
  },
  {
    slug: 'cryptocurrency-scams',
    indexLabel: '02',
    title: 'Cryptocurrency Scams',
    shortTitle: 'Cryptocurrency Scams',
    category: 'Investigation & Recovery',
    summary:
      'Dedicated case triage, evidence structuring, and technical attribution for victims of pig butchering, fake dApps, wallet drains, and deceptive token schemes.',
    heroStatement:
      'Turn fragmented chat logs, spoofed trading dashboards, and wallet transfers into a single verified investigative record.',
    turnaround: '4–8 Business Days',
    jurisdictions: 'Global Cross-Border Cases',
    deliverableFormat: 'Scam Attribution & Evidence Dossier',
    overview: [
      'Modern cryptocurrency scams blend psychological manipulation with bespoke technical deception—including cloned trading apps, malicious Permit2 smart-contract approvals, and fabricated liquidity-mining pools.',
      'Our Cryptocurrency Scams practice provides immediate technical triage: we isolate legitimate victim deposits from fabricated dashboard balances, preserve ephemeral domain and app evidence before takedowns occur, and determine whether perpetrator exit wallets touch regulated exchanges.',
      'Where tracing confirms that funds entered unhosted mixers or irrecoverable infrastructure, we advise you candidly and compile formal deprivation schedules suitable for tax advisers (including IRS Section 165 and HMRC Negligible Value substantiation).',
    ],
    methodologySteps: [
      {
        step: '01',
        title: 'Platform & Smart-Contract Forensics',
        detail:
          'We inspect deceptive dApp URLs, APK/iOS installers, and token approval hashes to document exactly how control of your assets was compromised.',
      },
      {
        step: '02',
        title: 'Perpetrator Wallet & Syndicate Linking',
        detail:
          'Deposit addresses are screened against known scam syndicate clusters to uncover multi-victim aggregation points.',
      },
      {
        step: '03',
        title: 'Pathway Determination',
        detail:
          'Clients receive an honest written determination outlining whether exchange-focused enforcement referral or tax-loss documentation is warranted.',
      },
    ],
    deliverables: [
      'Deceptive Platform & Smart-Contract Technical Audit',
      'Consolidated Chronological Transfer & Loss Ledger',
      'Syndicate Cluster Overlap Findings',
      'Supporting Deprivation Pack for Legal or Tax Counsel',
    ],
    idealFor: [
      'Individuals targeted by pig butchering, romance-crypto grooming, or fake DeFi pools',
      'Holders affected by Web3 phishing drains or counterfeit airdrop contracts',
      'Victims needing clarity before committing to formal legal or recovery steps',
    ],
    disclaimerNote:
      'Chiron Investigations evaluates technical viability honestly at triage and never guarantees recovery of defrauded cryptocurrency.',
  },
  {
    slug: 'crypto-fraud-investigation',
    indexLabel: '03',
    title: 'Crypto Fraud Investigation',
    shortTitle: 'Crypto Fraud Investigation',
    category: 'Investigation & Recovery',
    summary:
      'Full-spectrum OSINT, corporate registry mapping, counterparty attribution, and digital forensics for complex high-value crypto fraud and insider diversion.',
    heroStatement:
      'Unmask the human infrastructure, shell entities, and payment processors operating behind fraudulent digital asset schemes.',
    turnaround: '7–14 Business Days',
    jurisdictions: 'UK, Europe, North America, Offshore Registries',
    deliverableFormat: 'Intelligence & Attribution Investigation Report',
    overview: [
      'On-chain tracing reveals where tokens moved; full Crypto Fraud Investigation uncovers who built and operated the apparatus around them.',
      'Our intelligence analysts combine blockchain attribution with Open-Source Intelligence (OSINT), passive DNS and certificate correlation, corporate directorship analysis, and telecom/payment-rail tracing to link anonymous wallet clusters to real-world corporate shells and repeat operators.',
      'This service supports both high-net-worth private clients and corporate boards investigating business email compromise (BEC), rogue employee treasury transfers, or fraudulent OTC escrow counterparties.',
    ],
    methodologySteps: [
      {
        step: '01',
        title: 'Infrastructure & Domain Attribution',
        detail:
          'Hosting footprints, SSL historical logs, API endpoints, and registrar trails are archived and linked to parallel fraud campaigns.',
      },
      {
        step: '02',
        title: 'Corporate & Payment-Rail Mapping',
        detail:
          'Front companies, mule IBANs, and shell brokerages used to onboard fiat are cross-referenced across international corporate registries.',
      },
      {
        step: '03',
        title: 'Evidentiary Attribution Report',
        detail:
          'All digital, corporate, and on-chain findings are synthesized into a unified investigation file ready for civil injunctions or criminal referral.',
      },
    ],
    deliverables: [
      'OSINT Infrastructure & Operator Link Analysis',
      'Corporate Registry & Beneficial Ownership Schedule',
      'Combined Fiat-to-Crypto Flow Attribution Map',
      'Preserved Digital Evidence Archive with Hash Verification',
    ],
    idealFor: [
      'High-value fraud exceeding £50,000 or $65,000 involving complex broker networks',
      'Corporate treasuries hit by insider diversion or vendor impersonation',
      'Litigation teams requiring actionable intelligence on opposing counterparties',
    ],
    disclaimerNote:
      'All OSINT and corporate investigative work is conducted strictly within lawful public-record, technical-metadata, and evidentiary boundaries.',
  },
  {
    slug: 'asset-recovery-solutions',
    indexLabel: '04',
    title: 'Asset Recovery Solutions',
    shortTitle: 'Asset Recovery Solutions',
    category: 'Investigation & Recovery',
    summary:
      'Strategic recovery coordination pairing VASP preservation alerts, UK bank APP reimbursement dossiers, and civil disclosure preparation with instructed counsel.',
    heroStatement:
      'Coordinate rapid preservation notices, banking dispute escalations, and solicitor-led freezing strategies where attribution exists.',
    turnaround: '5–12 Business Days',
    jurisdictions: 'UK (PSR / FOS), EU, US, International VASP Hubs',
    deliverableFormat: 'Recovery Strategy Pack & Preservation Briefing',
    overview: [
      'Genuine asset recovery is a coordinated legal and compliance process—never a technical "hack-back". When stolen funds land at a compliant exchange or leave via deceptive bank transfers, speed and evidentiary precision determine whether assets can be immobilized.',
      'Chiron Investigations prepares rapid VASP preservation request packages, coordinates technical intelligence briefings for instructed civil litigation solicitors pursuing Norwich Pharmacal or Bankers Trust orders, and builds structured Authorized Push Payment (APP) dispute dossiers for UK banking and Financial Ombudsman escalation.',
      'Where on-chain attribution indicates zero viable recovery route, we explicitly advise against speculative recovery spend and transition clients to verified fiscal loss documentation.',
    ],
    methodologySteps: [
      {
        step: '01',
        title: 'Recoverability & Custodial Assessment',
        detail:
          'We verify whether assets reside within reachable KYC custodians or qualify under statutory banking reimbursement frameworks.',
      },
      {
        step: '02',
        title: 'Preservation & Dispute Packaging',
        detail:
          'Analysts assemble exact TXIDs, deposit tags, and bank warning-failure chronologies needed for urgent VASP compliance alerts or FOS filings.',
      },
      {
        step: '03',
        title: 'Solicitor & Enforcement Handoff',
        detail:
          'We remain on standby to brief your appointed legal counsel or law enforcement officer on technical chain-of-custody questions.',
      },
    ],
    deliverables: [
      'Custodial Exchange Identification & Compliance Alert Summary',
      'APP Fraud & Financial Ombudsman Chronology Pack (where applicable)',
      'Civil Counsel Technical Affidavit Support Schedule',
      'Alternative Section 165 / HMRC Loss Documentation Pathway (if unviable)',
    ],
    idealFor: [
      'Victims whose funds entered regulated Tier-1 exchanges within actionable windows',
      'UK bank transfer victims disputing APP fraud reimbursement rejections',
      'Clients instructing civil recovery solicitors who need technical chain exhibits',
    ],
    disclaimerNote:
      'Chiron Investigations is not a law firm and does not exercise court authority. Asset freezes and restitution require exchange compliance, police action, or judicial orders.',
  },
  {
    slug: 'law-enforcement-support',
    indexLabel: '05',
    title: 'Law Enforcement Support',
    shortTitle: 'Law Enforcement Support',
    category: 'Advisory & Compliance',
    summary:
      'Structured evidentiary dossiers engineered for Action Fraud, National Crime Agency referrals, FBI IC3 filings, and Regional Organised Crime Units.',
    heroStatement:
      'Bridge the gap between raw blockchain logs and actionable criminal or regulatory investigation files.',
    turnaround: '7–12 Business Days',
    jurisdictions: 'UK (Action Fraud / ROCU), US (IC3), EUROPOL Partners',
    deliverableFormat: 'Agency-Ready Evidentiary Dossier & Timeline',
    overview: [
      'Overstretched local police units and bank fraud teams frequently close cybercrime reports because initial victim submissions lack structured technical attribution. A raw list of wallet addresses rarely triggers an international preservation request.',
      'Chiron Investigations compiles complete, plain-English evidentiary packages designed specifically around the intake standards of Action Fraud, regional UK Regional Organised Crime Units (ROCUs), FBI IC3, and international financial crime desks.',
      'Our deliverables highlight urgent VASP preservation targets, cross-case syndicate links, and concise executive timelines so investigating officers can triage and escalate the file immediately.',
    ],
    methodologySteps: [
      {
        step: '01',
        title: 'Evidence Collation & Timeline Reconstruction',
        detail:
          'Communications, domain WHOIS records, payment confirmations, and chat logs are indexed chronologically alongside financial outflows.',
      },
      {
        step: '02',
        title: 'OSINT & Cluster Enrichment',
        detail:
          'Infrastructure hosting the fraudulent domain, Telegram handles, and payment processors are linked to broader fraud syndicates.',
      },
      {
        step: '03',
        title: 'Referral Dossier & Officer Briefing',
        detail:
          'We produce a concise, prosecutor-legible dossier highlighting urgent VASP preservation targets so investigators can act quickly.',
      },
    ],
    deliverables: [
      'Chronological Incident & Financial Loss Schedule',
      'OSINT Infrastructure & Counterparty Attribution Annex',
      'Action Fraud / IC3 / ROCU Structured Submission Cover Brief',
      'Direct Technical Briefing Availability for Assigned Officers',
    ],
    idealFor: [
      'Complex multi-jurisdictional fraud exceeding £15,000 or $20,000 equivalent',
      'Cases previously stalled or closed for lack of technical leads',
      'Victims needing cohesive multi-transfer evidence before filing police reports',
    ],
    disclaimerNote:
      'Chiron Investigations does not exercise statutory police powers and cannot compel law enforcement agencies to open or prioritize an investigation.',
  },
  {
    slug: 'scam-prevention-advisory',
    indexLabel: '06',
    title: 'Scam Prevention Advisory',
    shortTitle: 'Scam Prevention Advisory',
    category: 'Advisory & Compliance',
    summary:
      'Proactive counterparty due diligence, wallet security hardening, pre-investment platform vetting, and corporate anti-fraud workshops for individuals and family offices.',
    heroStatement:
      'Verify counterparties, trading platforms, and wallet permissions before capital is committed or compromised.',
    turnaround: '2–5 Business Days',
    jurisdictions: 'Global Remote & London Chambers Briefings',
    deliverableFormat: 'Counterparty Risk Memo & Security Hardening Checklist',
    overview: [
      'Preventing an irreversible transfer is always far less costly than tracing one afterward. Many victims approach our desk only after wiring funds to an unverified investment syndicate or approving a deceptive Web3 smart contract.',
      'Our Scam Prevention Advisory service conducts rapid pre-transaction verification for private investors, executives, and family offices—vetting purported trading platforms, OTC counterparties, token contracts, and corporate registries before funds leave custody.',
      'We also deliver practical digital hygiene reviews: auditing hardware wallet workflows, multisig governance controls, SIM-swap defenses, and approval revocation protocols for individuals targeted by repeat fraud attempts.',
    ],
    methodologySteps: [
      {
        step: '01',
        title: 'Platform & Counterparty Screening',
        detail:
          'Proposed investment portals, brokers, and OTC wallets are checked against regulatory registers, domain age anomalies, and illicit cluster exposure.',
      },
      {
        step: '02',
        title: 'Wallet & Access Hygiene Audit',
        detail:
          'Analysts review token allowance exposure, device remote-access risks, and 2FA vulnerabilities without ever requesting private seed phrases.',
      },
      {
        step: '03',
        title: 'Actionable Risk Briefing',
        detail:
          'Clients receive a clear red-flag verdict and tailored operational safeguards for ongoing asset custody.',
      },
    ],
    deliverables: [
      'Pre-Transaction Counterparty & Platform Vetting Report',
      'Multi-Hop Wallet Provenance & Sanctions Check',
      'Personal or Family Office Anti-Fraud Protocol Guide',
      'Executive Re-Targeting & Impersonation Defense Briefing',
    ],
    idealFor: [
      'Investors evaluating unfamiliar crypto platforms, OTC desks, or private placements',
      'Prior fraud victims targeted by secondary "recovery room" impersonators',
      'Family offices and executives hardening digital asset custody procedures',
    ],
    disclaimerNote:
      'Scam Prevention Advisory provides independent risk intelligence and operational hygiene guidance; it does not constitute regulated investment advice.',
  },
];

export function getServiceBySlug(slug: string | undefined): ServiceOffering | undefined {
  return SERVICES_DATA.find((service) => service.slug === slug);
}
