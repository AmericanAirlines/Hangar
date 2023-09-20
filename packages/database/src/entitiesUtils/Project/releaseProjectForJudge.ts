import { EntityManager, LockMode } from '@mikro-orm/core';
import { Project } from '../../entities/Project';

export const releaseProjectFromJudge = async ({
  entityManager,
  project,
}: {
  entityManager: EntityManager;
  project: Project;
}): Promise<void> => {
  await entityManager.transactional(async (em) => {
    const lockedProject = await em.findOne(
      Project,
      { id: project.id },
      { lockMode: LockMode.PESSIMISTIC_WRITE },
    );
    if (lockedProject) {
      lockedProject.activeJudgeCount -= 1;
      em.persist(lockedProject);
    }
  });
};
