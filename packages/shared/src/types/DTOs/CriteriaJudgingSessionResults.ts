import { Project, SerializedProject } from '../entities';

type CriteriaJudgingSessionResultsValues = { results: { score: number } };

export type SerializedCriteriaJudgingSessionResults = (SerializedProject &
  CriteriaJudgingSessionResultsValues)[];

export type CriteriaJudgingSessionResult = Project & CriteriaJudgingSessionResultsValues;
export type CriteriaJudgingSessionResults = CriteriaJudgingSessionResult[];
