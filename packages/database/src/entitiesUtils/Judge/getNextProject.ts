import seedrandom from 'seedrandom';
import { EntityManager } from '@mikro-orm/postgresql';
import { Project } from '../../entities/Project';
import { ExpoJudgingVote } from '../../entities/ExpoJudgingVote';
import { ExpoJudgingSession } from '../../entities/ExpoJudgingSession';
import { Judge } from '../../entities/Judge';

type GetNextProjectArgs = {
  judge: Judge;
  expoJudgingSession: ExpoJudgingSession;
  excludedProjectIds: string[];
  entityManager: EntityManager;
};

/**
 * Fetches the next available project and appropriately increments related counters
 *
 * The algorithm for selecting the next project is as follows:
 * 1. Fetch all projects that the judge has not yet visited or skipped
 * 2. Sort projects randomly (deterministically based on the judge's ID)
 * 3. Sort projects by the number of times they have been visited
 * 4. Sort projects by the number of active judges if they have the same number of visits
 * 5. Load and return the first project from that sorted list
 * @param args {@link GetNextProjectArgs}
 * @returns A {@link Project} if one could be found
 */
export const getNextProject = async ({
  judge,
  expoJudgingSession,
  excludedProjectIds,
  entityManager,
}: GetNextProjectArgs): Promise<Project | null> => {
  const [projects, votesForSession] = await Promise.all([
    entityManager.find(
      Project,
      { id: { $nin: excludedProjectIds } }, // Don't visit projects the judge has already visited or skipped
      { fields: ['id', 'activeJudgeCount'] }, // Only pull the fields we need
    ),
    // Fetch all relevant votes to figure out which teams have been visited the most
    entityManager.find(
      ExpoJudgingVote,
      { judgingSession: expoJudgingSession.id },
      { fields: ['currentProject.id', 'previousProject.id'] },
    ),
  ]);

  if (projects.length === 0) {
    return null;
  }

  // Iterate over the votes and add a counter for each project
  const voteCounts: { [id: string]: number } = {};
  for (let i = 0; i < votesForSession.length; i += 1) {
    const vote = votesForSession[i] as (typeof votesForSession)[0];
    if (vote.currentProject) {
      voteCounts[vote.currentProject.$.id] = (voteCounts[vote.currentProject.$.id] ?? 0) + 1;
    }
    if (vote.previousProject) {
      voteCounts[vote.previousProject.$.id] = (voteCounts[vote.previousProject.$.id] ?? 0) + 1;
    }
  }

  // Create a deterministic random number generator based on the judge's ID that will always generate the same value for each project
  const genRandom = (projectId: string) => seedrandom(`${judge.id}-${projectId}`);

  // TIE BREAKER: Shuffle the projects into the exact same order but missing the excluded projects
  const shuffledProjects = projects.sort((a, b) => genRandom(a.id)() - genRandom(b.id)());

  const sortedProjects = shuffledProjects.sort((a, b) => {
    const aCount = voteCounts[a.id] ?? 0;
    const bCount = voteCounts[b.id] ?? 0;

    // Consider the max possible votes per team by evaluating the past votes
    // and the potential votes of the current judges
    return a.activeJudgeCount + aCount - (b.activeJudgeCount + bCount);
  });

  const nextProject = sortedProjects[0] as (typeof sortedProjects)[0]; // Assert the type; it WILL exist due to the empty array check above

  // Load the entire project instead of just the fields we needed
  const loadedProject = await entityManager.findOneOrFail(Project, {
    id: nextProject.id,
  });

  return loadedProject;
};
