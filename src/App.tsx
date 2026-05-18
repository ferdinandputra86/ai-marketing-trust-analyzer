import { useMemo, useState, type ComponentType } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  PenLine,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeMarketingCopy,
  CRITERIA_META,
  SAMPLE_COPY,
  type AnalysisResult,
  type CriterionScores,
} from "@/lib/analyzer";
import { cn } from "@/lib/utils";

const CRITERION_ICONS = {
  specificity: Target,
  verifiability: SearchCheck,
  clarity: FileText,
  audienceAwareness: ClipboardCheck,
  hypeControl: ShieldCheck,
  logicalSoundness: Gauge,
} as const;

function riskBadgeVariant(
  label: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (label === "Strong") return "default";
  if (label === "Needs polish") return "secondary";
  if (label === "Risky") return "outline";
  return "destructive";
}

function severityVariant(severity: "low" | "medium" | "high") {
  if (severity === "high") return "destructive" as const;
  if (severity === "medium") return "outline" as const;
  return "secondary" as const;
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  description,
  icon: Icon,
}: {
  label: string;
  score: number;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="gap-4 border-border/80 py-5 shadow-none">
      <CardHeader className="gap-3 px-5 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
              <Icon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <CardTitle className="text-base">{label}</CardTitle>
              <CardDescription className="leading-relaxed">
                {description}
              </CardDescription>
            </div>
          </div>
          <span className="text-foreground text-lg font-semibold tabular-nums">
            {score}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-0">
        <Progress value={score} className="h-2" />
      </CardContent>
    </Card>
  );
}

function EmptyResultState() {
  return (
    <div className="border-border/80 bg-muted/30 text-muted-foreground flex min-h-60 flex-col items-center justify-center gap-3 rounded-md border border-dashed p-8 text-center">
      <span className="bg-background flex size-12 items-center justify-center rounded-md border">
        <ShieldCheck className="size-6" />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-foreground font-medium">
          Run an audit to see the trust profile.
        </p>
        <p className="text-sm leading-relaxed">
          The result will summarize risk, evidence gaps, rewrite guidance, and
          the six review criteria.
        </p>
      </div>
    </div>
  );
}

function InputPanel({
  copy,
  hasAnalyzed,
  onCopyChange,
  onAnalyze,
  onSample,
  onClear,
}: {
  copy: string;
  hasAnalyzed: boolean;
  onCopyChange: (value: string) => void;
  onAnalyze: () => void;
  onSample: () => void;
  onClear: () => void;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle>Copy under review</CardTitle>
            <CardDescription>
              Paste a headline, ad, landing page blurb, or email draft.
            </CardDescription>
          </div>
          <Badge variant="outline" className="hidden shrink-0 md:inline-flex">
            Heuristic
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          value={copy}
          onChange={(event) => onCopyChange(event.target.value)}
          placeholder="Paste AI-generated or human-written marketing copy here..."
          className="min-h-64 resize-y bg-background text-base leading-relaxed md:min-h-72"
          aria-label="Marketing copy input"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={onAnalyze}>
            <SearchCheck data-icon="inline-start" />
            Analyze copy
          </Button>
          <Button variant="outline" onClick={onSample}>
            <FileText data-icon="inline-start" />
            Try sample
          </Button>
          <Button variant="ghost" onClick={onClear}>
            <RefreshCw data-icon="inline-start" />
            Clear
          </Button>
        </div>
        {hasAnalyzed && !copy.trim() && (
          <Alert>
            <AlertCircle />
            <AlertTitle>Add copy first</AlertTitle>
            <AlertDescription>
              Paste a sentence or two so the analyzer has enough context to
              review.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function ScorePanel({ result }: { result: AnalysisResult | null }) {
  return (
    <Card
      className={cn(
        "shadow-none transition-opacity",
        result ? "opacity-100" : "opacity-95",
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="text-primary size-5" />
              Trust summary
            </CardTitle>
            <CardDescription>
              A product-style readout for credibility signals.
            </CardDescription>
          </div>
          {result && (
            <Badge variant={riskBadgeVariant(result.riskLabel)}>
              {result.riskLabel}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {!result ? (
          <EmptyResultState />
        ) : (
          <>
            <div className="flex flex-col gap-4 rounded-md border bg-secondary/35 p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-semibold leading-none tracking-tight tabular-nums md:text-7xl">
                    {result.overallScore}
                  </span>
                  <span className="text-muted-foreground pb-2 text-sm font-medium">
                    /100
                  </span>
                </div>
                <div className="text-muted-foreground max-w-48 text-right text-xs font-semibold uppercase tracking-[0.14em]">
                  Overall trustworthiness
                </div>
              </div>
              <Progress value={result.overallScore} className="h-3" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {result.interpretation}
            </p>
            {result.warnings.length > 0 && (
              <Alert>
                <AlertTriangle />
                <AlertTitle>Review note</AlertTitle>
                <AlertDescription>{result.warnings.join(" ")}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ResultsPanel({ result }: { result: AnalysisResult }) {
  const majorIssues = result.issues.filter((issue) => issue.severity !== "low");
  const lowIssues = result.issues.filter((issue) => issue.severity === "low");

  return (
    <Tabs defaultValue="breakdown" className="w-full gap-5">
      <TabsList className="h-auto w-full flex-wrap justify-start p-1 md:w-auto">
        <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        <TabsTrigger value="flags">Risk flags</TabsTrigger>
        <TabsTrigger value="rewrite">Rewrite</TabsTrigger>
        <TabsTrigger value="framework">Framework</TabsTrigger>
      </TabsList>

      <TabsContent value="breakdown" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CRITERIA_META.map((criterion) => {
            const Icon = CRITERION_ICONS[criterion.key];
            const score = result.scores[criterion.key as keyof CriterionScores];

            return (
              <ScoreCard
                key={criterion.key}
                label={criterion.label}
                score={score}
                description={criterion.question}
                icon={Icon}
              />
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="flags" className="mt-0">
        <div className="flex flex-col gap-3">
          {majorIssues.length === 0 ? (
            <Alert className="border-primary/25 bg-primary/5">
              <CheckCircle2 />
              <AlertTitle>No major risk flags detected</AlertTitle>
              <AlertDescription>
                The draft is relatively grounded, but factual claims should
                still be manually verified before publishing.
              </AlertDescription>
            </Alert>
          ) : (
            majorIssues.map((issue, index) => (
              <Alert
                key={`${issue.type}-${index}`}
                variant={issue.severity === "high" ? "destructive" : "default"}
                className="bg-card"
              >
                <AlertTriangle />
                <AlertTitle className="flex flex-wrap items-center gap-2">
                  {issue.message}
                  <Badge variant={severityVariant(issue.severity)}>
                    {issue.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  <span className="text-foreground/80 font-medium">
                    {issue.type}:
                  </span>{" "}
                  {issue.suggestion}
                </AlertDescription>
              </Alert>
            ))
          )}
          {lowIssues.map((issue, index) => (
            <Alert key={`low-${index}`} className="bg-muted/35">
              <FileText />
              <AlertTitle>{issue.message}</AlertTitle>
              <AlertDescription>{issue.suggestion}</AlertDescription>
            </Alert>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rewrite" className="mt-0">
        <Card className="border-border/80 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PenLine className="text-primary size-5" />
              Suggested human rewrite
            </CardTitle>
            <CardDescription>
              Rule-based suggestion, not generated by an external AI API.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <blockquote className="border-primary/30 bg-secondary/35 rounded-md border-l-4 p-5 text-base leading-relaxed">
              {result.suggestedRewrite}
            </blockquote>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Why this reads better</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {result.rewriteExplanation}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Copywriting tip</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {result.copywritingTip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="framework" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {CRITERIA_META.map((criterion) => (
            <Card key={criterion.key} className="gap-3 shadow-none">
              <CardHeader className="gap-2">
                <CardTitle className="text-base">{criterion.label}</CardTitle>
                <CardDescription>{criterion.question}</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                {criterion.description}
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground mt-4 max-w-3xl text-sm leading-relaxed">
          This framework is heuristic and experimental. It helps reviewers spot
          common trust risks; it does not replace legal review or fact-checking.
        </p>
      </TabsContent>
    </Tabs>
  );
}

export default function App() {
  const [copy, setCopy] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const displayResult = useMemo(() => {
    if (!hasAnalyzed) return null;
    return result ?? analyzeMarketingCopy(copy);
  }, [copy, hasAnalyzed, result]);

  function handleAnalyze() {
    const analysis = analyzeMarketingCopy(copy);
    setResult(analysis);
    setHasAnalyzed(true);
  }

  function handleSample() {
    setCopy(SAMPLE_COPY);
    const analysis = analyzeMarketingCopy(SAMPLE_COPY);
    setResult(analysis);
    setHasAnalyzed(true);
  }

  function handleClear() {
    setCopy("");
    setResult(null);
    setHasAnalyzed(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-5 md:px-6 lg:px-8">
        <header className="border-border/80 flex flex-col gap-5 border-b pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-md">
              <ClipboardCheck className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold tracking-tight md:text-3xl">
                AI Marketing Trust Analyzer
              </h1>
              <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                A transparent editorial audit for checking whether marketing
                copy feels specific, verifiable, clear, and trustworthy.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">No external AI API</Badge>
            <Badge variant="outline">Rule-based framework</Badge>
          </div>
        </header>

        <main className="flex flex-col gap-8">
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
            <InputPanel
              copy={copy}
              hasAnalyzed={hasAnalyzed}
              onCopyChange={setCopy}
              onAnalyze={handleAnalyze}
              onSample={handleSample}
              onClear={handleClear}
            />
            <ScorePanel result={displayResult} />
          </section>

          {displayResult && (
            <section className="flex flex-col gap-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <SectionTitle
                  icon={BookOpen}
                  eyebrow="Detailed audit"
                  title="Evidence, clarity, and risk signals"
                  description="Review the score breakdown, flagged language, rewrite guidance, and the framework behind the result."
                />
                <div className="text-muted-foreground text-sm">
                  {displayResult.issues.length} signals found
                </div>
              </div>
              <ResultsPanel result={displayResult} />
            </section>
          )}
        </main>

        <Separator />
        <footer className="text-muted-foreground flex flex-col gap-2 pb-6 text-sm md:flex-row md:items-center md:justify-between">
          <span>
            Built as a portfolio prototype for AI-assisted marketing quality.
          </span>
          <span>Always verify factual claims before publishing.</span>
        </footer>
      </div>
    </div>
  );
}
