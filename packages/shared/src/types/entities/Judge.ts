import { JudgeDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type Judge = Node<JudgeDTO>;
export type SerializedJudge = SerializedNode<Judge>;
