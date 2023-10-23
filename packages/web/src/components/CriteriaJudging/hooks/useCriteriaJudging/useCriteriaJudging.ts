import { Project } from '@hangar/shared';
import { create } from 'zustand';
import { openErrorToast } from '../../../utils/CustomToast';
import { fetchProjects } from './fetchProjects';

type InitArgs = Pick<CriteriaJudgingStore, 'criteriaJudgingSessionId'>;

type CriteriaJudgingStore = {
  init: (args: InitArgs) => void;
  isLoading: boolean;
  criteriaJudgingSessionId: string;
  projects?: Project[];
  fetchProjects: () => Promise<void>;
};

export const useCriteriaJudging = create<CriteriaJudgingStore>((set, getState) => ({
  init: ({ criteriaJudgingSessionId }) => {
    set({
      criteriaJudgingSessionId,
      isLoading: true,
      // Clear old state
      projects: undefined,
    });
    void getState().fetchProjects();
  },
  isLoading: true,
  criteriaJudgingSessionId: '',
  projects: undefined,
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await fetchProjects({
        criteriaJudgingSessionId: getState().criteriaJudgingSessionId,
      });
      set({ projects });
    } catch (error) {
      openErrorToast({ title: 'Failed to fetch projects' });
    }
    set({ isLoading: false });
  },
}));
