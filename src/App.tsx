import { useMemo, useState, type ComponentType } from "react";
import {
  AlertTriangle,
  Brain,
  Gauge,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
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
  clarity: Sparkles,
  audienceAwareness: Brain,
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
    <Card className="gap-4 border-border/80 bg-gradient-to-br from-card to-muted/30 py-5 shadow-sm">
      <CardHeader className="gap-2 px-5 pb-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <Icon className="size-4" />
            </span>
            <CardTitle className="text-base">{label}</CardTitle>
          </div>
          <span className="text-lg font-semibold tabular-nums">{score}</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pt-0">
        <Progress value={score} className="h-2" />
      </CardContent>
    </Card>
  );
}

function ResultsPanel({ result }: { result: AnalysisResult }) {
  const majorIssues = result.issues.filter((i) => i.severity !== "low");

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="breakdown" className="w-full gap-4">
        <TabsList className="h-auto w-full flex-wrap p-1 md:w-auto">
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="flags">Red Flags</TabsTrigger>
          <TabsTrigger value="rewrite">Rewrite</TabsTrigger>
          <TabsTrigger value="framework">Framework</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

        <TabsContent value="flags" className="mt-2">
          <div className="flex flex-col gap-3">
            {majorIssues.length === 0 ? (
              <Alert className="border-emerald-200/80 bg-emerald-50/60">
                <ShieldCheck />
                <AlertTitle>No major red flags detected</AlertTitle>
                <AlertDescription>
                  No major red flags detected, but factual claims should still
                  be manually verified.
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
            {result.issues
              .filter((i) => i.severity === "low")
              .map((issue, index) => (
                <Alert key={`low-${index}`} className="bg-muted/40">
                  <Sparkles />
                  <AlertTitle>{issue.message}</AlertTitle>
                  <AlertDescription>{issue.suggestion}</AlertDescription>
                </Alert>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rewrite" className="mt-2">
          <Card className="gap-4 border-dashed bg-gradient-to-br from-amber-50/50 to-card py-5">
            <CardHeader className="px-5 pb-0">
              <CardTitle className="text-base">Suggested human rewrite</CardTitle>
              <CardDescription>
                Rule-based suggestion — not generated by an external AI API.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-5">
              <p className="text-foreground rounded-lg border bg-background/80 p-4 text-base leading-relaxed">
                {result.suggestedRewrite}
              </p>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Why this rewrite is better</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {result.rewriteExplanation}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Practical copywriting tip</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {result.copywritingTip}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="framework" className="mt-2">
          <div className="grid gap-4 md:grid-cols-2">
            {CRITERIA_META.map((criterion) => (
              <Card key={criterion.key} className="gap-3 py-5">
                <CardHeader className="px-5 pb-0">
                  <CardTitle className="text-base">{criterion.label}</CardTitle>
                  <CardDescription>{criterion.question}</CardDescription>
                </CardHeader>
                <CardContent className="px-5 text-sm leading-relaxed text-muted-foreground">
                  {criterion.description}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            This framework is heuristic and experimental. It helps you spot
            common trust risks — it does not replace legal review or fact-checking.
          </p>
        </TabsContent>
      </Tabs>
    </div>
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-background to-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:px-6 md:py-14">
        <header className="flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Experimental AI marketing audit
          </Badge>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
              AI Marketing Trust Analyzer
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed md:text-lg">
              AI can write marketing copy in seconds. This prototype checks
              whether the copy feels specific, verifiable, clear, and
              trustworthy.
            </p>
            <p className="text-muted-foreground/90 mx-auto max-w-xl text-sm">
              Check whether your AI-generated marketing copy sounds clear,
              specific, and trustworthy.
            </p>
          </div>
          <Alert className="max-w-2xl border-amber-200/70 bg-amber-50/50 text-left">
            <AlertTriangle className="text-amber-700" />
            <AlertTitle className="text-amber-900">
              Heuristic prototype
            </AlertTitle>
            <AlertDescription className="text-amber-900/80">
              This is a heuristic prototype, not an objective truth detector.
            </AlertDescription>
          </Alert>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/80 shadow-md">
            <CardHeader>
              <CardTitle>Paste your marketing copy</CardTitle>
              <CardDescription>
                Drop in a headline, ad, landing page blurb, or email draft.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Textarea
                value={copy}
                onChange={(e) => setCopy(e.target.value)}
                placeholder="Paste AI-generated or human-written marketing copy here..."
                className="min-h-44 resize-y text-base leading-relaxed"
                aria-label="Marketing copy input"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAnalyze} className="gap-2">
                  <SearchCheck data-icon="inline-start" />
                  Analyze Copy
                </Button>
                <Button variant="outline" onClick={handleSample}>
                  Try Sample Copy
                </Button>
                <Button variant="ghost" onClick={handleClear}>
                  <RefreshCw data-icon="inline-start" />
                  Clear
                </Button>
              </div>
              {hasAnalyzed && !copy.trim() && (
                <Alert>
                  <Sparkles />
                  <AlertTitle>Add some copy first</AlertTitle>
                  <AlertDescription>
                    Paste a sentence or two so the analyzer has something to
                    review.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-border/80 shadow-md transition-opacity",
              displayResult ? "opacity-100" : "opacity-90",
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="text-primary size-5" />
                Overall Trustworthiness Score
              </CardTitle>
              <CardDescription>
                A lightweight product-style audit summary
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {!displayResult ? (
                <div className="text-muted-foreground flex min-h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm">
                  <ShieldCheck className="size-8 opacity-40" />
                  <p>Run an analysis to see your trust score and breakdown.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <span className="text-5xl font-bold tabular-nums tracking-tight">
                      {displayResult.overallScore}
                    </span>
                    <Badge variant={riskBadgeVariant(displayResult.riskLabel)}>
                      {displayResult.riskLabel}
                    </Badge>
                  </div>
                  <Progress value={displayResult.overallScore} className="h-3" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {displayResult.interpretation}
                  </p>
                  {displayResult.warnings.length > 0 && (
                    <Alert>
                      <AlertTriangle />
                      <AlertTitle>Note</AlertTitle>
                      <AlertDescription>
                        {displayResult.warnings.join(" ")}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {displayResult && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="text-primary size-5" />
              <h2 className="text-xl font-semibold">Detailed audit</h2>
            </div>
            <ResultsPanel result={displayResult} />
          </section>
        )}

        <footer className="text-muted-foreground border-t pt-6 text-center text-sm">
          Built as a portfolio prototype for exploring AI-assisted marketing
          quality. Scores are transparent heuristics — always verify claims
          before publishing.
        </footer>
      </div>
    </div>
  );
}
