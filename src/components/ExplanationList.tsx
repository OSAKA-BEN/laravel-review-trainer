"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Explanation, ExplanationLevel } from "@/types";
import { BookOpen, Play } from "lucide-react";

interface ExplanationListProps {
  explanations: Explanation[];
}

const levelColors: Record<ExplanationLevel, string> = {
  Beginner: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Intermediate: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/30",
};

export function ExplanationList({ explanations }: ExplanationListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {explanations.map((explanation) => (
        <Link key={explanation.id} href={`/explanation/${explanation.id}`}>
          <Card className="h-full transition-all duration-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg group-hover:text-blue-400 transition-colors">
                  {explanation.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={levelColors[explanation.level]}
                >
                  {explanation.level}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {explanation.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>
                    {explanation.steps.length} step
                    {explanation.steps.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {explanation.category}
                  </Badge>
                  {explanation.files && explanation.files.length > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      {explanation.files.length} files
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
