import { Entity, EntityDTO, OneToOne, Unique, Ref, ManyToOne } from '@mikro-orm/core';
import { Judge } from './Judge';
import { Project } from './Project';
import { ExpoJudgingSession } from './ExpoJudgingSession';
import { Node } from './Node';

export type ExpoJudgingSessionContextDTO = EntityDTO<ExpoJudgingSessionContext>;
type ConstructorArgs = Pick<ExpoJudgingSessionContext, 'judge' | 'expoJudgingSession'>;

@Entity()
@Unique({ properties: ['judge', 'expoJudgingSession'] })
export class ExpoJudgingSessionContext extends Node<ExpoJudgingSessionContext> {
  @ManyToOne({ entity: () => Judge, ref: true })
  judge: Ref<Judge>;

  @OneToOne({ entity: () => ExpoJudgingSession, ref: true, unique: false })
  expoJudgingSession: Ref<ExpoJudgingSession>;

  @OneToOne({ entity: () => Project, nullable: true, ref: true, unique: false })
  currentProject?: Ref<Project>;

  @OneToOne({ entity: () => Project, nullable: true, ref: true, unique: false })
  previousProject?: Ref<Project>;

  constructor({ judge, expoJudgingSession }: ConstructorArgs) {
    super();

    this.judge = judge;
    this.expoJudgingSession = expoJudgingSession;
  }
}
