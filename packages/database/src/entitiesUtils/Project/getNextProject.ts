import { EntityManager, FilterQuery, FindOneOptions, LockMode } from '@mikro-orm/postgresql';
import { Project } from '../../entities/Project';

/**
 * Fetches the next available project and appropriately increments related counters
 * @param args
 * @returns A {@link Project} if one could be found
 */
export const getNextProject = async ({
  excludedProjectIds = [],
  entityManager,
}: {
  excludedProjectIds: string[];
  entityManager: EntityManager;
}): Promise<Project | null> => {
  // Don't visit teams the judge has already visited or skipped
  const query: FilterQuery<Project> = excludedProjectIds.length
    ? { id: { $nin: excludedProjectIds } }
    : {};

  // Find the team with the fewest judgeVisits and the lowest activeJudgeCount
  const queryOptions: FindOneOptions<Project> = {
    orderBy: { judgeVisits: 'ASC', activeJudgeCount: 'ASC' },
    lockMode: LockMode.PESSIMISTIC_WRITE,
  };

  let project: Project | null = null;
  await entityManager.transactional(async (em) => {
    project = await em.findOne(Project, query, queryOptions);
    if (project) {
      project.activeJudgeCount += 1;
      project.judgeVisits += 1;
      em.persist(project);
    }
  });
  return project;
};
