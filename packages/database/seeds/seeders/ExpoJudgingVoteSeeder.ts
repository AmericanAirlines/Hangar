/* eslint-disable class-methods-use-this */
import seedrandom from 'seedrandom';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { ExpoJudgingSession, Judge, Project } from '../../src';

const randomJudgeOrder = seedrandom('judgeOrder');
const realisticMaxVotesCastPerJudge = 15; // 45 mins, 3 mins per team

type ExecuteJudgingArgs = {
  em: EntityManager;
  judge: Judge;
  expoJudgingSession: ExpoJudgingSession;
  maxVotesToCast: number;
  numVotes?: number;
};
const executeJudging = async ({
  em,
  judge,
  expoJudgingSession,
  maxVotesToCast,
  numVotes = 0,
}: ExecuteJudgingArgs) => {
  if (numVotes >= maxVotesToCast) {
    // Enough votes have been cast; bail for this judge
    return;
  }

  await em.refresh(judge, { populate: ['expoJudgingSessionContexts'] });
  const previousId = Number(judge.expoJudgingSessionContexts[0]?.previousProject?.id) ?? 0;
  const currentId = Number(judge.expoJudgingSessionContexts[0]?.currentProject?.id) ?? 0;
  await judge.vote({
    entityManager: em.fork(),
    currentProjectChosen: currentId > previousId,
    expoJudgingSession,
  });
};

export class ExpoJudgingVoteSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        const query = env.primaryUserIsJudge ? { id: { $ne: '1' } } : {};
        const [allJudges, expoJudgingSession] = await Promise.all([
          em.find(Judge, query, { populate: ['expoJudgingSessionContexts'] }),
          em.findOneOrFail(ExpoJudgingSession, { id: '1' }),
        ]);

        const judges = allJudges.sort(() => (randomJudgeOrder() ? -1 : 1)); // Shuffle the judges into random order

        const numProjects = await em.count(Project, {});
        const maxVotesToCast = Math.min(realisticMaxVotesCastPerJudge, numProjects - 1);
        const numContinuesNeededPerJudge = 2;
        const numIterations = maxVotesToCast + numContinuesNeededPerJudge; // Add two to account for initial continue calls
        for (let i = 0; i < numIterations; i += 1) {
          const shuffledJudges = judges.sort(() => (randomJudgeOrder() ? -1 : 1)); // Shuffle the judges into random order;
          for (let j = 0; j < judges.length; j += 1) {
            const judge = shuffledJudges[j] as Judge;
            if (i < numContinuesNeededPerJudge) {
              // Still in the continue phase
              await judge.continue({ expoJudgingSession, entityManager: em });
            } else {
              // Judge is ready to vote
              await executeJudging({ em: em.fork(), judge, expoJudgingSession, maxVotesToCast });
            }
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to seed ExpoJudgingSessionVotes:', error);
      }
    }
  };
}
