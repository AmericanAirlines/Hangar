/* eslint-disable class-methods-use-this */
import { EntityManager, Loaded, ref } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { ExpoJudgingSession, ExpoJudgingVote, Judge, ExpoJudgingSessionContext } from '../../src';
import { createSeededRandomGenerator } from '../utils';
import seedrandom from 'seedrandom';

const randomVote = ((seed) => {
  const rng = createSeededRandomGenerator(seed);
  return () => {
    const n = rng();
    return n > 0.5;
  };
})('1');

const rnd = seedrandom('2');
const randomVotes = seedrandom('vote');

export class ExpoJudgingVoteSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        const query = env.primaryUserIsJudge ? { id: { $ne: '1' } } : {}
        // const projects = shuffle(await em.find(Project, {}), '1');
        const unsortedJudges = await em.find(Judge, query);
        let judges = unsortedJudges.sort((a, b) => randomVote() ? -1 : 1);
        const expoJudgingSession = await em.findOneOrFail(ExpoJudgingSession, { id: '1' });
        await em.populate(judges, ['expoJudgingSessionContexts']);



        // setup all judges on their first project with .continue()
        // for (let i=0;i<judges.length;i++){
        //   const judge = judges[i] as Judge
        //   await judge.continue({expoJudgingSession,entityManager:em});
        //   em.persist(judge)
        //   em.flush()
        // }
        // for each judge, .continue() at some time in the future
        // when the N
        
        const getNextProject = async (judge: Judge, votes: number) => {
          // console.log(judge.id,votes)
          // wrap timeout in a promise so we can await it
          if (votes > 5) {
            return
          }
          if (!judge.expoJudgingSessionContexts[0]) {
            return
          }
          // const ejsc = judge.expoJudgingSessionContexts[0];
          // const { currentProject, previousProject } = await ejsc.populate(['currentProject', 'previousProject']);
          // const [cLen, pLen] = [currentProject?.$.name.length, previousProject?.$.name.length]
          // console.log([currentProject?.$.id, previousProject?.$.id])
          // if (currentProject?.$.id === previousProject?.$.id) console.log('error')
          await judge.vote({
            entityManager: em.fork(),
            currentProjectChosen: randomVotes() > 0.5,
            expoJudgingSession,
          });

          // await em.persistAndFlush(judge)
          // await em.flush()
          // wait a random amount of time
          await new Promise((resolve) => {setTimeout(resolve, rnd() * 1000 + 1500);});
          await getNextProject(judge, votes + 1)
        }

        let all=[]
        for (let i=0;i<judges.length;i++){
          const judge = judges[i] as Judge
          await judge.continue({expoJudgingSession,entityManager:em});
          await judge.continue({expoJudgingSession,entityManager:em});
          all.push(getNextProject(judge,0))
        }

        await Promise.all(all)
        return
        
        // console.log(1)
        // await (new Promise((resolve)=>{
        //   console.log(2)
        //   setTimeout(()=>{
        //     console.log(3)
        //     resolve(0)
        //   },10000)
        // }))
        // console.log(4)
        

        // for (let i=0;i<judges.length;i++){
          const judge = judges[0] as Judge

          await judge.continue({expoJudgingSession,entityManager:em});
          await judge.continue({expoJudgingSession,entityManager:em});

          await em.refresh(judge.expoJudgingSessionContexts[0] as any);
          
          const { currentProject , previousProject } = judge.expoJudgingSessionContexts[0] as any
          const [cLen , pLen] = [ currentProject.entity.name.length , previousProject.entity.name.length ]
          
          await judge.vote({
            entityManager:em ,
            currentProjectChosen: cLen===Math.min( cLen , pLen ) ,
            expoJudgingSession ,
          })
          console.log(currentProject.entity.name,previousProject.entity.name)
          em.persist(judge)
          em.flush()

          await judge.continue({expoJudgingSession,entityManager:em});
        
        // }
        
        // await em.refresh(judge.expoJudgingSessionContexts[0] as any);
        return

        await judges[0]?.continue({expoJudgingSession:undefined as any,entityManager:em})
        if(judges[0]?.expoJudgingSessionContexts[0]) {
          // console.log('refresh')
          await em.refresh(judges[0]?.expoJudgingSessionContexts[0])
          // console.log('a')
        }
        // console.log('b')
        // console.log(judges[0]?.expoJudgingSessionContexts.getItems())
        return
        for (let i = 0; i < judges.length; i += 1) {
          const judge = judges[i];

          const currentProject = projects.pop();
          const previousProject = projects.pop();

          if (!currentProject || !previousProject) return; // no projects to vote on
          if (!judge || !expoJudgingSession) return;

          const vote = new ExpoJudgingVote({
            judge: ref(judge),
            previousProject: ref(previousProject),
            currentProject: ref(currentProject),
            currentProjectChosen: randomVote(),
            judgingSession: ref(expoJudgingSession),
          });
          em.persist(vote);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to create votes: ', e);
      }
    }
  };
}
