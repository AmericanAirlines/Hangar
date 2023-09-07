import { ExpoJudgingVoteDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type ExpoJudgingVote = Node<ExpoJudgingVoteDTO>;
export type SerializedExpoJudgingVote = SerializedNode<ExpoJudgingVote>;
