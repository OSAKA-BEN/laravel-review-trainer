"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import explanations from "@/data/explanations.json";
import { Explanation, ExplanationLevel } from "@/types";
import { cn } from "@/lib/utils";

const levelColors: Record<ExplanationLevel, string> = {
  Beginner: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Intermediate: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/30",
};

const levels: ExplanationLevel[] = ["Beginner", "Intermediate", "Advanced"];

interface ExplanationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentExplanationId: number;
}

export function ExplanationDrawer({
  open,
  onOpenChange,
  currentExplanationId,
}: ExplanationDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<ExplanationLevel>>(
    new Set()
  );

  const filteredExplanations = useMemo(() => {
    return (explanations as Explanation[]).filter((e) => {
      const matchesSearch = e.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLevel =
        activeFilters.size === 0 || activeFilters.has(e.level);
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, activeFilters]);

  const toggleFilter = (level: ExplanationLevel) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-3/4 max-w-[400px] p-0 flex flex-col gap-0"
      >
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Explanations</SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search explanations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Level filters */}
        <div className="px-4 pt-3 flex gap-2">
          {levels.map((level) => (
            <Button
              key={level}
              variant="outline"
              size="xs"
              onClick={() => toggleFilter(level)}
              className={cn(
                activeFilters.has(level) && levelColors[level]
              )}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Explanation list */}
        <div className="flex-1 overflow-y-auto mt-3 border-t">
          {filteredExplanations.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No explanations found
            </div>
          ) : (
            filteredExplanations.map((explanation) => {
              const isCurrent = explanation.id === currentExplanationId;
              return (
                <Link
                  key={explanation.id}
                  href={`/explanation/${explanation.id}`}
                  onClick={() => onOpenChange(false)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border/50",
                      isCurrent && "bg-accent border-l-2 border-l-primary"
                    )}
                  >
                    <span className="text-sm text-muted-foreground w-6 text-right shrink-0">
                      {explanation.id}.
                    </span>
                    <span
                      className={cn(
                        "text-sm flex-1 truncate",
                        isCurrent && "font-medium text-foreground"
                      )}
                    >
                      {explanation.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs shrink-0",
                        levelColors[explanation.level]
                      )}
                    >
                      {explanation.level}
                    </Badge>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          {filteredExplanations.length ===
          (explanations as Explanation[]).length
            ? `${filteredExplanations.length} explanations`
            : `${filteredExplanations.length} of ${(explanations as Explanation[]).length} explanations`}
        </div>
      </SheetContent>
    </Sheet>
  );
}
