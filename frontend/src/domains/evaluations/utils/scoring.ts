import type { EvaluationAnswers, EvaluationResult } from '../types';

export function calcScore(answers: EvaluationAnswers): number {
  return Object.values(answers).reduce((sum, v) => sum + v, 0);
}

export function getClassification(score: number): EvaluationResult {
  if (score <= 29.5) {
    return { score, classification: 'Sem indicativo de TEA', color: '#16a34a', cls: 'not-tea' };
  }
  if (score < 37) {
    return { score, classification: 'TEA Leve a Moderado', color: '#ca8a04', cls: 'tea-leve' };
  }
  return { score, classification: 'TEA Grave', color: '#dc2626', cls: 'tea-grave' };
}
