import { LossCategory } from '../lib/caseService';

export interface ScamTypeDetail {
  slug: string;
  indexLabel: string;
  title: string;
  shortTitle: string;
  lossCategory: LossCategory;
  typicalLossRange: string;
  primaryVectors: string;
  summary: string;
  description: string[];
  warningSigns: string[];
  evidenceNeeded: string[];
  recoveryOutlook: string;
  recommendedServiceSlug: string;
}

export const SCAM_TYPES_DATA: ScamTypeDetail[] = [
  {
    slug: 'fake-investment-platforms',
    indexLabel: '01',
    title: 'Fake Investment Platforms',
    shortTitle: 'Fake Investment Platforms',
    lossCategory: 'investment',
    typicalLossRange: '£15,000 – £450,000+',
    primaryVectors: 'Cloned web terminals, fabricated ROI dashboards, blocked withdrawals',
    summary:
      'Fraudulent trading portals displaying simulated profits while routing client crypto or wire deposits directly to syndicate-controlled wallets.',
    description: [
      'Fake investment platforms mimic institutional brokerages, quantitative arbitrage funds, or AI-managed liquidity pools. Victims deposit genuine funds onto an exchange and transfer them to a platform-provided wallet address.',
      'Inside the portal, fabricated account balances climb steadily—often allowing one small initial withdrawal to establish false trust—before imposing fictitious "liquidity taxes", "AML release deposits", or "tier upgrades" when the client requests a full payout.',
    ],
    warningSigns: [
      'Demands for advance tax, gas, or verification deposits to unlock withdrawals',
      'Domain registered within the last 12 months with hidden WHOIS ownership',
      'Support conducted exclusively through WhatsApp, Telegram, or web-chat widgets',
    ],
    evidenceNeeded: [
      'Deposit wallet addresses and transaction hashes (TXIDs)',
      'Platform domain URLs and screenshots of simulated balance dashboards',
      'Receipts from your legitimate originating exchange or bank account',
    ],
    recoveryOutlook:
      'Moderate where deposits moved promptly to KYC-regulated exchanges; strong candidate for formal law-enforcement referral or tax-loss documentation if mixed.',
    recommendedServiceSlug: 'blockchain-tracing',
  },
  {
    slug: 'romance-scams',
    indexLabel: '02',
    title: 'Romance & Trust Scams',
    shortTitle: 'Romance Scams',
    lossCategory: 'romance',
    typicalLossRange: '£10,000 – £300,000+',
    primaryVectors: 'Dating apps, social media grooming, staged personal emergencies or joint ventures',
    summary:
      'Long-horizon emotional manipulation campaigns culminating in requests for cryptocurrency transfers, gift cards, or urgent international wires.',
    description: [
      'Perpetrators cultivate months-long relationships across dating applications, LinkedIn, or messaging platforms before introducing financial requests—ranging from fabricated medical crises and frozen contractor payments to joint crypto trading accounts.',
      'Because victims often send funds across dozens of incremental transfers over months, assembling a consolidated chronological loss ledger and tracing overlapping recipient clusters is essential before approaching authorities or banks.',
    ],
    warningSigns: [
      'Refusal to meet in person or consistent excuses around live video verification',
      'Gradual pivot from personal affection to financial hardship or "shared future" investments',
      'Coaching on what to tell bank fraud-prevention staff when wiring funds',
    ],
    evidenceNeeded: [
      'Full chat export or key relationship timeline screenshots',
      'All recipient wallet addresses, payment handles, and bank transfer references',
      'Phone numbers, email headers, and social profile handles used by the perpetrator',
    ],
    recoveryOutlook:
      'Varies by transfer rail; UK bank transfers may qualify for APP fraud review alongside multi-chain wallet clustering.',
    recommendedServiceSlug: 'law-enforcement-support',
  },
  {
    slug: 'pig-butchering',
    indexLabel: '03',
    title: 'Pig Butchering (Sha Zhu Pan)',
    shortTitle: 'Pig Butchering',
    lossCategory: 'crypto',
    typicalLossRange: '£25,000 – £1,200,000+',
    primaryVectors: 'Wrong-number texts, LinkedIn/WhatsApp outreach, DeFi liquidity-mining traps',
    summary:
      'Organized transnational syndicates combining social grooming with rigged decentralized trading apps or malicious smart-contract approvals.',
    description: [
      'Originating from industrial scam compounds in Southeast Asia and beyond, "pig butchering" combines confidence-building mentorship with custom spoofed trading apps or fake DeFi mining pools hosted inside legitimate mobile wallet browsers.',
      'Our forensic team tracks how victim USDT/ETH deposits flow out of spoofed dApps into multi-hop syndicate treasury clusters, identifying shared infrastructure across global cases for coordinated law-enforcement action.',
    ],
    warningSigns: [
      'Unsolicited friendly message ("wrong number") evolving into daily conversation',
      'Mentorship claiming insider gold, FX, or short-term crypto node arbitrage',
      'Instructions to connect Coinbase Wallet or Trust Wallet to an unfamiliar dApp URL',
    ],
    evidenceNeeded: [
      'Connected victim wallet address and token approval transaction hashes',
      'URL of the spoofed dApp or custom APK/iOS TestFlight installer link',
      'Complete sequence of outbound stablecoin or ETH transfers',
    ],
    recoveryOutlook:
      'High intelligence value due to syndicate cluster overlap; prompt tracing can identify cash-out exchanges before consolidation.',
    recommendedServiceSlug: 'blockchain-tracing',
  },
  {
    slug: 'bank-transfer-app-fraud',
    indexLabel: '04',
    title: 'Bank Transfer & APP Fraud',
    shortTitle: 'Bank Transfer / APP Fraud',
    lossCategory: 'wire',
    typicalLossRange: '£5,000 – £250,000+',
    primaryVectors: 'Authorized Push Payments, bank impersonation, safe-account scams, invoice hijacking',
    summary:
      'Deceptive bank-to-bank payments where victims are tricked into authorizing wires to mule accounts or fraudulent crypto on-ramps.',
    description: [
      'Authorized Push Payment (APP) fraud occurs when a victim is manipulated into sending Faster Payments, CHAPS, SEPA, or SWIFT wires—either to a fraudulent "safe account", a spoofed conveyancing invoice, or a third-party crypto broker instructed by a scammer.',
      'Under UK Payment Systems Regulator (PSR) rules and Financial Ombudsman frameworks, gathering technical proof of the fraudster’s infrastructure and bank-warning gaps significantly strengthens reimbursement appeals.',
    ],
    warningSigns: [
      'Urgent calls claiming your bank account is compromised and funds must be moved',
      'Last-minute changes to solicitor, supplier, or contractor IBAN/sort-code details',
      'Caller instructing you to lie to your bank branch about the purpose of the payment',
    ],
    evidenceNeeded: [
      'Bank payment confirmations, recipient sort codes/IBANs, and SWIFT MT103 slips',
      'Call logs, spoofed SMS alerts, and email headers for invoice diversion',
      'Copies of any bank scam-warning prompts or fraud-team call transcripts',
    ],
    recoveryOutlook:
      'Strongest statutory reimbursement prospects in the UK/EU when documented rigorously and escalated within regulatory windows.',
    recommendedServiceSlug: 'law-enforcement-support',
  },
  {
    slug: 'wallet-drains-phishing',
    indexLabel: '05',
    title: 'Wallet Drains & Phishing',
    shortTitle: 'Wallet Drains & Phishing',
    lossCategory: 'wallet_drain',
    typicalLossRange: '£5,000 – £600,000+',
    primaryVectors: 'Malicious Permit2 signatures, fake airdrop claims, compromised seed phrases',
    summary:
      'Automated smart-contract sweeping attacks triggered by deceptive Web3 wallet signatures or lookalike protocol domains.',
    description: [
      'Modern drainer kits (such as Inferno or Angel-style drainer infrastructure) trick users into signing off-chain `Permit` or `setApprovalForAll` messages on spoofed airdrop, NFT mint, or governance portals.',
      'Within seconds of signing, automated scripts sweep ERC-20 tokens and NFTs to drainer fee-split contracts. We map both the drainer operator cut and the attacker’s onward swaps to centralized exchanges.',
    ],
    warningSigns: [
      'Sponsored search ads for major DeFi protocols leading to slight typosquat domains',
      'Unexpected signature prompts requesting blind `eth_sign` or unlimited token allowance',
      'Urgent Discord or X announcements about snapshot claims or wallet migrations',
    ],
    evidenceNeeded: [
      'Compromised wallet address and exact drain transaction hash(es)',
      'Phishing URL, browser history timestamp, or social post link',
      'List of affected tokens, NFTs, and revoked approvals',
    ],
    recoveryOutlook:
      'Immediate technical triage is vital to revoke remaining allowances and trace attacker swaps before cross-chain dispersion.',
    recommendedServiceSlug: 'blockchain-tracing',
  },
  {
    slug: 'flash-btc-scams',
    indexLabel: '06',
    title: 'Flash-BTC & Fake Escrow Scams',
    shortTitle: 'Flash-BTC Scams',
    lossCategory: 'crypto',
    typicalLossRange: '£8,000 – £180,000',
    primaryVectors: 'Unconfirmed RBF transactions, spoofed watch-only wallets, fake OTC escrow',
    summary:
      'Deceptive transactions using Replace-By-Fee (RBF) cancellations, fake testnet tokens, or watch-only wallet imports to simulate receipt of Bitcoin.',
    description: [
      'In Flash-BTC and watch-only scams, a counterparty displays an unconfirmed Bitcoin transaction or imports a public address into the victim’s wallet app as a "watch-only" balance, claiming payment has arrived and demanding cash, wire, or clean USDT in return.',
      'Once the victim releases genuine value, the unconfirmed transaction is double-spent back to the attacker or revealed to have zero spendable private key.',
    ],
    warningSigns: [
      'Counterparty insisting you install a specific wallet app or import a "monitoring" string',
      'Bitcoin transaction remaining unconfirmed with abnormally low fee rates',
      'Pressure to release fiat or USDT before 3–6 on-chain confirmations finalize',
    ],
    evidenceNeeded: [
      'Raw Bitcoin TXIDs and any watch-only or spoofed token contract addresses',
      'Wallet addresses where you sent genuine consideration in exchange',
      'Escrow chat logs and OTC counterparty identity claims',
    ],
    recoveryOutlook:
      'Requires tracing the genuine outbound asset you delivered rather than the spoofed inbound transaction.',
    recommendedServiceSlug: 'blockchain-tracing',
  },
  {
    slug: 'stock-trading-scams',
    indexLabel: '07',
    title: 'Stock-Trading & WhatsApp Group Scams',
    shortTitle: 'Stock-Trading Scams',
    lossCategory: 'investment',
    typicalLossRange: '£12,000 – £350,000+',
    primaryVectors: 'Impersonated fund managers, WhatsApp VIP signal groups, pump-and-dump pre-IPOs',
    summary:
      'Coordinated social-media trading syndicates impersonating regulated analysts to funnel members into fake pre-IPO allocations or rigged apps.',
    description: [
      'Victims are added to high-polish WhatsApp or Telegram investment communities allegedly led by well-known institutional strategists. After weeks of accurate-sounding market commentary, members are invited to purchase discounted institutional blocks or IPO allocations via a custom brokerage app.',
      'Funds sent via crypto or wire to fund these "institutional seats" are immediately siphoned off, leaving victims with worthless dashboard numbers.',
    ],
    warningSigns: [
      'Paid ads on social feeds inviting users into private WhatsApp equity-research groups',
      'Bot-like group members posting identical screenshots of daily profits',
      'Proprietary trading app downloaded outside official Google Play or Apple App Store channels',
    ],
    evidenceNeeded: [
      'Group admin phone numbers, invite links, and impersonated firm names',
      'Download URLs for proprietary trading apps and deposit instructions',
      'All wire receipts or crypto TXIDs used to fund the brokerage account',
    ],
    recoveryOutlook:
      'High likelihood of syndicate overlap across multiple victims; ideal for collective intelligence dossiers and regulatory alerts.',
    recommendedServiceSlug: 'law-enforcement-support',
  },
  {
    slug: 'fake-brokers-account-takeovers',
    indexLabel: '08',
    title: 'Fake Brokers & Account Takeovers',
    shortTitle: 'Fake Brokers & Takeovers',
    lossCategory: 'other',
    typicalLossRange: '£5,000 – £400,000+',
    primaryVectors: 'Remote desktop tools (AnyDesk/TeamViewer), SIM-swapping, fake exchange support',
    summary:
      'Fraudulent "account managers" or impersonated exchange support staff gaining remote control over victim devices to liquidate holdings.',
    description: [
      'Victims seeking help with a legitimate exchange or responding to fake broker ads are persuaded to install AnyDesk, TeamViewer, or QuickSupport so an agent can "configure" their account.',
      'Under the cover of a blanked screen or rapid clicks, the attacker transfers balances out, takes out loans, or executes SIM-swap attacks to bypass SMS 2FA.',
    ],
    warningSigns: [
      'Any unsolicited request to install remote-access software for financial setup',
      'Sudden loss of mobile cellular signal preceding unauthorized exchange logins',
      'Fake support numbers found via search engines for major crypto exchanges',
    ],
    evidenceNeeded: [
      'Device connection logs, AnyDesk/TeamViewer session IDs, and attacker IP logs from your exchange',
      'Mobile carrier incident report (if SIM-swapped) and exchange audit logs',
      'Destination wallet addresses where drained funds were sent',
    ],
    recoveryOutlook:
      'Combines device-level timeline documentation, exchange preservation notices, and downstream blockchain tracing.',
    recommendedServiceSlug: 'blockchain-tracing',
  },
  {
    slug: 'job-task-giveaway-scams',
    indexLabel: '09',
    title: 'Job, Task & Giveaway Scams',
    shortTitle: 'Job, Task & Giveaway Scams',
    lossCategory: 'crypto',
    typicalLossRange: '£2,000 – £95,000',
    primaryVectors: 'App-optimization "task" portals, fake recruiter deposits, social celebrity giveaways',
    summary:
      'Escalating "prepaid task" employment traps and counterfeit doubling giveaways requiring victims to deposit their own crypto to earn commissions.',
    description: [
      'Job and task scams pose as legitimate e-commerce or app-marketing agencies offering remote daily commissions for clicking product reviews. After paying out a small initial bonus, the platform assigns "combo tasks" that force the worker to deposit progressively larger sums of USDT to clear a negative balance.',
      'Similarly, fake giveaway streams impersonate technology founders promising instant 2x crypto returns to anyone sending funds to a promotional address.',
    ],
    warningSigns: [
      'Remote job requiring you to deposit your own cryptocurrency to complete work tasks',
      'Escalating negative account balances ("lucky orders") demanding immediate top-ups',
      'Any livestream or social thread promising guaranteed crypto multiplication',
    ],
    evidenceNeeded: [
      'Task platform URLs, recruiter WhatsApp/Telegram handles, and employment pitch messages',
      'Every deposit wallet address and TXID sent to clear task balances',
      'Screenshots of platform commission rules and blocked withdrawal errors',
    ],
    recoveryOutlook:
      'Task scam deposit addresses frequently aggregate funds rapidly into regional exchange hubs, enabling clear attribution.',
    recommendedServiceSlug: 'cryptocurrency-scams',
  },
];

export function getScamTypeBySlug(slug: string | undefined): ScamTypeDetail | undefined {
  return SCAM_TYPES_DATA.find((item) => item.slug === slug);
}
