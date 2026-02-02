"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Trophy } from "lucide-react";
import { Solution, ValidationResult } from "@/types";

interface ResultPanelProps {
  result: ValidationResult;
  solutions: Solution[];
}

export function ResultPanel({ result, solutions }: ResultPanelProps) {
  const percentage = Math.round((result.found.length / result.total) * 100);
  const isPerfect =
    result.found.length === result.total && result.falsePositives.length === 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          {isPerfect ? (
            <>
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold">Perfect!</h2>
            </>
          ) : percentage >= 50 ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold">Well done!</h2>
            </>
          ) : (
            <>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold">Keep practicing</h2>
            </>
          )}
        </div>
        <p className="text-muted-foreground">
          Score:{" "}
          <span className="font-bold text-foreground">{result.found.length}</span> /{" "}
          {result.total} errors found ({percentage}%)
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-500">
              {result.found.length}
            </div>
            <div className="text-xs text-muted-foreground">Found</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-500">
              {result.missed.length}
            </div>
            <div className="text-xs text-muted-foreground">Missed</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {result.falsePositives.length}
            </div>
            <div className="text-xs text-muted-foreground">False positives</div>
          </div>
        </div>

        {/* Error explanations */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Error explanations</h3>
          {solutions.map((solution, index) => {
            const wasFound = result.found.includes(solution.line);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  wasFound
                    ? "bg-green-500/5 border-green-500/30"
                    : "bg-red-500/5 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {wasFound ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium">Line {solution.line}</span>
                      <Badge variant="outline" className="text-xs">
                        {solution.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {solution.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* False positives */}
        {result.falsePositives.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              False positives
            </h3>
            <p className="text-sm text-muted-foreground">
              You marked lines {result.falsePositives.join(", ")} which did not
              contain any errors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
