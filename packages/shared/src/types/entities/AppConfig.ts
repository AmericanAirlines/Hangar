import { AppConfigDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type AppConfig = Node<AppConfigDTO>;
export type SerializedAppConfig = SerializedNode<AppConfig>;
