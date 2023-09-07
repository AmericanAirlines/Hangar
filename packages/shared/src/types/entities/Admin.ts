import { AdminDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type Admin = Node<AdminDTO>;
export type SerializedAdmin = SerializedNode<AdminDTO>;
