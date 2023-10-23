/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { Project, ExpoJudgingSession, ExpoJudgingVote, Judge } from '../../src';
import { createSeededRandomGenerator } from '../utils';

const randomVote = ((seed) => {
  const rng = createSeededRandomGenerator(seed);
  return () => {
    const n = rng();
    return n > 0.5;
  };
})('1');

const shuffle = <T>(array: T[], seed: string | undefined): T[] => {
  const rng = createSeededRandomGenerator(seed);
  let currentIndex = array.length;
  let randomIndex;
  const newArray: T[] = [...array];
  // While there remain elements to shuffle:
  while (currentIndex !== 0) {
    // Pick a remaining element:
    randomIndex = Math.floor(rng() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex] as T,
      newArray[currentIndex] as T,
    ];
  }
  return newArray;
};

export class ExpoJudgingVoteSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        const projects = shuffle(await em.find(Project, {}), '1');
        const judges = await em.find(Judge, { id: { $ne: '1' } });
        for (let i = 0; i < judges.length; i += 1) {
          const judge = judges[i];
          const expoJudgingSession = await em.findOne(ExpoJudgingSession, { id: '1' });

          const currentProject = projects.pop()?.toReference();
          const previousProject = projects.pop()?.toReference();

          if (!currentProject || !previousProject) return; // no projects to vote on
          if (!judge || !expoJudgingSession) return;

          await em.populate(judge, ['expoJudgingSessionContexts']);
          const vote = new ExpoJudgingVote({
            judge: judge.toReference(),
            previousProject,
            currentProject,
            currentProjectChosen: randomVote(),
            judgingSession: expoJudgingSession.toReference(),
          });
          em.persist(vote);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e, 'Failed to create votes');
      }
    }
  };
}
