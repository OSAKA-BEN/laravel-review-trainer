"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  code: string;
  selectedLines: Set<number>;
  onLineClick: (lineNumber: number) => void;
  resultMode?: {
    found: number[];
    missed: number[];
    falsePositives: number[];
  };
  disabled?: boolean;
}

export function CodeViewer({
  code,
  selectedLines,
  onLineClick,
  resultMode,
  disabled = false,
}: CodeViewerProps) {
  const lines = code.split("\n");

  const getLineClassName = useCallback(
    (lineNumber: number) => {
      if (resultMode) {
        if (resultMode.found.includes(lineNumber)) {
          return "bg-green-500/30 border-l-4 border-green-500";
        }
        if (resultMode.missed.includes(lineNumber)) {
          return "bg-red-500/30 border-l-4 border-red-500";
        }
        if (resultMode.falsePositives.includes(lineNumber)) {
          return "bg-orange-500/30 border-l-4 border-orange-500";
        }
        return "";
      }

      if (selectedLines.has(lineNumber)) {
        return "bg-yellow-500/30 border-l-4 border-yellow-400";
      }

      return "";
    },
    [resultMode, selectedLines]
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
        <span className="text-zinc-400 text-sm ml-2">review.php</span>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const lineClass = getLineClassName(lineNumber);
            const isClickable = !disabled && !resultMode;

            return (
              <div
                key={lineNumber}
                onClick={() => isClickable && onLineClick(lineNumber)}
                className={cn(
                  "flex font-mono text-sm transition-colors duration-150",
                  lineClass,
                  isClickable && "cursor-pointer hover:bg-zinc-700/50",
                  !lineClass && "bg-transparent"
                )}
              >
                {/* Numéro de ligne */}
                <div className="flex-shrink-0 w-12 px-3 py-0.5 text-right text-zinc-500 select-none border-r border-zinc-700 bg-zinc-800/50">
                  {lineNumber}
                </div>

                {/* Contenu de la ligne */}
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

      {/* Légende en mode résultat */}
      {resultMode && (
        <div className="flex gap-6 px-4 py-3 bg-zinc-800 border-t border-zinc-700 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/30 border-l-4 border-green-500" />
            <span className="text-zinc-300">Trouvé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/30 border-l-4 border-red-500" />
            <span className="text-zinc-300">Manqué</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500/30 border-l-4 border-orange-500" />
            <span className="text-zinc-300">Faux positif</span>
          </div>
        </div>
      )}
    </div>
  );
}
