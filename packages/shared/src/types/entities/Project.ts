import { ProjectDTO } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type Project = Node<ProjectDTO>;
export type SerializedProject = SerializedNode<Project>;
