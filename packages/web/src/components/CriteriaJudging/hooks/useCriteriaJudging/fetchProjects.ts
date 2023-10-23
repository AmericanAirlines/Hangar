import { Project, SerializedProject } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';

type FetchProjectsArgs = {
  criteriaJudgingSessionId: string;
};

export const fetchProjects = async ({
  criteriaJudgingSessionId: id,
}: FetchProjectsArgs): Promise<Project[]> => {
  const res = await axios.get<SerializedProject[]>(`/api/criteriaJudgingSession/${id}/projects`);
  return res.data.map((serializedProject) => ({
    ...serializedProject,
    createdAt: dayjs(serializedProject.createdAt),
    updatedAt: dayjs(serializedProject.updatedAt),
  }));
};
