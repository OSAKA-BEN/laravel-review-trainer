"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Challenge } from "@/types";
import { Code2, Shield, Bug, Zap } from "lucide-react";

interface ChallengeListProps {
  challenges: Challenge[];
}

const levelColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/30",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  Hard: "bg-red-500/10 text-red-500 border-red-500/30",
};

const levelLabels = {
  Easy: "Easy",
  Medium: "Medium",
  Hard: "Hard",
};

function getErrorTypeIcon(types: string[]) {
  if (types.includes("Security")) return <Shield className="w-4 h-4" />;
  if (types.includes("Performance")) return <Zap className="w-4 h-4" />;
  if (types.includes("Logic")) return <Bug className="w-4 h-4" />;
  return <Code2 className="w-4 h-4" />;
}

export function ChallengeList({ challenges }: ChallengeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => {
        const errorTypes = [...new Set(challenge.solution.map((s) => s.type))];

        return (
          <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
            <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {challenge.title}
                  </CardTitle>
                  <Badge variant="outline" className={levelColors[challenge.level]}>
                    {levelLabels[challenge.level]}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {getErrorTypeIcon(errorTypes)}
                    <span>{challenge.solution.length} error{challenge.solution.length > 1 ? "s" : ""} to find</span>
                  </div>
                  <div className="flex gap-1">
                    {errorTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
