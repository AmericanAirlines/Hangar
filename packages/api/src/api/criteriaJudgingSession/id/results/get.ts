import { Request, Response } from 'express';
import { EntityDTO } from '@mikro-orm/core';
import { CriteriaJudgingSessionResults } from '@hangar/shared';
import { Criteria, CriteriaJudgingSubmission } from '@hangar/database';
import { logger } from '../../../../utils/logger';

export type ProjectCriteriaScore = Pick<EntityDTO<Criteria>, 'weight' | 'scaleMin' | 'scaleMax'> & {
  sum: number;
  count: number;
};

export type CriteriaJudgingSessionProjectResults = {
  [criteriaId: string]: ProjectCriteriaScore;
};

export type RawCriteriaJudgingSessionResults = {
  [projectId: string]: CriteriaJudgingSessionProjectResults;
};

export const get = async (req: Request, res: Response) => {
  const {
    entityManager: em,
    params: { id: cjsId },
  } = req;

  try {
    const criteriaJudgingSubmissions = await em.find(
      CriteriaJudgingSubmission,
      { criteriaJudgingSession: cjsId },
      { populate: ['scores.criteria'] },
    );

    const sessionResults: RawCriteriaJudgingSessionResults = {};

    // Iterate over all submissions for the current session
    for (
      let submissionIndex = 0;
      submissionIndex < criteriaJudgingSubmissions.length;
      submissionIndex += 1
    ) {
      const submission = criteriaJudgingSubmissions[
        submissionIndex
      ] as (typeof criteriaJudgingSubmissions)[0];
      const projectResults = sessionResults[submission.project.id] ?? {};

      // Iterate over all scores for the submission
      const { scores } = submission;
      for (let scoreIndex = 0; scoreIndex < scores.length; scoreIndex += 1) {
        const { score, criteria } = scores[scoreIndex] as (typeof scores)[0];
        const projectCriteriaScore: ProjectCriteriaScore = projectResults[criteria.id] ?? {
          weight: criteria.$.weight,
          scaleMin: criteria.$.scaleMin,
          scaleMax: criteria.$.scaleMax,
          count: 0,
          sum: 0,
        };

        projectCriteriaScore.count += 1;
        projectCriteriaScore.sum += score;

        projectResults[criteria.id] = projectCriteriaScore;
      }

      sessionResults[submission.project.id] = projectResults;
    }

    // Iterate over all projects to determine their final score
    const finalScores: CriteriaJudgingSessionResults = {};
    Object.entries(sessionResults).forEach(([projectId, projectResults]) => {
      let score = 0;
      // For each project, add weighted averages for each criteria's score
      Object.values(projectResults).forEach(({ scaleMin, scaleMax, weight, count, sum }) => {
        // Get the average for the criteria
        const average = sum / count;

        // Determine how much to shift values in order to get a percentile
        const shift = 0 - scaleMin;

        // Normalize the min and max using the shift (i.e., new min will always be 0)
        const normalizedMax = scaleMax + shift;
        const normalizedAverage = average + shift;

        // Calculate the percentile
        const percentile = normalizedAverage / normalizedMax;

        // Update the total with the weighted average
        score += percentile * weight;
      });

      // Round to 2 decimals
      finalScores[projectId] = Math.round(score * 100) / 100;
    });

    res.send(finalScores);
  } catch (error) {
    logger.error('Failed to fetch criteria judging session results', error);
    res.sendStatus(500);
  }
};
