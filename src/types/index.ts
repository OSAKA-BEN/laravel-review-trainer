export interface Solution {
  line: number;
  type: "Security" | "Logic" | "Syntax" | "Performance" | "Best Practice";
  explanation: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  level: "Easy" | "Medium" | "Hard";
  code: string;
  solution: Solution[];
}

export interface ValidationResult {
  found: number[];      // Correctly identified lines
  missed: number[];     // Error lines not found
  falsePositives: number[]; // Clean lines incorrectly marked
  score: number;
  total: number;
}
