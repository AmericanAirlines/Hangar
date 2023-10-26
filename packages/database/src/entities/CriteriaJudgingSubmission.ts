/* istanbul ignore file */
import { Entity, EntityDTO, Unique, ManyToOne, Ref, OneToMany, Collection } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';
import { Judge } from './Judge';
import { Project } from './Project';
import { CriteriaJudgingSession } from './CriteriaJudgingSession';
import { CriteriaScore } from './CriteriaScore';

export type CriteriaJudgingSubmissionDTO = EntityDTO<CriteriaJudgingSubmission>;
type ConstructorArgs = ConstructorValues<CriteriaJudgingSubmission, 'scores'>;

@Entity()
@Unique({ properties: ['judge', 'criteriaJudgingSession', 'project'] })
export class CriteriaJudgingSubmission extends Node<CriteriaJudgingSubmission> {
  @ManyToOne({ entity: () => Judge, ref: true })
  judge: Ref<Judge>;

  @ManyToOne({ entity: () => CriteriaJudgingSession, ref: true })
  criteriaJudgingSession: Ref<CriteriaJudgingSession>;

  @ManyToOne({ entity: () => Project, ref: true })
  project: Ref<Project>;

  @OneToMany({ entity: () => CriteriaScore, mappedBy: (score) => score.submission })
  scores = new Collection<CriteriaScore>(this);

  constructor({ judge, criteriaJudgingSession, project }: ConstructorArgs) {
    super();

    this.judge = judge;
    this.criteriaJudgingSession = criteriaJudgingSession;
    this.project = project;
  }
}
