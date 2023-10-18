import { Entity, EntityDTO, Unique, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { Node } from './Node';
import { Criteria } from './Criteria';
import { ConstructorValues } from '../types/ConstructorValues';
import { CriteriaJudgingSubmission } from './CriteriaJudgingSubmission';

export type CriteriaScoreDTO = EntityDTO<CriteriaScore>;
type ConstructorArgs = ConstructorValues<CriteriaScore>;

@Entity()
@Unique({ properties: ['submission', 'criteria'] })
export class CriteriaScore extends Node<CriteriaScore> {
  @ManyToOne({ entity: () => CriteriaJudgingSubmission, ref: true })
  submission: Ref<CriteriaJudgingSubmission>;

  @ManyToOne({ entity: () => Criteria, ref: true })
  criteria: Ref<Criteria>;

  @Property({ columnType: 'int' })
  score: number;

  constructor({ submission, criteria, score }: ConstructorArgs) {
    super();

    this.submission = submission;
    this.criteria = criteria;
    this.score = score;
  }
}
