/* eslint-disable class-methods-use-this */
import { EntityManager, Loaded, ref } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { Project, ExpoJudgingSession, ExpoJudgingVote, Judge, ExpoJudgingSessionContext } from '../../src';
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
        const query = env.primaryUserIsJudge ? { id: { $ne: '1' } } : {}
        // const projects = shuffle(await em.find(Project, {}), '1');
        let judges = shuffle(await em.find(Judge, query), '1');
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
        
        const getNextProject = async (judge:Judge,votes:number)=>{
          // console.log(judge.id,votes)
          // wrap timeout in a promise so we can await it
          return new Promise(async (resolve)=>{
            // wait a random amount of time
            setTimeout(async ()=>{
              if (votes>5) {
                resolve(0)
                return
              }
              if (!judge.expoJudgingSessionContexts[0]) {
                resolve(0)
                return
              }
              const ejsc = judge.expoJudgingSessionContexts[0] as Loaded<ExpoJudgingSessionContext, 'currentProject' | 'previousProject'>;
              await em.refresh(ejsc)
              const { currentProject , previousProject } = ejsc
              const [cLen , pLen] = [ currentProject?.$.name.length , previousProject?.$.name.length ]
              console.log([currentProject?.$.id,previousProject?.$.id])
              if(currentProject?.$.id===previousProject?.$.id)
              console.log('error')
              await judge.vote({
                entityManager:em.fork() ,
                currentProjectChosen: cLen===Math.min( cLen??0 , pLen??0 ) ,
                expoJudgingSession ,
              })

              await em.persistAndFlush(judge)
              // await em.flush()
              await getNextProject(judge,votes+1)
              resolve(0)
            },Math.random()*5000+1000)
          })
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
