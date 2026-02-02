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
  found: number[];      // Lignes correctement identifiées
  missed: number[];     // Lignes d'erreur non trouvées
  falsePositives: number[]; // Lignes saines marquées à tort
  score: number;
  total: number;
}
