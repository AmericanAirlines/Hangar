import { ProjectDTO, ProjectDTOWithInviteCode } from '@hangar/database';
import { Node, SerializedNode } from './Node';

export type Project = Node<ProjectDTO>;
export type ProjectWithInviteCode = Node<ProjectDTOWithInviteCode>;
export type SerializedProject = SerializedNode<Project>;
