"use client";

import { useState, useCallback, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CodeDebugger } from "@/components/CodeDebugger";
import { StepperControls } from "@/components/StepperControls";
import { ExplanationDrawer } from "@/components/ExplanationDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import explanations from "@/data/explanations.json";
import {
  Explanation,
  ExplanationLevel,
  getExplanationFiles,
} from "@/types";
import {
  ArrowLeft,
  List,
  BookOpen,
  ChevronRight,
} from "lucide-react";

const levelColors: Record<ExplanationLevel, string> = {
  Beginner: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Intermediate: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/30",
};

export default function ExplanationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const explanation = (explanations as Explanation[]).find(
    (e) => e.id === parseInt(id)
  );

  const files = explanation ? getExplanationFiles(explanation) : [];
  const isMultiFile = files.length > 1;

  const currentStep = explanation?.steps[currentStepIndex];
  const totalSteps = explanation?.steps.length ?? 0;

  // Auto-switch file tab when step references a different file
  useEffect(() => {
    if (!explanation || !currentStep?.file || !isMultiFile) return;
    const targetIndex = files.findIndex((f) => f.name === currentStep.file);
    if (targetIndex !== -1 && targetIndex !== activeFileIndex) {
      setActiveFileIndex(targetIndex);
    }
  }, [currentStepIndex, currentStep?.file, isMultiFile, files, activeFileIndex, explanation]);

  // Reset step when changing explanation
  useEffect(() => {
    setCurrentStepIndex(0);
    setActiveFileIndex(0);
  }, [id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSteps]);

  const handlePrevious = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handleGoToStep = useCallback((index: number) => {
    setCurrentStepIndex(index);
  }, []);

  const handleNextExplanation = useCallback(() => {
    const currentIndex = (explanations as Explanation[]).findIndex(
      (e) => e.id === parseInt(id)
    );
    const next = (explanations as Explanation[])[currentIndex + 1];
    if (next) {
      router.push(`/explanation/${next.id}`);
    }
  }, [id, router]);

  if (!explanation || !currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            Explanation not found
          </h2>
          <Link href="/">
            <Button>Back to home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const currentIndex = (explanations as Explanation[]).findIndex(
    (e) => e.id === parseInt(id)
  );
  const hasNextExplanation =
    currentIndex < (explanations as Explanation[]).length - 1;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <ExplanationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentExplanationId={parseInt(id)}
      />

      {/* Header */}
      <header className="border-b bg-background z-10 flex-shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side */}
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
                <h1 className="text-lg font-semibold">
                  {explanation.title}
                </h1>
                <Badge
                  variant="outline"
                  className={levelColors[explanation.level]}
                >
                  {explanation.level}
                </Badge>
                {isMultiFile && (
                  <Badge variant="secondary" className="text-xs">
                    {files.length} files
                  </Badge>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                Step {currentStepIndex + 1} / {totalSteps}
              </span>
              {isLastStep && hasNextExplanation && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <Button size="sm" onClick={handleNextExplanation}>
                    Next explanation
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Description banner */}
      <div className="p-6 pb-4 flex-shrink-0">
        <Card className="p-4 bg-muted/30">
          <div className="flex gap-3">
            <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">{explanation.description}</p>
              <p className="text-sm text-muted-foreground">
                Navigate using the Next/Back buttons or the arrow keys on your
                keyboard.
                {isMultiFile &&
                  " File tabs switch automatically based on the current step."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Code Debugger */}
      <div className="flex-1 px-6 overflow-auto">
        <CodeDebugger
          files={files}
          currentStep={currentStep}
          activeFileIndex={activeFileIndex}
          onFileChange={setActiveFileIndex}
        />
      </div>

      {/* Stepper Controls */}
      <StepperControls
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onGoToStep={handleGoToStep}
        stepType={currentStep.type}
      />
    </div>
  );
}
