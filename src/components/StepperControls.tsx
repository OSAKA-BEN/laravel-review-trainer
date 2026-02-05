"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepType } from "@/types";
import { ChevronLeft, ChevronRight, Keyboard } from "lucide-react";

interface StepperControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToStep: (index: number) => void;
  stepType: StepType;
}

const typeColors: Record<StepType, string> = {
  info: "bg-blue-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  tip: "bg-green-500",
};

export function StepperControls({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onGoToStep,
  stepType,
}: StepperControlsProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-zinc-900 border-t border-zinc-700">
      {/* Previous */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={isFirst}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      {/* Step counter */}
      <span className="text-sm text-zinc-400 whitespace-nowrap">
        Step {currentStep + 1} / {totalSteps}
      </span>

      {/* Progress bar */}
      <div className="flex-1 flex items-center gap-0.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGoToStep(i)}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-colors duration-200",
              i < currentStep
                ? "bg-zinc-500"
                : i === currentStep
                  ? typeColors[stepType]
                  : "bg-zinc-700"
            )}
            title={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="flex items-center gap-1 text-xs text-zinc-600">
        <Keyboard className="w-3.5 h-3.5" />
        <span>Arrow keys</span>
      </div>

      {/* Next */}
      <Button
        variant={isLast ? "secondary" : "default"}
        size="sm"
        onClick={onNext}
        disabled={isLast}
      >
        {isLast ? "Done" : "Next"}
        {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </div>
  );
}
