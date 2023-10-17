import { Project } from '@hangar/shared';
import { create } from 'zustand';
import { openErrorToast, openSuccessToast } from '../../../utils/CustomToast';
import { fetchProjects } from './fetchProjects';
import { continueSession } from './continueSession';
import { skip } from './skip';
import { vote } from './vote';

type VoteArgs = {
  currentProjectChosen: boolean;
};

type InitArgs = Pick<ExpoJudgingStore, 'expoJudgingSessionId'>;

type ExpoJudgingStore = {
  init: (args: InitArgs) => void;
  isLoading: boolean;
  expoJudgingSessionId: string;
  currentProject?: Project;
  previousProject?: Project;
  fetchProjects: () => Promise<void>;
  continueToNext: () => Promise<void>;
  skip: () => Promise<void>;
  vote: (args: VoteArgs) => Promise<void>;
};

export const useExpoJudging = create<ExpoJudgingStore>((set, getState) => ({
  init: ({ expoJudgingSessionId }) => {
    set({ expoJudgingSessionId, isLoading: true });
    void getState().fetchProjects();
  },
  isLoading: true,
  expoJudgingSessionId: '',
  currentProject: undefined,
  previousProject: undefined,
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const { currentProject, previousProject } = await fetchProjects({
        expoJudgingSessionId: getState().expoJudgingSessionId,
      });
      set({ currentProject, previousProject });
    } catch (error) {
      openErrorToast({ title: 'Failed to fetch projects' });
    }
    set({ isLoading: false });
  },
  continueToNext: async () => {
    set({ isLoading: true });
    try {
      await continueSession({ expoJudgingSessionId: getState().expoJudgingSessionId });
    } catch (error) {
      openErrorToast({ title: 'Failed to get next project' });
    }

    await getState().fetchProjects();
  },
  skip: async () => {
    set({ isLoading: true });
    try {
      await skip({ expoJudgingSessionId: getState().expoJudgingSessionId });
    } catch (error) {
      openErrorToast({ title: 'Failed to skip project' });
    }
    await getState().fetchProjects();
  },
  vote: async ({ currentProjectChosen }) => {
    set({ isLoading: true });
    try {
      await vote({ currentProjectChosen, expoJudgingSessionId: getState().expoJudgingSessionId });
    } catch (error) {
      openErrorToast({ title: 'Failed to fetch projects' });
    }
    openSuccessToast({ title: 'Vote cast' });
    await getState().fetchProjects();
  },
}));
