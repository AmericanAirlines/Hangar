export type ProjectCriteriaScore = {
  weight: number;
  sum: number;
  count: number;
};

export type CriteriaJudgingSessionProjectResults = {
  totalAverageScore: number;
  criteriaScores: Record<string, ProjectCriteriaScore>;
};

export type CriteriaJudgingSessionResults = Record<string, CriteriaJudgingSessionProjectResults>;
