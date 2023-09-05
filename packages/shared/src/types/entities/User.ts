import { UserDTO } from '@hangar/database';
import { SerializedNode, Node } from './Node';

export type User = Node<UserDTO>;
export type SerializedUser = SerializedNode<User>;
