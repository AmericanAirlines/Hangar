import { Collection, Entity, EntityDTO, ManyToMany } from '@mikro-orm/core';
import { JudgingSession } from './JudgingSession';
import { Criteria } from './Criteria';
import { Project } from './Project';

export type CriteriaJudgingSessionDTO = EntityDTO<CriteriaJudgingSession>;

@Entity()
export class CriteriaJudgingSession extends JudgingSession {
  @ManyToMany({ entity: () => Criteria })
  criteriaList = new Collection<Criteria>(this);

  @ManyToMany({ entity: () => Project })
  projects = new Collection<Project>(this);
}
