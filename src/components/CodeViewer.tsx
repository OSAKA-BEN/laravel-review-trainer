"use client";

import { useState, useCallback, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import {
  ChallengeFile,
  LineKey,
  Solution,
  makeLineKey,
  parseLineKey,
} from "@/types";
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CodeViewerProps {
  files: ChallengeFile[];
  selectedLines: Set<LineKey>;
  onLineClick: (key: LineKey) => void;
  resultMode?: {
    found: LineKey[];
    missed: LineKey[];
    falsePositives: LineKey[];
  };
  solutions?: Solution[];
  disabled?: boolean;
}

type InlineCommentType = "found" | "missed" | "false-positive";

interface InlineComment {
  type: InlineCommentType;
  solution?: Solution;
}

export function CodeViewer({
  files,
  selectedLines,
  onLineClick,
  resultMode,
  solutions = [],
  disabled = false,
}: CodeViewerProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
  const isMultiFile = files.length > 1;
  const activeFile = files[activeFileIndex] || files[0];
  const lines = activeFile.code.split("\n");

  // Build a map of line -> inline comments for the active file
  const lineCommentsMap = useMemo(() => {
    if (!resultMode) return new Map<number, InlineComment[]>();

    const map = new Map<number, InlineComment[]>();

    // Add found and missed solutions for this file
    for (const solution of solutions) {
      const key = isMultiFile
        ? makeLineKey(solution.line, solution.file)
        : makeLineKey(solution.line);

      // Only show solutions relevant to the active file
      if (isMultiFile && solution.file !== activeFile.name) continue;

      const isFound = resultMode.found.includes(key);
      const isMissed = resultMode.missed.includes(key);

      if (isFound || isMissed) {
        const existing = map.get(solution.line) || [];
        existing.push({
          type: isFound ? "found" : "missed",
          solution,
        });
        map.set(solution.line, existing);
      }
    }

    // Add false positives for this file
    for (const fpKey of resultMode.falsePositives) {
      const parsed = parseLineKey(fpKey);
      if (isMultiFile && parsed.file !== activeFile.name) continue;

      const existing = map.get(parsed.line) || [];
      existing.push({ type: "false-positive" });
      map.set(parsed.line, existing);
    }

    return map;
  }, [resultMode, solutions, activeFile.name, isMultiFile]);

  const getLineClassName = useCallback(
    (lineNumber: number) => {
      const key = isMultiFile
        ? makeLineKey(lineNumber, activeFile.name)
        : makeLineKey(lineNumber);

      if (resultMode) {
        if (resultMode.found.includes(key)) {
          return "bg-green-500/20";
        }
        if (resultMode.missed.includes(key)) {
          return "bg-red-500/20";
        }
        if (resultMode.falsePositives.includes(key)) {
          return "bg-orange-500/20";
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

  const toggleComment = useCallback((commentId: string) => {
    setCollapsedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  const renderInlineComment = (lineNumber: number, comment: InlineComment, idx: number) => {
    const commentId = `${activeFile.name}:${lineNumber}:${idx}`;
    const isCollapsed = collapsedComments.has(commentId);

    const config = {
      found: {
        borderColor: "border-l-green-500",
        bgColor: "bg-green-500/5",
        headerBg: "bg-green-500/10",
        icon: <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />,
        label: "Found",
        labelColor: "text-green-500",
      },
      missed: {
        borderColor: "border-l-red-500",
        bgColor: "bg-red-500/5",
        headerBg: "bg-red-500/10",
        icon: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
        label: "Missed",
        labelColor: "text-red-500",
      },
      "false-positive": {
        borderColor: "border-l-orange-500",
        bgColor: "bg-orange-500/5",
        headerBg: "bg-orange-500/10",
        icon: <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />,
        label: "False positive",
        labelColor: "text-orange-500",
      },
    }[comment.type];

    return (
      <div
        key={commentId}
        className={cn(
          "border-l-4 mx-4 my-1 rounded-r-lg overflow-hidden",
          config.borderColor,
          config.bgColor
        )}
      >
        {/* Comment header — clickable to collapse */}
        <button
          onClick={() => toggleComment(commentId)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:brightness-110",
            config.headerBg
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          )}
          {config.icon}
          <span className={cn("font-medium text-xs", config.labelColor)}>
            {config.label}
          </span>
          {comment.solution && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-zinc-600 text-zinc-400">
              {comment.solution.type}
            </Badge>
          )}
          {isCollapsed && comment.solution && (
            <span className="text-xs text-zinc-500 truncate ml-1">
              {comment.solution.explanation.slice(0, 60)}...
            </span>
          )}
        </button>

        {/* Comment body */}
        {!isCollapsed && (
          <div className="px-3 py-2 text-sm text-zinc-300 border-t border-zinc-700/50">
            {comment.solution ? (
              <p>{comment.solution.explanation}</p>
            ) : (
              <p className="text-zinc-400">
                This line does not contain an error.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

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
            const comments = lineCommentsMap.get(lineNumber);

            return (
              <div key={lineNumber}>
                {/* Code line */}
                <div
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

                {/* Inline review comments */}
                {resultMode && comments && comments.length > 0 && (
                  <div className="bg-zinc-900/50 py-1">
                    {comments.map((comment, idx) =>
                      renderInlineComment(lineNumber, comment, idx)
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend in result mode */}
      {resultMode && (
        <div className="flex gap-6 px-4 py-3 bg-zinc-800 border-t border-zinc-700 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/20 border-l-4 border-green-500 rounded-r" />
            <span className="text-zinc-300">Found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/20 border-l-4 border-red-500 rounded-r" />
            <span className="text-zinc-300">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500/20 border-l-4 border-orange-500 rounded-r" />
            <span className="text-zinc-300">False positive</span>
          </div>
        </div>
      )}
    </div>
  );
}
