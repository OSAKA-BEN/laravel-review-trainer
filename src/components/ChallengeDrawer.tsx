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
import challenges from "@/data/challenges.json";
import { Challenge } from "@/types";
import { cn } from "@/lib/utils";

const levelColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/30",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  Hard: "bg-red-500/10 text-red-500 border-red-500/30",
};

const levels = ["Easy", "Medium", "Hard"] as const;

interface ChallengeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentChallengeId: number;
}

export function ChallengeDrawer({
  open,
  onOpenChange,
  currentChallengeId,
}: ChallengeDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<
    Set<Challenge["level"]>
  >(new Set());

  const filteredChallenges = useMemo(() => {
    return (challenges as Challenge[]).filter((c) => {
      const matchesSearch = c.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLevel =
        activeFilters.size === 0 || activeFilters.has(c.level);
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, activeFilters]);

  const toggleFilter = (level: Challenge["level"]) => {
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
          <SheetTitle>Challenges</SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Difficulty filters */}
        <div className="px-4 pt-3 flex gap-2">
          {levels.map((level) => (
            <Button
              key={level}
              variant="outline"
              size="xs"
              onClick={() => toggleFilter(level)}
              className={cn(
                activeFilters.has(level) && levelColors[level],
              )}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Challenge list */}
        <div className="flex-1 overflow-y-auto mt-3 border-t">
          {filteredChallenges.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No challenges found
            </div>
          ) : (
            filteredChallenges.map((challenge) => {
              const isCurrent = challenge.id === currentChallengeId;
              return (
                <Link
                  key={challenge.id}
                  href={`/challenge/${challenge.id}`}
                  onClick={() => onOpenChange(false)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border/50",
                      isCurrent && "bg-accent border-l-2 border-l-primary"
                    )}
                  >
                    <span className="text-sm text-muted-foreground w-6 text-right shrink-0">
                      {challenge.id}.
                    </span>
                    <span
                      className={cn(
                        "text-sm flex-1 truncate",
                        isCurrent && "font-medium text-foreground"
                      )}
                    >
                      {challenge.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs shrink-0",
                        levelColors[challenge.level]
                      )}
                    >
                      {challenge.level}
                    </Badge>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          {filteredChallenges.length ===
          (challenges as Challenge[]).length
            ? `${filteredChallenges.length} challenges`
            : `${filteredChallenges.length} of ${(challenges as Challenge[]).length} challenges`}
        </div>
      </SheetContent>
    </Sheet>
  );
}
