export interface Question {
  id: string;
  name: string;
  options: {
    score: number;
    text: string;
  }[];
}

export interface EvaluationResult {
  score: number;
  classification: string;
  color: string;
  cls: string;
}

export interface EvaluationAnswers {
  [questionId: string]: number;
}
