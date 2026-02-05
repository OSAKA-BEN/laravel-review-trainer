import { ChallengeList } from "@/components/ChallengeList";
import { ExplanationList } from "@/components/ExplanationList";
import challenges from "@/data/challenges.json";
import explanations from "@/data/explanations.json";
import { Challenge, Explanation } from "@/types";
import { Target, Trophy, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold">Laravel Review Trainer</h1>
                <p className="text-sm text-muted-foreground">
                  Train your eye for code review
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Become a Laravel Code Review Expert
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Analyze Laravel code snippets and identify security vulnerabilities,
              logic errors, and bad practices.
              Each challenge helps you develop a senior developer&apos;s eye.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-5 h-5 text-primary" />
                <span>{(challenges as Challenge[]).length} Challenges</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>
                  {(challenges as Challenge[]).reduce((acc, c) => acc + c.solution.length, 0)} Errors
                  to find
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>{(explanations as Explanation[]).length} Explanations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-2">Available Challenges</h3>
          <p className="text-muted-foreground">
            Select a challenge to start your review session
          </p>
        </div>
        <ChallengeList challenges={challenges as Challenge[]} />

        {/* Explanations */}
        <div className="mt-16 mb-8">
          <h3 className="text-2xl font-semibold mb-2">Step-by-Step Explanations</h3>
          <p className="text-muted-foreground">
            Walk through code line by line like a debugger to understand how it works
          </p>
        </div>
        <ExplanationList explanations={explanations as Explanation[]} />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          Laravel Review Trainer - Practice spotting errors in Laravel code
        </div>
      </footer>
    </div>
  );
}
