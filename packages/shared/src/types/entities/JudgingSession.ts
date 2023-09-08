import { JudgingSessionDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type JudgingSession = Node<JudgingSessionDTO>;
export type SerializedJudgingSession = SerializedNode<JudgingSession>;
