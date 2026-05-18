export type IssueSeverity = "low" | "medium" | "high";

export interface TrustIssue {
  type: string;
  severity: IssueSeverity;
  message: string;
  suggestion: string;
}

export interface CriterionScores {
  specificity: number;
  verifiability: number;
  clarity: number;
  audienceAwareness: number;
  hypeControl: number;
  logicalSoundness: number;
}

export interface AnalysisResult {
  overallScore: number;
  riskLabel: string;
  interpretation: string;
  scores: CriterionScores;
  issues: TrustIssue[];
  suggestedRewrite: string;
  rewriteExplanation: string;
  copywritingTip: string;
  warnings: string[];
}

const HYPE_WORDS = [
  "revolutionary",
  "breakthrough",
  "game-changing",
  "next-level",
  "cutting-edge",
  "world-class",
  "premium",
  "exclusive",
  "powerful",
  "ultimate",
  "all-in-one",
  "transformative",
  "innovative",
  "industry-leading",
  "advanced",
  "state-of-the-art",
  "effortless",
  "smarter",
  "best-in-class",
  "enterprise-grade",
  "ai-powered",
  "hyper-personalized",
  "unmatched",
  "phenomenal",
  "spectacular",
  "supercharged",
  "turbocharged",
  "groundbreaking",
  "future-ready",
  "high-impact",
  "elite",
  "unbeatable",
  "unstoppable",
  "massive",
  "insane",
  "explosive",
  "viral",
  "magnetic",
  "irresistible",
  "must-have",
  "jaw-dropping",
  "mind-blowing",
  "breathtaking",
  "epic",
  "legendary",
  "iconic",
  "remarkable",
  "extraordinary",
  "outstanding",
  "exceptional",
  "dominant",
  "killer",
  "secret weapon",
  "growth engine",
  "revenue machine",
  "conversion machine",
  "magic",
  "instant upgrade",
  "massive leap",
  "new era",
];

const ABSOLUTE_CLAIMS = [
  "100% guaranteed",
  "guaranteed success",
  "always works",
  "never fails",
  "zero risk",
  "risk-free",
  "error-free",
  "instant results",
  "works instantly",
  "perfect solution",
  "the only solution",
  "the best solution",
  "best for every business",
  "built for everyone",
  "fits any team",
  "most complete",
  "easiest to use",
  "fastest platform",
  "no. 1",
  "the best",
  "fully automated",
  "no effort required",
  "unlimited growth",
  "no limits",
  "complete control",
  "total visibility",
  "never miss a lead",
  "always accurate",
  "flawless execution",
  "guaranteed roi",
  "double your revenue",
  "triple your conversions",
  "eliminate churn",
  "remove all friction",
  "solve every problem",
  "works for any industry",
  "one-size-fits-all",
  "permanent results",
  "lifetime access",
  "fail-proof",
  "foolproof",
  "no learning curve",
  "set it and forget it",
  "every customer will love it",
  "all your problems solved",
  "the final tool you need",
  "the last platform you will buy",
  "never lose data",
  "never miss an opportunity",
  "always-on growth",
  "maximum revenue",
  "complete automation",
  "guaranteed conversions",
  "guaranteed performance",
  "guaranteed savings",
  "no downside",
  "nothing to lose",
  "works every time",
  "total protection",
  "absolute certainty",
];

const WEAK_LOGIC_PHRASES = [
  "clearly",
  "obviously",
  "of course",
  "that is why",
  "therefore it works",
  "everyone knows",
  "everyone is switching",
  "trusted by many",
  "because speed matters",
  "because growth matters",
  "if you want to win",
  "if you care about growth",
  "the smart choice",
  "the logical choice",
  "built for winners",
  "designed to make you succeed",
  "why settle for less",
  "it just makes sense",
  "you cannot afford to wait",
  "your competitors already use it",
  "all you need is",
  "just use",
  "simply switch",
  "without thinking twice",
  "there is no reason not to",
  "growth starts here",
  "success starts here",
  "the future is obvious",
  "join the movement",
  "do not get left behind",
  "everyone is talking about it",
  "businesses love it",
  "marketers agree",
  "teams are moving fast",
  "the old way is broken",
  "this changes everything",
  "you deserve better",
  "serious teams choose this",
  "modern companies need this",
  "the numbers speak for themselves",
  "it is time to upgrade",
  "now is the moment",
  "there has never been a better time",
  "you already know the answer",
  "the choice is simple",
  "no-brainer",
  "the proof is everywhere",
  "the market is moving",
  "leaders choose this",
  "smart teams do this",
  "successful companies rely on it",
  "because your team deserves clarity",
  "because manual work is expensive",
  "because spreadsheets are broken",
  "because customers expect better",
  "because every second counts",
  "why keep doing it manually",
  "why risk falling behind",
  "stop wasting time",
  "start winning today",
];

const VAGUE_WORDS = [
  "easy",
  "fast",
  "effective",
  "efficient",
  "optimal",
  "maximum",
  "flexible",
  "modern",
  "smart",
  "reliable",
  "trusted",
  "professional",
  "practical",
  "complete",
  "intuitive",
  "seamless",
  "simple",
  "robust",
  "scalable",
  "secure",
  "better",
  "improved",
  "optimized",
  "advanced",
  "streamlined",
  "tailored",
  "frictionless",
  "high-quality",
  "dynamic",
  "agile",
  "powerful",
  "strategic",
  "actionable",
  "meaningful",
  "valuable",
  "personalized",
  "enhanced",
  "unified",
  "connected",
  "automated",
  "relevant",
  "engaging",
  "impactful",
  "comprehensive",
  "centralized",
  "simplified",
  "beautiful",
  "clean",
  "smartest",
  "faster",
  "stronger",
  "safer",
  "simpler",
  "smarter workflow",
  "better experience",
  "more visibility",
  "less complexity",
  "real-time",
  "data-driven",
  "business-ready",
  "solution",
  "platform",
  "workflow",
  "experience",
  "innovation",
  "ecosystem",
  "synergy",
  "leverage",
  "optimize",
  "streamline",
];

const AUDIENCE_SIGNALS = [
  "for startups",
  "for small businesses",
  "for enterprises",
  "for founders",
  "for marketers",
  "for sales teams",
  "for support teams",
  "for hr teams",
  "for finance teams",
  "for agencies",
  "for creators",
  "for developers",
  "for product managers",
  "for online businesses",
  "for ecommerce brands",
  "for remote teams",
  "for modern teams",
  "designed for modern teams",
  "built to scale with your business",
  "for growing companies",
  "built for startups",
  "built for growing teams",
  "for busy founders",
  "for high-performing teams",
  "for revenue teams",
  "for modern marketers",
  "for saas companies",
  "for digital teams",
  "made for teams like yours",
  "for ambitious teams",
  "for lean teams",
  "for operations teams",
  "for customer success teams",
  "for b2b teams",
  "for b2c brands",
  "for product-led teams",
  "for data-driven teams",
  "for non-technical teams",
  "for enterprise buyers",
  "for solo operators",
  "for small teams",
  "for mid-market companies",
  "for global teams",
  "for distributed teams",
  "for fast-moving teams",
  "for growth teams",
  "for demand generation teams",
  "for lifecycle marketers",
  "for performance marketers",
  "for content teams",
  "for revops teams",
  "for sales leaders",
  "for marketing leaders",
  "for customer-facing teams",
  "for it teams",
  "for compliance teams",
  "for security-conscious teams",
  "for service businesses",
  "for coaches and consultants",
  "for digital product teams",
  "for teams that move fast",
  "team",
  "teams",
  "marketer",
  "marketers",
  "founder",
  "founders",
  "recruiter",
  "recruiters",
  "hiring",
  "hr",
  "small business",
  "enterprise",
  "startup",
  "customer",
  "customers",
  "user",
  "users",
  "buyer",
  "buyers",
  "manager",
  "managers",
];

const OUTCOME_SIGNALS = [
  "increase sales",
  "boost conversions",
  "save time",
  "cut costs",
  "reduce manual work",
  "speed up workflows",
  "automate processes",
  "increase productivity",
  "drive growth",
  "grow revenue",
  "reduce churn",
  "improve retention",
  "improve customer experience",
  "get faster results",
  "make better decisions",
  "generate more accurate reports",
  "improve collaboration",
  "stay focused",
  "scale faster",
  "save hours every week",
  "lower acquisition cost",
  "shorten sales cycle",
  "unlock growth",
  "drive engagement",
  "ship faster",
  "close more deals",
  "increase pipeline",
  "reduce response time",
  "improve onboarding",
  "turn insights into action",
  "capture more leads",
  "increase activation",
  "boost adoption",
  "reduce support tickets",
  "improve team alignment",
  "accelerate delivery",
  "standardize processes",
  "increase visibility",
  "reduce operational overhead",
  "improve roi",
  "increase efficiency",
  "reduce errors",
  "improve accuracy",
  "increase win rate",
  "improve lead quality",
  "recover abandoned carts",
  "increase average order value",
  "reduce customer acquisition cost",
  "improve time to value",
  "increase customer lifetime value",
  "simplify reporting",
  "speed up decision-making",
  "centralize customer data",
  "reduce tool sprawl",
  "improve forecast accuracy",
  "increase reply rates",
  "book more meetings",
  "convert more visitors",
  "launch campaigns faster",
  "improve operational clarity",
  "faster",
  "save",
  "saving",
  "reduce",
  "increase",
  "improve",
  "cut",
  "hours",
  "minutes",
  "days",
  "cost",
  "revenue",
  "conversion",
  "hire",
  "screen",
  "review",
  "onboard",
  "launch",
  "grow",
];

const EVIDENCE_SIGNALS = [
  "proven",
  "data-backed",
  "research-backed",
  "case study",
  "survey results",
  "industry report",
  "benchmark",
  "trial results",
  "customer data",
  "actual results",
  "real results",
  "used by",
  "trusted by",
  "used by thousands of teams",
  "customer testimonials",
  "user reviews",
  "five-star rating",
  "certified",
  "security audit",
  "sla",
  "soc 2",
  "iso 27001",
  "gdpr-ready",
  "customer proof",
  "according to",
  "independent review",
  "verified results",
  "third-party validation",
  "backed by experts",
  "measured impact",
  "peer-reviewed",
  "analyst-recognized",
  "award-winning",
  "g2 reviews",
  "capterra reviews",
  "case-study results",
  "before-and-after data",
  "published report",
  "documented results",
  "compliance-ready",
  "security-certified",
  "audited controls",
  "customer stories",
  "logo wall",
  "press mentions",
  "media coverage",
  "expert recommended",
  "clinically tested",
  "field-tested",
  "lab-tested",
  "independently tested",
  "statistically significant",
  "sample size",
  "methodology",
  "source data",
  "public roadmap",
  "uptime history",
  "status page",
  "privacy policy",
  "money-back guarantee",
  "free trial",
];

const QUALIFIER_SIGNALS = [
  "may help",
  "can help",
  "could help",
  "up to",
  "as much as",
  "on average",
  "typically",
  "generally",
  "depending on your needs",
  "depending on usage",
  "under certain conditions",
  "for some teams",
  "in certain cases",
  "results may vary",
  "not guaranteed",
  "estimated",
  "approximately",
  "around",
  "designed to help",
  "intended to",
  "where applicable",
  "subject to conditions",
  "based on available data",
  "when configured properly",
  "with eligible plans",
  "in supported workflows",
  "for qualified users",
  "where supported",
  "in many cases",
  "often",
  "can reduce",
  "can increase",
  "may improve",
  "potentially",
  "up to x percent",
  "based on customer-reported data",
  "individual results vary",
  "requires setup",
  "available on select plans",
  "when used consistently",
  "based on internal analysis",
  "based on a limited sample",
  "compared with previous period",
  "during beta",
  "in eligible markets",
  "for participating users",
  "subject to approval",
  "subject to availability",
  "terms apply",
  "conditions apply",
  "not available in all regions",
  "requires integration",
  "requires admin access",
  "requires compatible tools",
  "early results suggest",
  "preliminary data shows",
  "directionally",
  "indicative",
  "not independently verified",
  "based on historical performance",
];

const COMPARISON_SIGNALS = [
  "faster than",
  "cheaper than",
  "easier than",
  "better than",
  "alternative to",
  "replacement for",
  "compared with",
  "versus",
  "vs",
  "enterprise-grade alternative",
  "equivalent to",
  "superior to",
  "outperforms",
  "a better choice",
  "more complete than",
  "more flexible than",
  "without extra fees like",
  "not just another",
  "different from other tools",
  "competitor",
  "more reliable than",
  "built differently",
  "unlike other tools",
  "compared to legacy software",
  "instead of spreadsheets",
  "better value than",
  "more scalable than",
  "simpler than",
  "fewer clicks than",
  "less manual work than",
  "more affordable than",
  "more accurate than",
  "more secure than",
  "faster setup than",
  "less expensive than",
  "higher roi than",
  "less complex than",
  "more customizable than",
  "more intuitive than",
  "stronger than legacy systems",
  "faster time to value",
  "lower total cost of ownership",
  "fewer tools required",
  "less training required",
  "more integrations than",
  "better support than",
  "higher rated than",
  "preferred over",
  "switch from",
  "migrate from",
  "replace your crm",
  "replace your spreadsheets",
  "beat the competition",
  "ahead of the competition",
  "the modern alternative",
  "the simpler alternative",
  "the affordable alternative",
  "the scalable alternative",
  "the smarter alternative",
  "built for today",
];

const DEFAULT_REWRITE =
  "Help hiring teams screen candidates faster without spending hours on manual resume review.";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function countMatches(text: string, patterns: string[]): string[] {
  const lower = text.toLowerCase();
  return patterns.filter((pattern) => lower.includes(pattern));
}

function hasNumbersOrPercentages(text: string): boolean {
  return /\d+%|\d+\s*percent|\b\d{2,}\b/.test(text);
}

function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function cleanCopy(text: string): string {
  return text
    .replace(
      /\b(revolutionary|game-changing|cutting-edge|transformative|next-generation|world-class)\b/gi,
      "",
    )
    .replace(/\b(guaranteed|proven|best|industry-leading|leading)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function containsPhrase(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

function ensureSentence(text: string): string {
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasAudienceSignal(text: string): boolean {
  return countMatches(text, AUDIENCE_SIGNALS).length > 0;
}

function hasOutcomeSignal(text: string): boolean {
  return countMatches(text, OUTCOME_SIGNALS).length > 0;
}

function hasEvidenceSignal(text: string): boolean {
  return countMatches(text, EVIDENCE_SIGNALS).length > 0;
}

function hasQualifierSignal(text: string): boolean {
  return countMatches(text, QUALIFIER_SIGNALS).length > 0;
}

function hasComparisonSignal(text: string): boolean {
  return countMatches(text, COMPARISON_SIGNALS).length > 0;
}

function findSignalIndex(words: string[], signal: string): number {
  const signalWords = signal.split(" ");
  for (let i = 0; i <= words.length - signalWords.length; i += 1) {
    const candidate = words
      .slice(i, i + signalWords.length)
      .join(" ")
      .toLowerCase();
    if (candidate === signal) return i;
  }
  return -1;
}

function extractAudienceSnippet(text: string): string | null {
  const words = text
    .replace(/[^\w\s%]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  for (const signal of AUDIENCE_SIGNALS) {
    const index = findSignalIndex(words, signal);
    if (index >= 0) {
      const signalWords = signal.split(" ");
      const start = Math.max(0, index - 1);
      const end = Math.min(words.length, index + signalWords.length + 2);
      const phrase = words.slice(start, end).join(" ").trim();
      if (!phrase) return null;
      return /^for\b/i.test(phrase) ? phrase : `For ${phrase}`;
    }
  }

  return null;
}

function extractOutcomeSnippet(text: string): string | null {
  const words = text
    .replace(/[^\w\s%]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  for (const signal of OUTCOME_SIGNALS) {
    const index = findSignalIndex(words, signal);
    if (index >= 0) {
      const end = Math.min(words.length, index + 8);
      const phrase = words.slice(index, end).join(" ").trim();
      return phrase.length > 0 ? phrase : null;
    }
  }

  return null;
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getRiskLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Needs polish";
  if (score >= 40) return "Risky";
  return "Low trust";
}

function getInterpretation(score: number): string {
  if (score >= 80) {
    return "This copy reads fairly grounded. Still verify any factual claims before publishing.";
  }
  if (score >= 60) {
    return "The message is understandable, but a few phrases weaken credibility or specificity.";
  }
  if (score >= 40) {
    return "The copy sounds persuasive, but several signals suggest hype or weak support.";
  }
  return "This copy leans heavily on buzzwords and broad promises. A human rewrite would help a lot.";
}

function buildRewrite(
  text: string,
  hypeHits: string[],
  hasNumbers: boolean,
  lacksAudience: boolean,
  lacksOutcome: boolean,
): { rewrite: string; explanation: string; tip: string } {
  const tips: string[] = [];
  const explanations: string[] = [];

  if (hypeHits.length > 0) {
    tips.push("Replace hype words with concrete benefits.");
    explanations.push(
      "Swapping superlatives for specific outcomes makes the message easier to trust.",
    );
  }

  if (hasNumbers) {
    tips.push("Add a reliable source or remove the exact number.");
    explanations.push(
      "Unsupported numbers can sound impressive but create credibility risk.",
    );
  }

  if (lacksAudience) {
    tips.push("Mention who this is for.");
    explanations.push(
      "Naming the audience helps readers see themselves in the message.",
    );
  }

  if (lacksOutcome) {
    tips.push("Make the outcome more specific.");
    explanations.push(
      "A clear result is more memorable than abstract product language.",
    );
  }

  const isVeryWeak = hypeHits.length >= 2 || countWords(text) < 12;
  const sentences = splitSentences(text);
  const scoredSentences = sentences.map((sentence, index) => {
    const audienceScore = countMatches(sentence, AUDIENCE_SIGNALS).length * 2;
    const outcomeScore = countMatches(sentence, OUTCOME_SIGNALS).length * 2;
    const numberScore = hasNumbersOrPercentages(sentence) ? 1 : 0;
    const hypePenalty = countMatches(sentence, HYPE_WORDS).length * 2;
    const absolutePenalty = countMatches(sentence, ABSOLUTE_CLAIMS).length * 2;
    const score =
      audienceScore +
      outcomeScore +
      numberScore -
      hypePenalty -
      absolutePenalty;

    return { sentence, score, index };
  });

  const topSentences = scoredSentences
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);

  const bestSentence = topSentences.join(". ");
  const cleanedBest = bestSentence ? cleanCopy(bestSentence) : "";
  const cleanedFull = cleanCopy(text);
  const baseSentence = countWords(cleanedBest) >= 8 ? cleanedBest : cleanedFull;

  const audienceSnippet = extractAudienceSnippet(bestSentence || text);
  const outcomeSnippet = extractOutcomeSnippet(bestSentence || text);

  let primarySentence = baseSentence;
  if (audienceSnippet && !containsPhrase(primarySentence, audienceSnippet)) {
    primarySentence =
      `${capitalize(audienceSnippet)}, ${primarySentence}`.trim();
  }

  primarySentence = ensureSentence(cleanCopy(primarySentence));

  const rewriteParts: string[] = [];
  if (primarySentence) {
    rewriteParts.push(primarySentence);
  }

  if (outcomeSnippet && !containsPhrase(primarySentence, outcomeSnippet)) {
    rewriteParts.push(ensureSentence(`This helps ${outcomeSnippet}`));
  }

  const rewriteCandidate = cleanCopy(rewriteParts.join(" "));
  const rewrite = isVeryWeak
    ? DEFAULT_REWRITE
    : rewriteCandidate || DEFAULT_REWRITE;

  return {
    rewrite,
    explanation:
      explanations.length > 0
        ? explanations.join(" ")
        : "Built the rewrite from the clearest sentence and highlighted the audience and outcome when possible.",
    tip:
      tips.length > 0
        ? tips.join(" ")
        : "Lead with who you help, what changes for them, and one believable proof point.",
  };
}

function computeSubScores(
  hypeHits: string[],
  absoluteHits: string[],
  weakLogicHits: string[],
  vagueHits: string[],
  hasNumbers: boolean,
  hasEvidence: boolean,
  hasQualifier: boolean,
  hasComparison: boolean,
  lacksAudience: boolean,
  lacksOutcome: boolean,
  wordCount: number,
  sentenceCount: number,
): CriterionScores {
  let specificity = 100 - vagueHits.length * 12;
  if (lacksOutcome) specificity -= 20;
  if (wordCount < 15) specificity -= 15;

  let verifiability = 100;
  if (hasNumbers) {
    verifiability -= hasEvidence ? 18 : 35;
  }
  verifiability -= absoluteHits.length * 18;
  if (hasQualifier) verifiability += 4;

  let clarity = 100;
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
  if (avgWordsPerSentence > 22) clarity -= 20;
  if (vagueHits.length >= 3) clarity -= 25;

  let audienceAwareness = lacksAudience ? 45 : 85;
  if (!lacksAudience && !lacksOutcome) audienceAwareness = 92;

  let hypeControl = 100 - hypeHits.length * 14;

  let logicalSoundness = 100 - weakLogicHits.length * 18;
  if (absoluteHits.some((w) => ["guaranteed", "proven"].includes(w))) {
    logicalSoundness -= 15;
  }
  if (hasComparison) {
    logicalSoundness -= 6;
  }

  return {
    specificity: clamp(specificity),
    verifiability: clamp(verifiability),
    clarity: clamp(clarity),
    audienceAwareness: clamp(audienceAwareness),
    hypeControl: clamp(hypeControl),
    logicalSoundness: clamp(logicalSoundness),
  };
}

export function analyzeMarketingCopy(text: string): AnalysisResult {
  const trimmed = text.trim();
  const wordCount = countWords(trimmed);
  const sentenceCount = countSentences(trimmed);
  const warnings: string[] = [];
  const issues: TrustIssue[] = [];

  if (!trimmed) {
    return {
      overallScore: 0,
      riskLabel: "Low trust",
      interpretation: "Paste some marketing copy to get started.",
      scores: {
        specificity: 0,
        verifiability: 0,
        clarity: 0,
        audienceAwareness: 0,
        hypeControl: 0,
        logicalSoundness: 0,
      },
      issues: [],
      suggestedRewrite: DEFAULT_REWRITE,
      rewriteExplanation:
        "Start with a draft, then refine for clarity and proof.",
      copywritingTip: "Even a rough draft is enough to begin.",
      warnings: ["No copy provided."],
    };
  }

  const hypeHits = countMatches(trimmed, HYPE_WORDS);
  const absoluteHits = countMatches(trimmed, ABSOLUTE_CLAIMS);
  const weakLogicHits = countMatches(trimmed, WEAK_LOGIC_PHRASES);
  const vagueHits = countMatches(trimmed, VAGUE_WORDS);
  const hasNumbers = hasNumbersOrPercentages(trimmed);
  const hasEvidence = hasEvidenceSignal(trimmed);
  const hasQualifier = hasQualifierSignal(trimmed);
  const hasComparison = hasComparisonSignal(trimmed);
  const lacksAudience = !hasAudienceSignal(trimmed);
  const lacksOutcome = !hasOutcomeSignal(trimmed);

  let score = 100;

  const hypePenalty = Math.min(hypeHits.length * 5, 25);
  if (hypePenalty > 0) {
    score -= hypePenalty;
    hypeHits.forEach((word) => {
      issues.push({
        type: "Hype language",
        severity: "medium",
        message: `Buzzword detected: "${word}"`,
        suggestion:
          "Replace with a concrete benefit your audience can picture.",
      });
    });
  }

  if (hasNumbers) {
    const numberPenalty = hasEvidence ? 8 : 15;
    score -= numberPenalty;
    issues.push({
      type: "Unverified claim",
      severity: hasEvidence ? "medium" : "high",
      message: hasEvidence
        ? "Numbers are mentioned with evidence signals but no clear source is provided."
        : "The copy includes numbers or percentages that may need a source.",
      suggestion: "Cite a study, customer result, or remove the statistic.",
    });
  }

  if (hasComparison) {
    score -= 8;
    issues.push({
      type: "Comparison claim",
      severity: "medium",
      message:
        "Comparative language can require proof or context to be credible.",
      suggestion: "Explain the basis for the comparison or remove the claim.",
    });
  }

  const absolutePenalty = Math.min(absoluteHits.length * 15, 30);
  if (absolutePenalty > 0) {
    score -= absolutePenalty;
    absoluteHits.forEach((word) => {
      issues.push({
        type: "Absolute claim",
        severity: "high",
        message: `Absolute or superlative claim: "${word}"`,
        suggestion: "Soften the claim or support it with evidence.",
      });
    });
  }

  const logicPenalty = Math.min(weakLogicHits.length * 15, 30);
  if (logicPenalty > 0) {
    score -= logicPenalty;
    weakLogicHits.forEach((phrase) => {
      issues.push({
        type: "Weak logic",
        severity: "high",
        message: `Overpromising phrase: "${phrase}"`,
        suggestion:
          "Describe realistic outcomes instead of universal guarantees.",
      });
    });
  }

  if (lacksAudience) {
    score -= 15;
    issues.push({
      type: "Audience gap",
      severity: "medium",
      message: "No clear audience or user type is mentioned.",
      suggestion:
        "Name who benefits, such as hiring teams or growth marketers.",
    });
  }

  if (lacksOutcome) {
    score -= 15;
    issues.push({
      type: "Vague outcome",
      severity: "medium",
      message: "The copy does not describe a concrete outcome.",
      suggestion: "State what changes after using the product or service.",
    });
  }

  if (wordCount < 12) {
    warnings.push("Text is short — analysis may be less reliable.");
    score = Math.min(score, 60);
    issues.push({
      type: "Short input",
      severity: "low",
      message: "The copy is very short, so signals are limited.",
      suggestion: "Add one sentence about audience and one about outcome.",
    });
  }

  if (wordCount > 120 || sentenceCount > 8) {
    score -= 10;
    issues.push({
      type: "Length",
      severity: "low",
      message: "The copy is long or unfocused for a quick scan.",
      suggestion: "Lead with one audience, one problem, and one outcome.",
    });
  }

  vagueHits.slice(0, 3).forEach((word) => {
    issues.push({
      type: "Vague wording",
      severity: "low",
      message: `Abstract term: "${word}"`,
      suggestion: "Explain what this means in plain language for your reader.",
    });
  });

  score = clamp(score);
  const scores = computeSubScores(
    hypeHits,
    absoluteHits,
    weakLogicHits,
    vagueHits,
    hasNumbers,
    hasEvidence,
    hasQualifier,
    hasComparison,
    lacksAudience,
    lacksOutcome,
    wordCount,
    sentenceCount,
  );

  const { rewrite, explanation, tip } = buildRewrite(
    trimmed,
    hypeHits,
    hasNumbers,
    lacksAudience,
    lacksOutcome,
  );

  const riskLabel = getRiskLabel(score);

  return {
    overallScore: score,
    riskLabel,
    interpretation: getInterpretation(score),
    scores,
    issues,
    suggestedRewrite: rewrite,
    rewriteExplanation: explanation,
    copywritingTip: tip,
    warnings,
  };
}

export const SAMPLE_COPY =
  "Revolutionary AI-powered platform transforming recruitment forever with cutting-edge automation and guaranteed hiring success.";

export const CRITERIA_META = [
  {
    key: "specificity" as const,
    label: "Specificity",
    question: "Is the copy concrete or vague?",
    description:
      "Strong copy names what happens, for whom, and in what situation — not just product category words.",
  },
  {
    key: "verifiability" as const,
    label: "Verifiability",
    question: "Can the claim be checked or supported?",
    description:
      "Stats, superlatives, and guarantees raise the bar for proof. Without evidence, they can erode trust.",
  },
  {
    key: "clarity" as const,
    label: "Clarity",
    question: "Can a normal human understand the message quickly?",
    description:
      "Short sentences and plain language help readers grasp value in seconds.",
  },
  {
    key: "audienceAwareness" as const,
    label: "Audience Awareness",
    question: "Does the copy mention a real audience or pain point?",
    description:
      "Readers trust copy more when they can see themselves and their problem in it.",
  },
  {
    key: "hypeControl" as const,
    label: "Hype Control",
    question: "Does the copy avoid exaggerated sales language?",
    description:
      "Words like revolutionary or seamless can sound impressive but often replace real detail.",
  },
  {
    key: "logicalSoundness" as const,
    label: "Logical Soundness",
    question: "Does the claim make sense without overpromising?",
    description:
      "Broad guarantees and universal claims are hard to defend and easy for readers to doubt.",
  },
];
