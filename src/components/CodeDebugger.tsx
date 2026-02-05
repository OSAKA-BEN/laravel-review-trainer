"use client";

import { useCallback, useEffect, useRef, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { ChallengeFile, ExplanationStep } from "@/types";
import {
  BookOpen,
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CodeDebuggerProps {
  files: ChallengeFile[];
  currentStep: ExplanationStep;
  activeFileIndex: number;
  onFileChange: (index: number) => void;
}

const stepTypeConfig = {
  info: {
    borderColor: "border-l-blue-500",
    bgColor: "bg-blue-500/5",
    headerBg: "bg-blue-500/10",
    icon: <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />,
    label: "Info",
    labelColor: "text-blue-500",
    badgeClass: "border-blue-500/30 text-blue-400",
  },
  warning: {
    borderColor: "border-l-yellow-500",
    bgColor: "bg-yellow-500/5",
    headerBg: "bg-yellow-500/10",
    icon: <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />,
    label: "Attention",
    labelColor: "text-yellow-500",
    badgeClass: "border-yellow-500/30 text-yellow-400",
  },
  danger: {
    borderColor: "border-l-red-500",
    bgColor: "bg-red-500/5",
    headerBg: "bg-red-500/10",
    icon: <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />,
    label: "Danger",
    labelColor: "text-red-500",
    badgeClass: "border-red-500/30 text-red-400",
  },
  tip: {
    borderColor: "border-l-green-500",
    bgColor: "bg-green-500/5",
    headerBg: "bg-green-500/10",
    icon: <Lightbulb className="w-4 h-4 text-green-500 flex-shrink-0" />,
    label: "Tip",
    labelColor: "text-green-500",
    badgeClass: "border-green-500/30 text-green-400",
  },
};

export function CodeDebugger({
  files,
  currentStep,
  activeFileIndex,
  onFileChange,
}: CodeDebuggerProps) {
  const highlightRef = useRef<HTMLDivElement>(null);
  const isMultiFile = files.length > 1;
  const activeFile = files[activeFileIndex] || files[0];
  const lines = activeFile.code.split("\n");

  // Check if the current step targets this file
  const isStepOnActiveFile = useMemo(() => {
    if (!currentStep.file) return true;
    return currentStep.file === activeFile.name;
  }, [currentStep.file, activeFile.name]);

  const getLineClassName = useCallback(
    (lineNumber: number) => {
      if (isStepOnActiveFile && currentStep.lines.includes(lineNumber)) {
        return "bg-blue-500/20 border-l-4 border-blue-400";
      }
      return "";
    },
    [currentStep.lines, isStepOnActiveFile]
  );

  // Find the last highlighted line to show inline explanation after it
  const lastHighlightedLine = useMemo(() => {
    if (!isStepOnActiveFile) return -1;
    return Math.max(...currentStep.lines);
  }, [currentStep.lines, isStepOnActiveFile]);

  // Auto-scroll to highlighted line
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep.id, activeFileIndex]);

  const config = stepTypeConfig[currentStep.type];

  return (
    <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-[#1e1e1e]">
      {/* IDE header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        {!isMultiFile && (
          <span className="text-zinc-400 text-sm ml-2">{activeFile.name}</span>
        )}
      </div>

      {/* File tabs for multi-file */}
      {isMultiFile && (
        <div className="flex bg-zinc-900 border-b border-zinc-700 overflow-x-auto">
          {files.map((file, index) => {
            const isActive = index === activeFileIndex;
            const hasStep =
              currentStep.file === file.name || (!currentStep.file && index === 0);
            return (
              <button
                key={file.name}
                onClick={() => onFileChange(index)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm border-r border-zinc-700 transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-[#1e1e1e] text-zinc-200 border-b-2 border-b-primary"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                )}
              >
                <span>{file.name}</span>
                {hasStep && (
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Code content */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const lineClass = getLineClassName(lineNumber);
            const isFirstHighlighted =
              isStepOnActiveFile && lineNumber === currentStep.lines[0];
            const isLastHighlighted = lineNumber === lastHighlightedLine;

            return (
              <div key={lineNumber}>
                {/* Code line */}
                <div
                  ref={isFirstHighlighted ? highlightRef : undefined}
                  className={cn(
                    "flex font-mono text-sm transition-colors duration-150",
                    lineClass,
                    !lineClass && "bg-transparent"
                  )}
                >
                  {/* Line number */}
                  <div className="flex-shrink-0 w-12 px-3 py-0.5 text-right text-zinc-500 select-none border-r border-zinc-700 bg-zinc-800/50">
                    {lineNumber}
                  </div>

                  {/* Line content */}
                  <div className="flex-grow px-4 py-0.5 overflow-x-auto">
                    <SyntaxHighlighter
                      language="php"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: "transparent",
                        fontSize: "inherit",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "inherit",
                        },
                      }}
                      PreTag="span"
                    >
                      {line || " "}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Inline explanation after the last highlighted line */}
                {isStepOnActiveFile && isLastHighlighted && (
                  <div className="bg-zinc-900/50 py-1">
                    <div
                      className={cn(
                        "border-l-4 mx-4 my-1 rounded-r-lg overflow-hidden",
                        config.borderColor,
                        config.bgColor
                      )}
                    >
                      {/* Header */}
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm",
                          config.headerBg
                        )}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                        {config.icon}
                        <span
                          className={cn(
                            "font-medium text-xs",
                            config.labelColor
                          )}
                        >
                          {config.label}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-4",
                            config.badgeClass
                          )}
                        >
                          {currentStep.title}
                        </Badge>
                      </div>

                      {/* Body */}
                      <div className="px-3 py-2 text-sm text-zinc-300 border-t border-zinc-700/50">
                        <p>{currentStep.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
