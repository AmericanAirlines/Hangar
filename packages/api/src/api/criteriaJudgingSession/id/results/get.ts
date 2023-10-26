import { Request, Response } from 'express';
import { CriteriaJudgingSubmission } from '@hangar/database';
import { CriteriaJudgingSessionResults } from '@hangar/shared';
import { logger } from '../../../../utils/logger';

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

    const sessionResults: CriteriaJudgingSessionResults = {};

    // Iterate over all submissions for the current session
    for (
      let submissionIndex = 0;
      submissionIndex < criteriaJudgingSubmissions.length;
      submissionIndex += 1
    ) {
      const submission = criteriaJudgingSubmissions[
        submissionIndex
      ] as (typeof criteriaJudgingSubmissions)[0];
      const projectResults = sessionResults[submission.project.id] ?? {
        criteriaScores: {},
        totalAverageScore: 0.0,
      };

      // Iterate over all scores for the submission
      const scores = submission.scores.getItems();
      for (let scoreIndex = 0; scoreIndex < scores.length; scoreIndex += 1) {
        const { score, criteria } = scores[scoreIndex] as (typeof scores)[0];
        const projectCriteriaScore = projectResults.criteriaScores[criteria.id] ?? {
          weight: criteria.id,
          count: 0,
          sum: 0,
        };

        projectCriteriaScore.count += 1;
        projectCriteriaScore.sum += score;

        projectResults.criteriaScores[criteria.id] = projectCriteriaScore;
      }

      sessionResults[submission.id] = projectResults;
    }

    res.send(sessionResults);
  } catch (error) {
    logger.error('Failed to fetch criteria judging session results', error);
    res.sendStatus(500);
  }
};
