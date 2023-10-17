import { ExpoJudgingSessionProjects, SerializedExpoJudgingSessionProjects } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';

type FetchProjectsArgs = {
  expoJudgingSessionId: string;
};

export const fetchProjects = async ({
  expoJudgingSessionId: id,
}: FetchProjectsArgs): Promise<ExpoJudgingSessionProjects> => {
  const res = await axios.get<SerializedExpoJudgingSessionProjects>(
    `/api/expoJudgingSession/${id}/projects`,
  );
  const { currentProject, previousProject } = res.data;
  return {
    currentProject: currentProject
      ? {
          ...currentProject,
          createdAt: dayjs(currentProject.createdAt),
          updatedAt: dayjs(currentProject.updatedAt),
        }
      : undefined,
    previousProject: previousProject
      ? {
          ...previousProject,
          createdAt: dayjs(previousProject.createdAt),
          updatedAt: dayjs(previousProject.updatedAt),
        }
      : undefined,
  };
};
