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
  "game-changing",
  "cutting-edge",
  "next-generation",
  "transformative",
  "world-class",
  "seamless",
  "powerful",
  "ultimate",
  "unlock",
  "supercharge",
  "forever",
  "transforming",
];

const ABSOLUTE_CLAIMS = [
  "guaranteed",
  "proven",
  "best",
  "number one",
  "#1",
  "industry-leading",
  "leading",
];

const WEAK_LOGIC_PHRASES = [
  "automatically improves",
  "guarantees success",
  "eliminates all",
  "perfect solution",
  "works for everyone",
  "hiring success",
  "without effort",
];

const VAGUE_WORDS = [
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

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasAudienceSignal(text: string): boolean {
  return countMatches(text, AUDIENCE_SIGNALS).length > 0;
}

function hasOutcomeSignal(text: string): boolean {
  return countMatches(text, OUTCOME_SIGNALS).length > 0;
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
    explanations.push("Swapping superlatives for specific outcomes makes the message easier to trust.");
  }

  if (hasNumbers) {
    tips.push("Add a reliable source or remove the exact number.");
    explanations.push("Unsupported numbers can sound impressive but create credibility risk.");
  }

  if (lacksAudience) {
    tips.push("Mention who this is for.");
    explanations.push("Naming the audience helps readers see themselves in the message.");
  }

  if (lacksOutcome) {
    tips.push("Make the outcome more specific.");
    explanations.push("A clear result is more memorable than abstract product language.");
  }

  const isVeryWeak =
    hypeHits.length >= 2 ||
    (lacksAudience && lacksOutcome) ||
    countWords(text) < 12;

  const rewrite = isVeryWeak
    ? DEFAULT_REWRITE
    : text
        .replace(/\b(revolutionary|game-changing|cutting-edge|transformative)\b/gi, "")
        .replace(/\b(guaranteed|proven|best|industry-leading)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim() || DEFAULT_REWRITE;

  return {
    rewrite,
    explanation:
      explanations.length > 0
        ? explanations.join(" ")
        : "Tightening language around audience, outcome, and evidence usually improves trust.",
    tip:
      tips.length > 0
        ? tips.join(" ")
        : "Lead with who you help, what changes for them, and one believable proof point.",
  };
}

function computeSubScores(
  text: string,
  hypeHits: string[],
  absoluteHits: string[],
  weakLogicHits: string[],
  vagueHits: string[],
  hasNumbers: boolean,
  lacksAudience: boolean,
  lacksOutcome: boolean,
  wordCount: number,
  sentenceCount: number,
): CriterionScores {
  let specificity = 100 - vagueHits.length * 12;
  if (!hasOutcomeSignal(text)) specificity -= 20;
  if (wordCount < 15) specificity -= 15;

  let verifiability = 100;
  if (hasNumbers) verifiability -= 35;
  verifiability -= absoluteHits.length * 18;

  let clarity = 100;
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
  if (avgWordsPerSentence > 22) clarity -= 20;
  if (vagueHits.length >= 3) clarity -= 25;

  let audienceAwareness = lacksAudience ? 45 : 85;
  if (hasAudienceSignal(text) && hasOutcomeSignal(text)) audienceAwareness = 92;

  let hypeControl = 100 - hypeHits.length * 14;

  let logicalSoundness = 100 - weakLogicHits.length * 18;
  if (absoluteHits.some((w) => ["guaranteed", "proven"].includes(w))) {
    logicalSoundness -= 15;
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
      rewriteExplanation: "Start with a draft, then refine for clarity and proof.",
      copywritingTip: "Even a rough draft is enough to begin.",
      warnings: ["No copy provided."],
    };
  }

  const hypeHits = countMatches(trimmed, HYPE_WORDS);
  const absoluteHits = countMatches(trimmed, ABSOLUTE_CLAIMS);
  const weakLogicHits = countMatches(trimmed, WEAK_LOGIC_PHRASES);
  const vagueHits = countMatches(trimmed, VAGUE_WORDS);
  const hasNumbers = hasNumbersOrPercentages(trimmed);
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
        suggestion: "Replace with a concrete benefit your audience can picture.",
      });
    });
  }

  if (hasNumbers) {
    score -= 15;
    issues.push({
      type: "Unverified claim",
      severity: "high",
      message: "The copy includes numbers or percentages that may need a source.",
      suggestion: "Cite a study, customer result, or remove the statistic.",
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
        suggestion: "Describe realistic outcomes instead of universal guarantees.",
      });
    });
  }

  if (lacksAudience) {
    score -= 15;
    issues.push({
      type: "Audience gap",
      severity: "medium",
      message: "No clear audience or user type is mentioned.",
      suggestion: "Name who benefits, such as hiring teams or growth marketers.",
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
    trimmed,
    hypeHits,
    absoluteHits,
    weakLogicHits,
    vagueHits,
    hasNumbers,
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
