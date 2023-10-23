import { Project, SerializedProject } from '../entities';

export type SerializedExpoJudgingSessionProjects = {
  currentProject?: SerializedProject;
  previousProject?: SerializedProject;
};

export type ExpoJudgingSessionProjects = {
  currentProject?: Project;
  previousProject?: Project;
};
