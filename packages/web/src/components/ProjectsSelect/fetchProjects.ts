import { Project } from '@hangar/shared';
import axios, { isAxiosError } from 'axios';
import { useCustomToast } from '../utils/CustomToast';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await axios.get<Project[]>('/api/project');
    return res.data;
  } catch (error) {
    const description = isAxiosError(error)
      ? error.response?.data?.message
      : (error as Error).message;
    useCustomToast.getState().openErrorToast({ title: 'Failed to fetch projects', description });
    return [];
  }
};
