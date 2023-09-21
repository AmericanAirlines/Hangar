import {
  EntityManager,
  FilterQuery,
  FindOneOptions,
  LockMode,
  QueryOrder,
} from '@mikro-orm/postgresql';
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
  const query: FilterQuery<Project> = { id: { $nin: excludedProjectIds } };

  // Find the team with the fewest judgeVisits and the lowest activeJudgeCount
  const queryOptions: FindOneOptions<Project> = {
    orderBy: { judgeVisits: QueryOrder.ASC, activeJudgeCount: QueryOrder.ASC },
    lockMode: LockMode.PESSIMISTIC_READ, // Don't skip locked projects
  };

  const project = await entityManager.findOne(Project, query, queryOptions);
  return project;
};
