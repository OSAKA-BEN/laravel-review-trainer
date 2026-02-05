"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { ChallengeFile, LineKey, makeLineKey } from "@/types";

interface CodeViewerProps {
  files: ChallengeFile[];
  selectedLines: Set<LineKey>;
  onLineClick: (key: LineKey) => void;
  resultMode?: {
    found: LineKey[];
    missed: LineKey[];
    falsePositives: LineKey[];
  };
  disabled?: boolean;
}

export function CodeViewer({
  files,
  selectedLines,
  onLineClick,
  resultMode,
  disabled = false,
}: CodeViewerProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const isMultiFile = files.length > 1;
  const activeFile = files[activeFileIndex] || files[0];
  const lines = activeFile.code.split("\n");

  const getLineClassName = useCallback(
    (lineNumber: number) => {
      const key = isMultiFile
        ? makeLineKey(lineNumber, activeFile.name)
        : makeLineKey(lineNumber);

      if (resultMode) {
        if (resultMode.found.includes(key)) {
          return "bg-green-500/30 border-l-4 border-green-500";
        }
        if (resultMode.missed.includes(key)) {
          return "bg-red-500/30 border-l-4 border-red-500";
        }
        if (resultMode.falsePositives.includes(key)) {
          return "bg-orange-500/30 border-l-4 border-orange-500";
        }
        return "";
      }

      if (selectedLines.has(key)) {
        return "bg-yellow-500/30 border-l-4 border-yellow-400";
      }

      return "";
    },
    [resultMode, selectedLines, activeFile.name, isMultiFile]
  );

  const getFileSelectedCount = useCallback(
    (fileName: string) => {
      if (isMultiFile) {
        return Array.from(selectedLines).filter((k) =>
          k.startsWith(`${fileName}:`)
        ).length;
      }
      return selectedLines.size;
    },
    [selectedLines, isMultiFile]
  );

  return (
    <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-[#1e1e1e]">
      {/* Header style IDE */}
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

      {/* File tabs for multi-file challenges */}
      {isMultiFile && (
        <div className="flex bg-zinc-900 border-b border-zinc-700 overflow-x-auto">
          {files.map((file, index) => {
            const isActive = index === activeFileIndex;
            const selectedCount = getFileSelectedCount(file.name);
            return (
              <button
                key={file.name}
                onClick={() => setActiveFileIndex(index)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm border-r border-zinc-700 transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-[#1e1e1e] text-zinc-200 border-b-2 border-b-primary"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                )}
              >
                <span>{file.name}</span>
                {!resultMode && selectedCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                    {selectedCount}
                  </span>
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
            const isClickable = !disabled && !resultMode;
            const lineKey = isMultiFile
              ? makeLineKey(lineNumber, activeFile.name)
              : makeLineKey(lineNumber);

            return (
              <div
                key={lineNumber}
                onClick={() => isClickable && onLineClick(lineKey)}
                className={cn(
                  "flex font-mono text-sm transition-colors duration-150",
                  lineClass,
                  isClickable && "cursor-pointer hover:bg-zinc-700/50",
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
            );
          })}
        </div>
      </div>

      {/* Legend in result mode */}
      {resultMode && (
        <div className="flex gap-6 px-4 py-3 bg-zinc-800 border-t border-zinc-700 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/30 border-l-4 border-green-500" />
            <span className="text-zinc-300">Found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/30 border-l-4 border-red-500" />
            <span className="text-zinc-300">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500/30 border-l-4 border-orange-500" />
            <span className="text-zinc-300">False positive</span>
          </div>
        </div>
      )}
    </div>
  );
}
