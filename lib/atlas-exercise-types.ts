/** Contrato reutilizavel. Dados demonstrativos nao alteram question-bank.json. */
export type ExerciseBase = {
  id: string;
  prompt: string;
  instruction?: string;
  level: 1 | 2 | 3 | 4 | 5;
  hint?: string;
};
export type MultipleChoiceExercise = ExerciseBase & {
  kind: "choice";
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
};
export type WrittenExercise = ExerciseBase & {
  kind: "text";
  minCharacters?: number;
  rubric?: string[];
};
export type CodeExercise = ExerciseBase & {
  kind: "code";
  language: "html" | "css" | "javascript" | "typescript" | "python" | "plaintext";
  filename?: string;
  starterCode?: string;
  rubric?: string[];
  /** Apenas exemplos HTML demonstrativos possuem verificador especifico. */
  checker?: "html-document";
  referenceSolution?: string;
};
export type AtlasExercise = MultipleChoiceExercise | WrittenExercise | CodeExercise;
export type ExerciseSet = {
  id: string;
  title: string;
  course: string;
  lesson: string;
  exercises: AtlasExercise[];
};
