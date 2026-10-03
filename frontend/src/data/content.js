export const nav = [
  { label: "Home", href: "/" },

  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const hero = {
  eyebrow: "A calmer way into crypto",
  heading: ["Understand Crypto Before You Put A Single Dollar Into It."],
  subtitle:
    "We explain how crypto trading actually works — the good parts and the bad parts. No hype. No price predictions. No pressure to buy anything.",
  primaryCta: "Start learning free",
  secondaryCta: "See the Risks first",
  scrollHint: "Scroll to explore",
};

export const trustedBy = {
  label: "Studied inside teams at",
  logos: [
    "Northwind Capital",
    "Fieldstone",
    "Arcadia Labs",
    "Vantage Point",
    "Meridian & Co",
    "Kessler Group",
  ],
};

export const features = [
  {
    title: "You control your own money",
    description:
      "With self-custody, nobody can freeze your account or block a transaction.",
    icon: "wallet",
  },
  {
    title: "Works across borders",
    description:
      "International transfers can often be completed faster and at lower cost.",
    icon: "globe",
  },
  {
    title: "Open to anyone",
    description:
      "Anyone with internet access can participate without opening a bank account.",
    icon: "users",
  },
  {
    title: "Growing technology",
    description:
      "Blockchain is being used in payments, identity, gaming, logistics and many other industries.",
    icon: "cpu",
  },
  {
    title: "Transparency",
    description:
      "Transactions are recorded publicly on the blockchain for anyone to verify.",
    icon: "eye",
  },
  {
    title: "Peer-to-peer",
    description:
      "Money can move directly between people without relying on traditional intermediaries.",
    icon: "link",
  },
];

export const timeline = [
  {
    year: "Week 1",
    title: "Money, ledgers, and why blockchains exist",
    description:
      "Start from first principles: what a ledger is, why trust is expensive, and what problem a blockchain actually solves.",
  },
  {
    year: "Week 2",
    title: "Wallets, keys, and custody",
    description:
      "Learn the difference between holding your own keys and trusting an exchange, and set up your first practice wallet.",
  },
  {
    year: "Week 3",
    title: "Reading the chain",
    description:
      "Follow a real transaction from broadcast to confirmation, and learn to read a block explorer like a native speaker.",
  },
  {
    year: "Week 4",
    title: "Tokens, contracts, and use cases",
    description:
      "See how tokens differ from coins, what a smart contract actually automates, and where the real-world use cases hold up.",
  },
  {
    year: "Week 5",
    title: "Risk, custody, and your own plan",
    description:
      "Close with a personal framework for position sizing, custody, and the questions to ask before you ever fund an account.",
  },
];

export const stats = [
  { value: 128000, suffix: "+", label: "Lessons completed" },
  { value: 94, suffix: "%", label: "Finish their first module" },
  { value: 46, suffix: "", label: "Countries represented" },
  { value: 4.9, suffix: "/5", label: "Average learner rating", decimals: 1 },
];

export const learningCards = [
  {
    title: "Foundations",
    tag: "Beginner",
    description:
      "Money, ledgers, and the problem blockchain solves — no prior knowledge assumed.",
  },
  {
    title: "Wallets & Custody",
    tag: "Beginner",
    description:
      "Set up a practice wallet and understand the difference between custodial and self-custody.",
  },
  {
    title: "Reading On-Chain Data",
    tag: "Intermediate",
    description:
      "Follow real transactions and learn to navigate a block explorer with confidence.",
  },
  {
    title: "Tokens & Contracts",
    tag: "Intermediate",
    description:
      "Understand what a smart contract automates and where tokens create genuine utility.",
  },
  {
    title: "Risk & Position Sizing",
    tag: "Advanced",
    description:
      "Build a personal framework for how much exposure makes sense for your situation.",
  },
];

export const process = [
  {
    step: "01",
    title: "Take the placement quiz",
    description:
      "Five minutes tells us what you already know, so you skip nothing and repeat nothing.",
  },
  {
    step: "02",
    title: "Follow your path",
    description:
      "A sequenced curriculum adjusts as you go — each lesson unlocks the next once you have shown it stuck.",
  },
  {
    step: "03",
    title: "Practice in a sandbox",
    description:
      "Every major concept has a hands-on exercise in a risk-free practice environment before it counts as done.",
  },
  {
    step: "04",
    title: "Review with a mentor",
    description:
      "Bring your questions to live office hours, or ask in the community between sessions.",
  },
];

export const testimonials = [
  {
    quote:
      "I had read three books on blockchain and still could not explain it to my dad. Two weeks into this course, I could.",
    name: "Priya Nandakumar",
    role: "Product Manager",
  },
  {
    quote:
      "The sandbox wallet is what sold me. I made every beginner mistake with fake funds instead of my rent money.",
    name: "Daniel Okafor",
    role: "Graduate Student",
  },
  {
    quote:
      "Most crypto content assumes you already want to trade. This is the first course that assumed I just wanted to understand it.",
    name: "Elena Marchetti",
    role: "Financial Analyst",
  },
  {
    quote:
      "The weekly office hours turned a self-paced course into something that actually felt taught.",
    name: "Marcus Webb",
    role: "Software Engineer",
  },
];

export const pricing = [
  {
    name: "Explorer",
    price: "0",
    period: "forever",
    description: "Everything you need to decide if crypto is worth your time.",
    features: [
      "Foundations module",
      "Practice wallet sandbox",
      "Community access",
      "Progress tracking",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Guided",
    price: "24",
    period: "per month",
    description: "The full curriculum with mentor support built in.",
    features: [
      "Everything in Explorer",
      "Full 5-week curriculum",
      "Live mentor office hours",
      "On-chain data labs",
      "Certificate of completion",
    ],
    cta: "Start 7-day trial",
    featured: true,
  },
  {
    name: "Cohort",
    price: "89",
    period: "per month",
    description: "For teams onboarding several people at once.",
    features: [
      "Everything in Guided",
      "Up to 10 learner seats",
      "Private cohort scheduling",
      "Progress dashboard for admins",
      "Priority mentor response",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

export const faqs = [
  {
    question: "Do I need any technical background to start?",
    answer:
      "No. The Foundations module assumes no prior knowledge of finance or programming — every term is defined the first time it appears.",
  },
  {
    question: "Will this teach me how to trade?",
    answer:
      "Not directly. cryptolearner.us focuses on understanding how the technology and markets work. Several learners go on to trade afterward, but the course itself is deliberately not a trading strategy.",
  },
  {
    question: "What is the practice wallet, exactly?",
    answer:
      "It is a sandboxed wallet connected to a test network, so you can send transactions, pay simulated gas fees, and make mistakes without any real funds at risk.",
  },
  {
    question: "How long does the full curriculum take?",
    answer:
      "Most learners finish the five-week core curriculum in six to eight weeks at roughly 45 minutes a week, though the path adjusts to your pace.",
  },
  {
    question: "Can I cancel a paid plan at any time?",
    answer:
      "Yes. Guided and Cohort plans are billed monthly with no long-term contract, and you keep access until the end of the billing period.",
  },
];

export const ctaBanner = {
  heading: "Your first honest lesson on crypto is free.",
  subtitle:
    "Ten minutes in, you will know whether this is worth your time. No card required.",
  cta: "Start learning free",
};

export const aboutHero = {
  eyebrow: "ABOUT CRYPTOLEARNER",
  heading: "We explain crypto. We don't sell it..",
  subtitle:
    "CryptoLearner exists to help people understand cryptocurrency clearly enough to make their own decisions — safely, skeptically, and without pressure. We don't recommend coins. We don't predict prices. We don't accept payment to favor any exchange or token. If a page ever reads like a sales pitch, tell us — that's not what we're here to do.",
};

export const aboutStory = {
  eyebrow: "Why we started this",
  heading: "Because most crypto content picks a side we didn't want to pick",
  paragraphs: [
    "Most crypto content online falls into one of two camps: it's trying to sell you something, or it's trying to scare you. Neither one actually helps a beginner.",
    "We started CryptoLearner because we kept seeing the same thing happen — smart, careful people making decisions about crypto based on hype, fear, or a confusing YouTube video, simply because no one had explained it to them plainly.",
    "So we built the site we wished existed: plain language, real risks stated clearly, and no agenda beyond helping you understand what you're actually looking at.",
  ],
};

export const editorialProcess = {
  eyebrow: "How we write and review",
  heading: "The same process, every single guide",
  steps: [
    {
      title: "Research from primary sources",
      description:
        "We start with regulators, whitepapers, and academic material — not other blogs or forums.",
    },
    {
      title: "A second reviewer checks it",
      description:
        "Before anything is published, someone with a relevant financial credential reviews it for accuracy and clarity.",
    },
    {
      title: "We date everything",
      description:
        "Every guide shows when it was written and when it was last checked.",
    },
    {
      title: "We recheck it regularly",
      description:
        "Crypto information can go stale within weeks. We re-review every guide at least every six months, sooner if the industry changes.",
    },
  ],
  note: "If we get something wrong, we fix it and say so — see our correction policy below.",
};

export const aboutAuthors = {
  eyebrow: "Who writes for CryptoLearner",
  heading: "Real people, real credentials",
  people: [
    {
      name: "Maria Ortiz",
      credential: "CFA · 9 yrs financial writing",
      bio: "Former equity research associate. Covers fundamentals, market structure, and how to evaluate an asset before buying it.",
    },
    {
      name: "David Chen",
      credential: "CFP · Fraud & security specialist",
      bio: "Advises everyday consumers on financial fraud prevention. Leads our Safety & Scams coverage.",
    },
  ],
};

export const neverDo = {
  eyebrow: "What we will never do",
  heading: "A short list, but we mean every line",
  items: [
    'We will never tell you a coin is "guaranteed" to go up.',
    "We will never publish a price prediction.",
    "We will never accept payment to favor one exchange, wallet, or token over another.",
    "We will never bury a risk to make a guide sound more exciting.",
    "We will never ask you for your seed phrase, password, or wallet keys — not in a comment, not in a chat, not ever.",
  ],
};

export const correctionsPolicy = {
  eyebrow: "Corrections policy",
  heading: "We'd rather admit a mistake than protect our ego",
  intro:
    "If you spot something inaccurate or outdated, tell us. We log every correction publicly with the date and a short note on what changed. You can see our correction history",
  linkLabel: "here",
  linkHref: "#",
  closing:
    "That's the whole point of this site — learning together, in the open.",
};

export const aboutContact = {
  eyebrow: "Get in touch",
  heading: "Questions, corrections, or just want to say hello?",
  subtitle: "We read every message ourselves.",
  options: [
    {
      label: "Call",
      title: "+1 (213) 538-2554",
      detail: "Mon–Fri, 9am–6pm ET",
      icon: "pulse",
    },
    {
      label: "Chat",
      title: "WhatsApp",
      detail: "Usually a reply within an hour",
      icon: "chat",
    },
    {
      label: "Email",
      title: "support@cryptolearner.us",
      detail: "We reply personally",
      icon: "mail",
    },
  ],
  safetyNote:
    "We will never ask for your wallet keys, passwords, or payment over chat.",
};

export const closingQuote = {
  text: "Thanks for taking the time to understand this world a little more carefully. That instinct — to learn before you leap — is exactly what will keep you safe here and everywhere else in crypto.",
};

export const missionVision = [
  {
    title: "Our mission",
    description:
      "Make the underlying technology of crypto understandable to anyone, regardless of financial or technical background, before they ever risk a dollar.",
    icon: "map",
  },
  {
    title: "Our vision",
    description:
      'A world where "I don’t understand crypto" is never the reason someone gets taken advantage of, or talked out of a decision that was right for them.',
    icon: "pulse",
  },
];

export const aboutTimeline = [
  {
    year: "2021",
    title: "The whiteboard moment",
    description:
      "A frustrated explanation attempt becomes the seed of a curriculum.",
  },
  {
    year: "2022",
    title: "First cohort, twelve learners",
    description:
      "We taught the first version of the course live, over video calls, to twelve people willing to be guinea pigs.",
  },
  {
    year: "2023",
    title: "The practice wallet ships",
    description:
      "Learners could finally make mistakes with fake funds instead of real ones.",
  },
  {
    year: "2024",
    title: "100,000 lessons completed",
    description:
      "The curriculum expanded to five weeks, with mentor office hours added.",
  },
  {
    year: "Today",
    title: "Still taught by humans",
    description:
      "Every cohort still includes live mentor sessions — no fully-automated version exists.",
  },
];

export const values = [
  {
    title: "Clarity over hype",
    description:
      "If a lesson needs jargon to sound impressive, we rewrite it until it does not.",
    icon: "book",
  },
  {
    title: "Safety first",
    description:
      "Every practical exercise happens in a sandbox before it happens with real funds.",
    icon: "shield",
  },
  {
    title: "Taught by humans",
    description:
      "Mentors hold live office hours every week — this is not a content library with a chatbot bolted on.",
    icon: "chat",
  },
  {
    title: "Evidence, not opinions",
    description:
      "Lessons reference real, current on-chain data instead of hypothetical examples.",
    icon: "pulse",
  },
];

export const aboutStats = [
  { value: 128000, suffix: "+", label: "Lessons completed" },
  { value: 46, suffix: "", label: "Countries represented" },
  { value: 12, suffix: "", label: "Full-time mentors" },
  { value: 4.9, suffix: "/5", label: "Average learner rating", decimals: 1 },
];

export const aboutCta = {
  heading: "Come see what a calmer crypto education looks like.",
  subtitle:
    "Ten minutes in, you will know whether this is worth your time. No card required.",
  cta: "Start learning free",
};

export const contactHero = {
  eyebrow: "ABOUT CRYPTOLEARNER",
  heading: "We explain crypto. We don't sell it.",
  subtitle:
    "CryptoLearner exists to help people understand cryptocurrency clearly enough to make their own decisions — safely, skeptically, and without pressure. We don't recommend coins. We don't predict prices. We don't accept payment to favor any exchange or token. If a page ever reads like a sales pitch, tell us — that's not what we're here to do.",
};

export const contactInfo = [
  {
    title: "Call",
    detail: "+1 (213) 538-2554",
    description: "Mon–Fri, 9am–6pm ET.",
    icon: "pulse",
  },
  {
    title: "Chat",
    detail: "WhatsApp",
    description: "Usually a reply within an hour.",
    icon: "chat",
  },
  {
    title: "Email",
    detail: "support@cryptolearner.us",
    description: "",
    icon: "mail",
  },
];

export const contactStory = {
  heading: "Why We Started This",
  paragraphs: [
    "Most crypto content online falls into one of two camps: it's trying to sell you something, or it's trying to scare you. Neither one actually helps a beginner.",
    "We started CryptoLearner because we kept seeing the same thing happen — smart, careful people making decisions about crypto based on hype, fear, or a confusing YouTube video, simply because no one had explained it to them plainly.",
    "So we built the site we wished existed: plain language, real risks stated clearly, and no agenda beyond helping you understand what you're actually looking at.",
  ],
};

export const contactReviewProcess = {
  heading: "How We Write and Review",
  intro: "Every guide follows the same process, every time:",
  steps: [
    {
      title: "Research from primary sources.",
      description:
        "We start with regulators, whitepapers, and academic material — not other blogs or forums.",
    },
    {
      title: "A second reviewer checks it.",
      description:
        "Before anything is published, someone with a relevant financial credential reviews it for accuracy and clarity.",
    },
    {
      title: "We date everything.",
      description:
        "Every guide shows when it was written and when it was last checked.",
    },
    {
      title: "We recheck it regularly.",
      description:
        "Crypto information can go stale within weeks. We re-review every guide at least every six months, and sooner if something in the industry changes.",
    },
  ],
  note: "If we get something wrong, we fix it and say so — see our correction policy below.",
};

export const contactWriters = {
  heading: "Who Writes for CryptoLearner",
  people: [
    {
      name: "Maria Ortiz1",
      credential: "CFA, 9 years in financial writing",
      bio: "Former equity research associate. Covers fundamentals, market structure, and how to evaluate an asset before buying it.",
    },
    {
      name: "David Chen",
      credential: "CFP, fraud & security specialist",
      bio: "Advises everyday consumers on financial fraud prevention. Leads our Safety & Scams coverage.",
    },
  ],
};

export const contactNeverDo = {
  heading: "What We Will Never Do",
  items: [
    'We will never tell you a coin is "guaranteed" to go up.',
    "We will never publish a price prediction.",
    "We will never accept payment to favor one exchange, wallet, or token over another.",
    "We will never bury a risk to make a guide sound more exciting.",
    "We will never ask you for your seed phrase, password, or wallet keys — not in a comment, not in a chat, not ever.",
  ],
};

export const contactCorrections = {
  heading: "Corrections Policy",
  intro:
    "If you spot something inaccurate or outdated, tell us. We log every correction publicly with the date and a short note on what changed. You can see our correction history",
  linkLabel: "here",
  linkHref: "#",
  closing:
    "We'd rather admit a mistake quickly than protect our ego. That's the whole point of this site.",
};

export const contactGetInTouch = {
  heading: "Get in Touch",
  intro:
    "Questions, corrections, or just want to say hello? We read every message ourselves.",
  safetyNote:
    "We will never ask for your wallet keys, passwords, or payment over chat.",
};

export const contactClosing = {
  text: "Thanks for taking the time to understand this world a little more carefully. That instinct — to learn before you leap — is exactly what will keep you safe here and everywhere else in crypto.",
};

export const officeHours = [
  { day: "Monday – Friday", hours: "9:00am – 6:00pm ET" },
  { day: "Saturday", hours: "10:00am – 2:00pm ET" },
  { day: "Sunday", hours: "Closed" },
];

export const contactFaqs = [
  {
    question: "How quickly will I hear back?",
    answer:
      "Most messages get a reply within one business day. Mentor-specific questions may take a little longer during peak enrollment weeks.",
  },
  {
    question: "Do you offer support for teams or cohorts?",
    answer:
      "Yes — the Cohort plan includes a dedicated onboarding call. Mention your team size in the message and we will follow up with scheduling options.",
  },
  {
    question: "Can I request a feature or lesson topic?",
    answer:
      "Always. A meaningful share of our curriculum roadmap comes directly from learner requests.",
  },
];

export const cryptoBasics = {
  eyebrow: "Before you begin",
  heading: "What is cryptocurrency? (In plain words)",
  subtitle:
    "Cryptocurrency is digital money. You can't hold it in your hand like a coin or a note — it only exists as numbers on a computer network.Regular money — dollars, euros, rupees — is controlled by a government and its central bank. The bank keeps track of who has how much. Cryptocurrency is controlled by no one. Instead, thousands of computers around the world work together to keep track of who owns what. This shared record is called a blockchain. Bitcoin was the first cryptocurrency, created in 2009. Since then, thousands of others have been created — Ethereum, and many more. Why this matters to you: crypto doesn't work like the money you're used to. There's no bank to call if something goes wrong, no government insurance if you lose money, and no way to reverse a mistaken payment. That isn't necessarily bad — but it's different, and you need to understand the difference before you use it.",
  compare: {
    regular: {
      title: "Regular money",
      points: [
        "Controlled by a government and central bank",
        "Bank insures deposits up to a limit",
        "Mistaken payments can often be reversed",
        "Bank can freeze or assist with your account",
      ],
    },
    crypto: {
      title: "Cryptocurrency",
      points: [
        "Controlled by a global network of computers",
        "No government insurance on holdings",
        "Transactions are generally permanent",
        "No central authority to call for help",
      ],
    },
  },
  howItWorks: {
    heading: "How does crypto trading actually work?",
    steps: [
      {
        title: "Create an account on an exchange",
        description:
          "A digital marketplace where people buy and sell crypto, similar in idea to a stock market.",
      },
      {
        title: "Verify your identity",
        description:
          "Required by law on legitimate exchanges. If a platform skips this, treat it as a warning sign.",
      },
      {
        title: "Deposit money",
        description:
          "Transfer regular currency, like US dollars, into your exchange account.",
      },
      {
        title: "Place an order",
        description:
          "Choose which cryptocurrency to buy and how much. The exchange matches you with a seller.",
      },
      {
        title: "Store it",
        description:
          "It sits in the exchange's storage, or you move it to your own personal wallet.",
      },
      {
        title: "Buy, hold, or sell",
        description:
          "Based on your own research — never on pressure or promises of guaranteed profit.",
      },
    ],
  },
  investingVsTrading: {
    heading: "What is crypto trading?",
    cards: [
      {
        label: "01 — Investing",
        title: "Buy and hold",
        description:
          "Buying a cryptocurrency and holding onto it for months or years, hoping it becomes more valuable over time — closer to how people invest in stocks.",
      },
      {
        label: "02 — Trading",
        title: "Buy and sell frequently",
        description:
          "Buying and selling more often — sometimes within days, hours, or minutes — trying to profit from short-term price changes. Most beginners who try this lose money.",
      },
    ],
  },
  terms: {
    heading: "Two words you'll hear constantly",
    items: [
      {
        word: "Wallet",
        description:
          "Your personal storage for crypto. An exchange wallet means the platform holds it for you; a self-custody wallet means you hold the keys — more control, but 100% your responsibility.",
      },
      {
        word: "Seed phrase",
        description:
          "A list of 12–24 random words that acts like a master password to your wallet. Lose it and no one — not even the wallet company — can get your funds back.",
      },
    ],
  },
  guidesCta: {
    label: "Want to go deeper? Explore our guides on the blog",
    href: "/blog",
  },
};

export const cryptoUpside = {
  risks: [
    {
      title: "Price volatility",
      description: "Crypto prices can rise or fall dramatically within hours.",
    },
    {
      title: "Scams & fraud",
      description: "Fake investment schemes and phishing attacks are common.",
    },
    {
      title: "No guaranteed protection",
      description:
        "Unlike bank deposits, crypto usually has no government insurance.",
    },
    {
      title: "Irreversible transactions",
      description:
        "Sending funds to the wrong address usually cannot be reversed.",
    },
    {
      title: "Regulatory uncertainty",
      description:
        "Rules and taxation vary by country and can change over time.",
    },
    {
      title: "Private key loss",
      description:
        "If you lose your recovery phrase, you may permanently lose access to your crypto.",
    },
  ],
};

export const safetyChecklist = {
  eyebrow: "If you choose to",
  heading: "How people actually lower the risk.",
  items: [
    {
      lead: "Learn before you buy anything.",
      rest: "Understand what you're buying and why.",
    },
    {
      lead: "Only use money you can afford to lose completely.",
      rest: "Never rent money, emergency savings, or borrowed money.",
    },
    {
      lead: "Start small.",
      rest: "There’s no rule that says you have to buy a lot to get started.",
    },
    {
      lead: "Use well-known, regulated exchanges.",
      rest: "Check if they're registered with relevant authorities in your country.",
    },
    {
      lead: "Turn on two-factor authentication.",
      rest: "One of the simplest ways to prevent theft on every account.",
    },
    {
      lead: "Never share your seed phrase.",
      rest: 'Not with anyone — including someone claiming to be "customer support."',
    },
    {
      lead: "Diversify your thinking, not just your coins.",
      rest: "Don't put your entire financial plan into one asset.",
    },
    {
      lead: "Talk to a licensed financial advisor.",
      rest: "For significant decisions — we teach concepts, not personalized advice.",
    },
  ],
};

export const trustStrip = {
  label: "Our promise to you",
  promises: [
    'We will never tell you a coin is "guaranteed" to go up.',
    "We will never accept payment to favor one exchange or coin.",
    "We will always show risks alongside benefits, every time.",
    "We cite official sources and show when each article was published and updated.",
  ],
  disclaimer:
    "This website provides general educational information about cryptocurrency and is not financial, investment, tax, or legal advice. Cryptocurrency investments are highly volatile and carry a real risk of partial or total loss. Always do your own research and consult a licensed financial advisor before making any investment decision.",
};

export const footer = {
  brand: "CryptoLearn",
  tagline: "Making Crypto Easy to Understand.",
  columns: [
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "Articles", href: "/articles" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Getting Started", href: "/getting-started" },
        { label: "Safety", href: "/safety" },
        { label: "Coins", href: "/coins" },
        { label: "Exchanges", href: "/exchanges" },
        { label: "Taxes", href: "/taxes" },
        { label: "Glossary", href: "/glossary" },
      ],
    },
    {
      title: "Legal",
      links: [
        {
          label: "Privacy",
          href: "/privacy",
        },
        {
          label: "Terms",
          href: "/terms",
        },
        {
          label: "Disclosures",
          href: "/disclosures",
        },
      ],
    },
  ],
  legal:
    "© " +
    new Date().getFullYear() +
    " cryptolearner.us Educational content only — not financial advice.",
};
export const prosCons = {
  heading: "Pros vs. Cons, Side by Side",

  subtitle:
    "Crypto has real advantages, but it also comes with real risks. Looking at both together helps you make informed decisions.",

  rows: [
    {
      pro: "You control your own funds",
      con: "No bank-style protection if something goes wrong",
    },
    {
      pro: "Works across borders",
      con: "Prices can swing wildly and unpredictably",
    },
    {
      pro: "Open to anyone, anytime",
      con: "Mistakes and scams are usually permanent",
    },
    {
      pro: "Transparent public record",
      con: "Regulations are still evolving",
    },
    {
      pro: "Interesting blockchain technology",
      con: "Hype can disconnect price from real value",
    },
    {
      pro: "Fast peer-to-peer transfers",
      con: "Requires learning wallet security",
    },
  ],

  note: "Crypto is neither completely good nor completely bad. Understanding both the opportunities and the risks will help you make better decisions.",
};
