"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CodeViewer } from "@/components/CodeViewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import challenges from "@/data/challenges.json";
import {
  Challenge,
  ValidationResult,
  LineKey,
  makeLineKey,
  getChallengeFiles,
} from "@/types";
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Info,
  ChevronRight,
  List,
  Trophy,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ChallengeDrawer } from "@/components/ChallengeDrawer";

const levelColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/30",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  Hard: "bg-red-500/10 text-red-500 border-red-500/30",
};

const levelLabels = {
  Easy: "Easy",
  Medium: "Medium",
  Hard: "Hard",
};

export default function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedLines, setSelectedLines] = useState<Set<LineKey>>(new Set());
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const challenge = (challenges as Challenge[]).find(
    (c) => c.id === parseInt(id)
  );

  const files = challenge ? getChallengeFiles(challenge) : [];
  const isMultiFile = files.length > 1;

  const handleLineClick = useCallback((key: LineKey) => {
    setSelectedLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  const handleValidate = useCallback(() => {
    if (!challenge) return;

    const solutionKeys = challenge.solution.map((s) =>
      isMultiFile ? makeLineKey(s.line, s.file) : makeLineKey(s.line)
    );
    const selectedArray = Array.from(selectedLines);

    const found = selectedArray.filter((key) => solutionKeys.includes(key));
    const missed = solutionKeys.filter((key) => !selectedLines.has(key));
    const falsePositives = selectedArray.filter(
      (key) => !solutionKeys.includes(key)
    );

    const validationResult: ValidationResult = {
      found,
      missed,
      falsePositives,
      score: found.length,
      total: solutionKeys.length,
    };

    setResult(validationResult);
  }, [challenge, selectedLines, isMultiFile]);

  const handleRetry = useCallback(() => {
    setSelectedLines(new Set());
    setResult(null);
  }, []);

  const handleNext = useCallback(() => {
    const currentIndex = (challenges as Challenge[]).findIndex(
      (c) => c.id === parseInt(id)
    );
    const nextChallenge = (challenges as Challenge[])[currentIndex + 1];
    if (nextChallenge) {
      router.push(`/challenge/${nextChallenge.id}`);
      handleRetry();
    }
  }, [id, router, handleRetry]);

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Challenge not found</h2>
          <Link href="/">
            <Button>Back to home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const currentIndex = (challenges as Challenge[]).findIndex(
    (c) => c.id === parseInt(id)
  );
  const hasNext = currentIndex < (challenges as Challenge[]).length - 1;

  const percentage = result
    ? Math.round((result.found.length / result.total) * 100)
    : 0;
  const isPerfect = result
    ? result.found.length === result.total && result.falsePositives.length === 0
    : false;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <ChallengeDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentChallengeId={parseInt(id)}
      />

      {/* Header */}
      <header className="border-b bg-background z-10 flex-shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation and title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setDrawerOpen(true)}
              >
                <List className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-border" />
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">{challenge.title}</h1>
                <Badge
                  variant="outline"
                  className={levelColors[challenge.level]}
                >
                  {levelLabels[challenge.level]}
                </Badge>
                {isMultiFile && (
                  <Badge variant="secondary" className="text-xs">
                    {files.length} files
                  </Badge>
                )}
              </div>
            </div>

            {/* Center - Stats */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                {challenge.solution.length} error
                {challenge.solution.length > 1 ? "s" : ""} to find
                {isMultiFile ? ` across ${files.length} files` : ""}
              </span>
              <div className="h-4 w-px bg-border" />
              <span>
                {selectedLines.size} line
                {selectedLines.size !== 1 ? "s" : ""} selected
              </span>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              {result ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    <RotateCcw className="w-4 h-4" />
                    Retry
                  </Button>
                  {hasNext && (
                    <Button size="sm" onClick={handleNext}>
                      Next challenge
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={handleValidate}
                  disabled={selectedLines.size === 0}
                >
                  <Check className="w-4 h-4" />
                  Submit Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content — full width */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Instructions / Score banner */}
        <div className="p-6 pb-4 flex-shrink-0">
          {result ? (
            /* Score summary banner */
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPerfect ? (
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  ) : percentage >= 50 ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {isPerfect
                        ? "Perfect!"
                        : percentage >= 50
                          ? "Well done!"
                          : "Keep practicing"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Score:{" "}
                      <span className="font-bold text-foreground">
                        {result.found.length}
                      </span>{" "}
                      / {result.total} errors found ({percentage}%)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">
                      {result.found.length} found
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">
                      {result.missed.length} missed
                    </span>
                  </div>
                  {result.falsePositives.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-sm font-medium">
                        {result.falsePositives.length} false{" "}
                        {result.falsePositives.length === 1
                          ? "positive"
                          : "positives"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            /* Instructions */
            <Card className="p-4 bg-muted/30">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">{challenge.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Click on the lines you think contain errors (security,
                    logic, syntax). You can deselect by clicking again.
                    {isMultiFile &&
                      " Navigate between files using the tabs above the code."}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Code Viewer */}
        <div className="flex-1 px-6 pb-6 overflow-auto">
          <CodeViewer
            files={files}
            selectedLines={selectedLines}
            onLineClick={handleLineClick}
            resultMode={
              result
                ? {
                    found: result.found,
                    missed: result.missed,
                    falsePositives: result.falsePositives,
                  }
                : undefined
            }
            solutions={challenge.solution}
            disabled={!!result}
          />

        </div>
      </div>
    </div>
  );
}
