import { CriteriaJudgingSessionDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type CriteriaJudgingSession = Node<CriteriaJudgingSessionDTO>;
export type SerializedCriteriaJudgingSession = SerializedNode<CriteriaJudgingSession>;
