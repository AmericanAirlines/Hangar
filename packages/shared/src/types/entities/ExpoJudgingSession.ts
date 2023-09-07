import { ExpoJudgingSessionDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type ExpoJudgingSession = Node<ExpoJudgingSessionDTO>;
export type SerializedExpoJudgingSession = SerializedNode<ExpoJudgingSession>;
