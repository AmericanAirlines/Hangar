import { Schema } from '@hangar/shared';
import { Criteria, CriteriaJudgingSession, Project } from '@hangar/database';
import { z } from 'zod';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';

export const post = async (req: Request, res: Response) => {
  const { entityManager, admin } = req;
  try {
    const { errorHandled, data } = validatePayload({
      req,
      res,
      schema: Schema.criteriaJudgingSession.post,
    });
    if (errorHandled) {
      return;
    }

    const { title, description, criteriaList: criteriaListToCreate } = data;

    const cjs = new CriteriaJudgingSession({ title, description, createdBy: admin.user });

    // TODO: allow providing this via the UI
    const projects = await entityManager.find(Project, {});
    cjs.projects.set(projects);

    await entityManager.transactional(async (em) => {
      const criteriaList: Criteria[] = [];

      for (let i = 0; i < criteriaListToCreate.length; i += 1) {
        const criteria = criteriaListToCreate[i] as z.infer<typeof Schema.criteria.criteria>;
        criteriaList.push(new Criteria(criteria));
      }

      cjs.criteriaList.set(criteriaList);

      await em.persistAndFlush(cjs);
    });

    cjs.projects.populated(false);
    res.send(cjs);
  } catch (error) {
    logger.error('Failed to create Criteria Judging Session', error);
    res.sendStatus(500);
  }
};
