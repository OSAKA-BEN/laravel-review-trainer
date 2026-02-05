export interface Solution {
  file?: string; // File name for multi-file challenges
  line: number;
  type: "Security" | "Logic" | "Syntax" | "Performance" | "Best Practice";
  explanation: string;
}

export interface ChallengeFile {
  name: string;
  code: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  level: "Easy" | "Medium" | "Hard";
  code?: string;              // Single-file challenges (backward compat)
  files?: ChallengeFile[];    // Multi-file challenges
  solution: Solution[];
}

// Key used to uniquely identify a line selection across files
export type LineKey = string; // format: "filename:line" or just "line" for single-file

export interface ValidationResult {
  found: LineKey[];           // Correctly identified lines
  missed: LineKey[];          // Error lines not found
  falsePositives: LineKey[];  // Clean lines incorrectly marked
  score: number;
  total: number;
}

// Helper to create a LineKey
export function makeLineKey(line: number, file?: string): LineKey {
  return file ? `${file}:${line}` : `${line}`;
}

// Helper to parse a LineKey
export function parseLineKey(key: LineKey): { file?: string; line: number } {
  const parts = key.split(":");
  if (parts.length === 2) {
    return { file: parts[0], line: parseInt(parts[1]) };
  }
  return { line: parseInt(parts[0]) };
}

// Helper to get files from a challenge (normalizes single/multi-file)
export function getChallengeFiles(challenge: Challenge): ChallengeFile[] {
  if (challenge.files && challenge.files.length > 0) {
    return challenge.files;
  }
  if (challenge.code) {
    return [{ name: "review.php", code: challenge.code }];
  }
  return [];
}

// --- Explanation / Debugger Stepper types ---

export type StepType = "info" | "warning" | "danger" | "tip";
export type ExplanationLevel = "Beginner" | "Intermediate" | "Advanced";

export interface ExplanationStep {
  id: number;
  file?: string;
  lines: number[];
  title: string;
  explanation: string;
  type: StepType;
}

export interface Explanation {
  id: number;
  title: string;
  description: string;
  level: ExplanationLevel;
  category: string;
  code?: string;
  files?: ChallengeFile[];
  steps: ExplanationStep[];
}

export function getExplanationFiles(explanation: Explanation): ChallengeFile[] {
  if (explanation.files && explanation.files.length > 0) {
    return explanation.files;
  }
  if (explanation.code) {
    return [{ name: "code.php", code: explanation.code }];
  }
  return [];
}
