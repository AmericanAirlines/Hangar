import { Request, Response } from 'express';
import { Schema } from '@hangar/shared';
import { z } from 'zod';
import { DriverException, ref } from '@mikro-orm/core';
import { CriteriaJudgingSubmission, CriteriaScore } from '@hangar/database';
import { validatePayload } from '../../utils/validatePayload';
import { logger } from '../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const { entityManager: em, judge } = req;

  try {
    const { errorHandled, data } = validatePayload({
      req,
      res,
      schema: Schema.criteriaJudgingSubmission.post,
    });

    if (errorHandled) return;

    const { criteriaJudgingSession: criteriaJudgingSessionId, project: projectId, scores } = data;

    // Load only the single judging session we're looking for
    const [criteriaJudgingSession] = await judge.criteriaJudgingSessions.load({
      where: { id: criteriaJudgingSessionId },
      populate: ['criteriaList'],
    });

    if (!criteriaJudgingSession) {
      res.sendStatus(404);
      return;
    }

    // Load only the single project referenced in the submission
    const [project] = await criteriaJudgingSession.projects.load({ where: { id: projectId } });

    if (!project) {
      res.status(400).send('Project does not belong to judging session');
      return;
    }

    // Judge has access to session, project is relevant to session... create submission

    const criteriaJudgingSubmission = new CriteriaJudgingSubmission({
      judge: ref(judge),
      criteriaJudgingSession: ref(criteriaJudgingSession),
      project: ref(project),
    });

    const criteriaList = criteriaJudgingSession.criteriaList.getItems();

    for (let i = 0; i < scores.length; i += 1) {
      const { criteria: criteriaId, score } = scores[i] as z.infer<
        typeof Schema.criteriaScore.criteriaScore
      >;
      const criteria = criteriaList.find((c) => c.id === criteriaId);
      if (!criteria) {
        res.status(400).send(`Unknown criteria: ${criteriaId}`);
        return;
      }

      if (score < criteria.scaleMin || score > criteria.scaleMax) {
        // Score is outside the range of acceptable values
        res.status(400).send(`Invalid score (for criteria ${criteria.title}): ${score} `);
        return;
      }

      const criteriaScore = new CriteriaScore({
        submission: ref(criteriaJudgingSubmission),
        criteria: ref(criteria),
        score,
      });
      criteriaJudgingSubmission.scores.add(criteriaScore);
    }

    await em.persistAndFlush(criteriaJudgingSubmission);

    res.sendStatus(201);
  } catch (error) {
    if ((error as DriverException).code === '23505') {
      // Unique constraint violation
      res.sendStatus(409);
      return;
    }

    logger.error('Unable to create criteria judging submission', error);
    res.sendStatus(500);
  }
};
