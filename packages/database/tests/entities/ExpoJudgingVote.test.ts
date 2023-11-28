import seedrandom from 'seedrandom';
import { Ref } from '@mikro-orm/core';
import { ExpoJudgingVote, Project } from '../../src';
import { createMockEntityManager } from '../testUtils/createMockEntityManager';

const random = seedrandom('high accuracy pls');

type CreateMockVotesMatrix = {
  numProjects: number;
  numJudges: number;
  percentOfVotesCastVariations: number[];
  percentOfHumanErrorVariations: number[];
};

const compareProjects = (projectA: Ref<Project>, projectB: Ref<Project>) =>
  Number(projectB.id) - Number(projectA.id);

type CreateMockVotesArgs = {
  numProjects: number;
  numJudges: number;
  percentOfVotesCast: number;
  percentOfHumanError: number;
};

const createMockVoteData = ({
  numProjects,
  numJudges,
  percentOfVotesCast,
  percentOfHumanError,
}: CreateMockVotesArgs) => {
  const projects = Array(numProjects)
    .fill(undefined)
    .map((_, i) => ({ id: i } as any as Ref<Project>));
  const projectsSortedByExpectedScore = [...projects].sort(compareProjects);
  const judgeIds = Array(numJudges)
    .fill(undefined)
    .map((_, i) => i);
  const votes: Partial<ExpoJudgingVote>[] = [];
  const countOfVotesCastPerProject: { [id: string]: number } = {};

  const numVotesToCastPerJudge = Math.floor((numProjects - 1) * percentOfVotesCast);

  // Iterate over all the judges and create votes for each one
  for (let i = 0; i < judgeIds.length; i += 1) {
    // Randomly shuffle all projects for each judge but prioritize projects with fewer votes
    const shuffledProjectIds = [...projects]
      .sort(() => random() - 0.5)
      .sort(
        (a, b) => (countOfVotesCastPerProject[a.id] ?? 0) - (countOfVotesCastPerProject[b.id] ?? 0),
      );

    for (let j = 0; j < numVotesToCastPerJudge - 1; j += 1) {
      const currentProject = shuffledProjectIds[j] as (typeof shuffledProjectIds)[0];
      const previousProject = shuffledProjectIds[j + 1] as (typeof shuffledProjectIds)[0];
      const currentProjectChosen =
        projectsSortedByExpectedScore.indexOf(currentProject) <
        projectsSortedByExpectedScore.indexOf(previousProject);
      countOfVotesCastPerProject[currentProject.id] =
        countOfVotesCastPerProject[currentProject.id] ?? 0 + 1;
      countOfVotesCastPerProject[previousProject.id] =
        countOfVotesCastPerProject[previousProject.id] ?? 0 + 1;

      votes.push({
        currentProject,
        previousProject,
        currentProjectChosen,
      });
    }
  }

  // Add a human error
  const numVotesToDistort = Math.floor(percentOfHumanError * votes.length);
  for (let j = 0; j < numVotesToDistort; j += 1) {
    // Flip the vote for to make it wrong
    (votes[j] as ExpoJudgingVote).currentProjectChosen = !(votes[j] as ExpoJudgingVote)
      .currentProjectChosen;
  }

  return {
    projects,
    votes: votes as ExpoJudgingVote[],
  };
};

describe('ExpoJudgingVote', () => {
  describe('tabulate', () => {
    const accuracyStrings: string[] = [];
    let accuracySum = 0;
    const testCases: CreateMockVotesArgs[] = [];
    // Create test cases
    const percentOfHumanErrorVariations = [0, 0.1, 0.2, 0.3];
    // prettier-ignore
    const projectAndJudgeCountPairings: CreateMockVotesMatrix[] = [
      { numProjects: 5, numJudges: 5, percentOfVotesCastVariations: [1], percentOfHumanErrorVariations },
      { numProjects: 10, numJudges: 5, percentOfVotesCastVariations: [1], percentOfHumanErrorVariations, },
      { numProjects: 10, numJudges: 10, percentOfVotesCastVariations: [0.8, 1], percentOfHumanErrorVariations, },
      { numProjects: 20, numJudges: 10, percentOfVotesCastVariations: [0.8, 1], percentOfHumanErrorVariations, },
      { numProjects: 20, numJudges: 20, percentOfVotesCastVariations: [0.5, 0.7], percentOfHumanErrorVariations, },
      { numProjects: 30, numJudges: 10, percentOfVotesCastVariations: [0.6, 0.8], percentOfHumanErrorVariations, },
      { numProjects: 30, numJudges: 20, percentOfVotesCastVariations: [0.5, 0.7], percentOfHumanErrorVariations, },
      { numProjects: 35, numJudges: 15, percentOfVotesCastVariations: [0.5, 0.6], percentOfHumanErrorVariations, },
      { numProjects: 30, numJudges: 30, percentOfVotesCastVariations: [0.3, 0.5], percentOfHumanErrorVariations, },
      { numProjects: 40, numJudges: 20, percentOfVotesCastVariations: [0.3, 0.4], percentOfHumanErrorVariations, },
      { numProjects: 40, numJudges: 30, percentOfVotesCastVariations: [0.2, 0.4], percentOfHumanErrorVariations, },
      { numProjects: 50, numJudges: 30, percentOfVotesCastVariations: [0.25, 0.3], percentOfHumanErrorVariations, },
    ];

    for (
      let projectsIndex = 0;
      projectsIndex < projectAndJudgeCountPairings.length;
      projectsIndex += 1
    ) {
      const {
        numProjects,
        numJudges,
        percentOfVotesCastVariations: votesCastVariations,
        percentOfHumanErrorVariations: errorVariations,
      } = projectAndJudgeCountPairings[projectsIndex] as CreateMockVotesMatrix;
      for (
        let percentOfVotesCastIndex = 0;
        percentOfVotesCastIndex < votesCastVariations.length;
        percentOfVotesCastIndex += 1
      ) {
        const percentOfVotesCast = votesCastVariations[percentOfVotesCastIndex] as number;
        for (
          let percentOfHumanErrorIndex = 0;
          percentOfHumanErrorIndex < errorVariations.length;
          percentOfHumanErrorIndex += 1
        ) {
          const percentOfHumanError = errorVariations[percentOfHumanErrorIndex] as number;
          testCases.push({
            numProjects,
            numJudges,
            percentOfVotesCast,
            percentOfHumanError,
          });
        }
      }
    }

    afterAll(() => {
      // Evaluate results
      const accuracy = accuracySum / testCases.length;
      // eslint-disable-next-line no-console
      console.log(
        `
${accuracyStrings.join('\n')}

Overall accuracy: ${(accuracy * 100).toFixed(2)}% across ${testCases.length} test cases
        `,
      );
    });

    it.each(testCases)('should tabulate votes', async (config) => {
      const { projects, votes } = createMockVoteData(config);
      const em = createMockEntityManager();
      const mockExpoJudgingSession = {
        projects: {
          load: jest.fn().mockResolvedValue({ getItems: () => projects }),
        },
      };
      em.find.mockResolvedValue(votes);

      try {
        const results = await ExpoJudgingVote.tabulate({
          entityManager: em as any,
          expoJudgingSession: mockExpoJudgingSession as any,
        });

        const expectedOrder = [...projects].sort(compareProjects).map((team) => team.id);
        const scoredOrder = results.map((score) => score.id);

        let errorDistanceSum = 0;
        for (let i = 0; i < expectedOrder.length; i += 1) {
          if (expectedOrder[i] !== scoredOrder[i]) {
            errorDistanceSum += Math.abs(expectedOrder.indexOf(scoredOrder[i] as string) - i);
          }
        }

        // Calculate the average error distance; that is,
        // the average distance a given project is from it's correct position
        const avgErrorDistance = errorDistanceSum / expectedOrder.length;

        // Calculate the accuracy; that is, the average distance a given project
        // is from it's correct position in relation to the size of the list
        const accuracy = 1 - avgErrorDistance / expectedOrder.length;
        accuracySum += accuracy;
        accuracyStrings.push(
          `Accuracy: ${(accuracy * 100).toFixed(2)}% for test case: ${JSON.stringify(config)}`,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        throw new Error(
          `Failed to tabulate votes for test case: ${JSON.stringify(config)}: ${error}`,
        );
      }
    });
  });
});
