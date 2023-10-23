import { Collection, Entity, EntityDTO, ManyToMany, Property } from '@mikro-orm/core';
import { JudgingSession } from './JudgingSession';
import { Criteria } from './Criteria';
import { ConstructorValues } from '../types/ConstructorValues';

export type CriteriaJudgingSessionDTO = EntityDTO<CriteriaJudgingSession>;
type ConstructorArgs = ConstructorValues<
  CriteriaJudgingSession,
  'criteriaList' | 'projects' | 'inviteCode'
>;

@Entity()
export class CriteriaJudgingSession extends JudgingSession {
  @Property({ columnType: 'text' })
  title: string;

  @Property({ columnType: 'text' })
  description: string;

  @ManyToMany({ entity: () => Criteria })
  criteriaList = new Collection<Criteria>(this);

  constructor({ title, description, createdBy }: ConstructorArgs) {
    super({ createdBy });

    this.title = title;
    this.description = description;
  }
}
