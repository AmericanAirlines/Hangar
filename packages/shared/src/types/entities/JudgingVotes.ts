import { JudgingVoteDTO } from '@hangar/database';
import { SerializedNode, Node } from './Node';

export type JudgingVote = Node<JudgingVoteDTO>;
export type SerializedJudgingVote = SerializedNode<JudgingVote>;
