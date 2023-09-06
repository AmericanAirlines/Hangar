import { EntityManager, Ref } from '@mikro-orm/postgresql';
import { Project } from '../entities/Project';

export const getNextAvailableProjectExcludingProjects = async ({
  excludedProjectIds = [],
  entityManager,
}: {
  excludedProjectIds: Ref<Project>[];
  entityManager: EntityManager;
}): Promise<Project | undefined> => {
  let project: Project | null;
  let retries = 5;
  /* eslint-disable no-await-in-loop */
  const query: object = excludedProjectIds.length ? { id: { $nin: excludedProjectIds } } : {};
  const queryOptions = { orderBy: { activeJudgeCount: 'ASC', judgeVisits: 'ASC' } };
  do {
    project = await entityManager.findOne(Project, query, queryOptions);

    if (project) {
      const result = await Project.updateSelectedProject({ project, entityManager });
      project = await entityManager.findOne(Project, query, queryOptions);

      if (result.affectedRows > 0) {
        // We found a project and assigned the judge correctly; return it
        return project ?? undefined;
      }
    } else {
      // No projects remaining
      return undefined;
    }

    // We picked a project that we couldn't modify; wait briefly and then try again
    await new Promise((resolve) => {
      setTimeout(resolve, Math.random() * 500);
    });

    retries -= 1;
  } while (retries > 0);

  throw new Error('Unable to retrieve a project due to concurrency issues');
};
