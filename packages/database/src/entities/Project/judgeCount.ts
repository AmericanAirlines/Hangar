import { EntityManager as em } from '@mikro-orm/postgresql'
import { Project } from './Project';

/* istanbul ignore next */
export const decrementActiveJudgeCount = async ({project,entityManager}:{project: Project, entityManager:em}): Promise<void> => {
  await entityManager.createQueryBuilder(Project)
    .update({ activeJudgeCount: project.activeJudgeCount - 1 })
    // .update()
    // .set({ activeJudgeCount: () => '"project"."activeJudgeCount" - 1' })
    .where({ id: project.id })
    // .where('"project"."id" = :id AND "project"."activeJudgeCount" > 0', { id: project.id })
    .execute();
}

/* istanbul ignore next */
export const incrementJudgeVisits = async ({project,entityManager}:{project: Project, entityManager:em}): Promise<void> => {
  await entityManager.createQueryBuilder('project')
    .update({ judgeVisits: project.judgeVisits - 1 })
    // .update()
    // .set({ judgeVisits: () => '"project"."judgeVisits" + 1' })
    .where({ id: project.id })
    // .where('"project"."id" = :id', { id: this.id })
    .execute();
}