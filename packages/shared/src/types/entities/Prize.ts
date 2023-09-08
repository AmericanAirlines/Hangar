import { PrizeDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type Prize = Node<PrizeDTO>;
export type SerializedPrize = SerializedNode<Prize>;
