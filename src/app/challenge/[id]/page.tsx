"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CodeViewer } from "@/components/CodeViewer";
import { ResultModal } from "@/components/ResultModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import challenges from "@/data/challenges.json";
import { Challenge, ValidationResult } from "@/types";
import { ArrowLeft, Check, RotateCcw, Info } from "lucide-react";

const levelColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/30",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  Hard: "bg-red-500/10 text-red-500 border-red-500/30",
};

const levelLabels = {
  Easy: "Facile",
  Medium: "Moyen",
  Hard: "Difficile",
};

export default function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const challenge = (challenges as Challenge[]).find((c) => c.id === parseInt(id));

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
    setShowResult(true);
  }, [challenge, selectedLines]);

  const handleRetry = useCallback(() => {
    setSelectedLines(new Set());
    setResult(null);
    setShowResult(false);
  }, []);

  const handleNext = useCallback(() => {
    const currentIndex = (challenges as Challenge[]).findIndex((c) => c.id === parseInt(id));
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
          <h2 className="text-xl font-semibold mb-4">Challenge non trouvé</h2>
          <Link href="/">
            <Button>Retour à l&apos;accueil</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const currentIndex = (challenges as Challenge[]).findIndex((c) => c.id === parseInt(id));
  const hasNext = currentIndex < (challenges as Challenge[]).length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{challenge.title}</h1>
                  <Badge variant="outline" className={levelColors[challenge.level]}>
                    {levelLabels[challenge.level]}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {selectedLines.size} ligne{selectedLines.size !== 1 ? "s" : ""}{" "}
                sélectionnée{selectedLines.size !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Instructions */}
          <Card className="p-4 bg-muted/30">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">{challenge.description}</p>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur les lignes que vous pensez contenir des erreurs
                  (sécurité, logique, syntaxe). Vous pouvez désélectionner en
                  cliquant à nouveau.
                </p>
              </div>
            </div>
          </Card>

          {/* Code Viewer */}
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
          <div className="text-sm text-muted-foreground text-center">
            {challenge.solution.length} erreur
            {challenge.solution.length > 1 ? "s" : ""} à trouver dans ce code
          </div>
        </div>
      </main>

      {/* Footer sticky */}
      <footer className="border-t sticky bottom-0 bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Challenge {currentIndex + 1} / {(challenges as Challenge[]).length}
            </div>
            <div className="flex gap-3">
              {result ? (
                <>
                  <Button variant="outline" onClick={handleRetry}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                  {hasNext && (
                    <Button onClick={handleNext}>
                      Challenge suivant
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={handleValidate}
                  disabled={selectedLines.size === 0}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Valider la Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Result Modal */}
      {result && (
        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          result={result}
          solutions={challenge.solution}
          onRetry={handleRetry}
          onNext={hasNext ? handleNext : undefined}
        />
      )}
    </div>
  );
}
