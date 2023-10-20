// @ts-nocheck
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { Project, ExpoJudgingSession, ExpoJudgingSessionContext, ExpoJudgingVote, Judge } from '../../src';

const random = (seed) => ( function(seed) {
  return () => {
      var n = Math.sin(seed++);
      return Math.floor(n - Math.floor(n))
  };
})(seed);
const randomVote = ((seed) => {
  const rng = random(seed);
  return () => {
    const n = rng();
    return n > 0.5
  };
})(1)

const shuffle = (array, seed) => {
  const rng = random(seed);
  let currentIndex = array.length,  randomIndex;
  const newArray = [...array];
  // While there remain elements to shuffle:
  while (currentIndex !== 0) {
    // Pick a remaining element:
    randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

export class ExpoJudgingVoteSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try{
        const projects = shuffle( await em.find(Project, {}), 1 );
        const judges = await em.find(Judge, {id:{$ne:'1'}});
        for (let i = 0; i < judges.length; i++) {
          const judge = judges[i];
          const expoJudgingSession = await em.findOne(ExpoJudgingSession, { id: '1' });
        
          const currentProject = projects.pop();
          const previousProject = projects.pop();
          
          if (!currentProject || !previousProject) return; // no projects to vote on
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
      }
      catch(e){
        console.log(e)
      }
    }
  };
}
