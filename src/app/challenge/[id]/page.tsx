"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CodeViewer } from "@/components/CodeViewer";
import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import challenges from "@/data/challenges.json";
import { Challenge, ValidationResult } from "@/types";
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Info,
  ChevronRight,
  List,
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
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const challenge = (challenges as Challenge[]).find(
    (c) => c.id === parseInt(id)
  );

  const handleLineClick = useCallback((lineNumber: number) => {
    setSelectedLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber);
      } else {
        newSet.add(lineNumber);
      }
      return newSet;
    });
  }, []);

  const handleValidate = useCallback(() => {
    if (!challenge) return;

    const solutionLines = challenge.solution.map((s) => s.line);
    const selectedArray = Array.from(selectedLines);

    const found = selectedArray.filter((line) => solutionLines.includes(line));
    const missed = solutionLines.filter((line) => !selectedLines.has(line));
    const falsePositives = selectedArray.filter(
      (line) => !solutionLines.includes(line)
    );

    const validationResult: ValidationResult = {
      found,
      missed,
      falsePositives,
      score: found.length,
      total: solutionLines.length,
    };

    setResult(validationResult);
  }, [challenge, selectedLines]);

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
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedLines.size} line{selectedLines.size !== 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="h-6 w-px bg-border" />
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

      {/* Main content - Two column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Code and instructions */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            result ? "border-r" : ""
          }`}
        >
          {/* Instructions */}
          <div className="p-6 pb-4 flex-shrink-0">
            <Card className="p-4 bg-muted/30">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">{challenge.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Click on the lines you think contain errors (security,
                    logic, syntax). You can deselect by clicking again.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 px-6 pb-6 overflow-auto">
            <CodeViewer
              code={challenge.code}
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
              disabled={!!result}
            />

            {/* Stats */}
            <div className="text-sm text-muted-foreground text-center mt-4">
              {challenge.solution.length} error
              {challenge.solution.length > 1 ? "s" : ""} to find in this code
            </div>
          </div>
        </div>

        {/* Right panel - Results drawer */}
        <div
          className={`bg-muted/20 overflow-hidden transition-all duration-300 ease-in-out ${
            result ? "w-[420px]" : "w-0"
          }`}
        >
          {result && (
            <ResultPanel result={result} solutions={challenge.solution} />
          )}
        </div>
      </div>
    </div>
  );
}
