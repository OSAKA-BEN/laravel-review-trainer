"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Trophy } from "lucide-react";
import { Solution, ValidationResult } from "@/types";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ValidationResult;
  solutions: Solution[];
  onRetry: () => void;
  onNext?: () => void;
}

export function ResultModal({
  isOpen,
  onClose,
  result,
  solutions,
  onRetry,
  onNext,
}: ResultModalProps) {
  const percentage = Math.round((result.found.length / result.total) * 100);
  const isPerfect = result.found.length === result.total && result.falsePositives.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            {isPerfect ? (
              <>
                <Trophy className="w-8 h-8 text-yellow-500" />
                Parfait !
              </>
            ) : percentage >= 50 ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                Bien joué !
              </>
            ) : (
              <>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                Continuez à vous entraîner
              </>
            )}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-lg mt-2">
              Score: <span className="font-bold text-foreground">{result.found.length}</span> / {result.total} erreurs trouvées ({percentage}%)
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Résumé */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-500">{result.found.length}</div>
              <div className="text-sm text-muted-foreground">Trouvées</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-500">{result.missed.length}</div>
              <div className="text-sm text-muted-foreground">Manquées</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-500">{result.falsePositives.length}</div>
              <div className="text-sm text-muted-foreground">Faux positifs</div>
            </div>
          </div>

          {/* Explications des erreurs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Explications des erreurs</h3>
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
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        {wasFound ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="font-medium">Ligne {solution.line}</span>
                        <Badge variant="outline" className="text-xs">
                          {solution.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">
                        {solution.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Faux positifs */}
          {result.falsePositives.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Faux positifs
              </h3>
              <p className="text-sm text-muted-foreground">
                Vous avez marqué les lignes {result.falsePositives.join(", ")} qui ne contenaient pas d&apos;erreur.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onRetry} className="flex-1">
            Réessayer
          </Button>
          {onNext && (
            <Button onClick={onNext} className="flex-1">
              Challenge suivant
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
