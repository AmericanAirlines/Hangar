import { Project } from '@hangar/shared';
import { create } from 'zustand';
import { openSuccessToast } from '../../utils/CustomToast';

type VoteArgs = {
  currentTeamChosen: boolean;
};

type InitArgs = Pick<ExpoJudgingStore, 'expoJudgingSessionId'>;

type ExpoJudgingStore = {
  init: (args: InitArgs) => void;
  isLoading: boolean;
  expoJudgingSessionId: string;
  currentProject?: Project;
  previousProject?: Project;
  continueToNext: () => Promise<void>;
  skip: () => Promise<void>;
  vote: (args: VoteArgs) => Promise<void>;
};

export const useExpoJudging = create<ExpoJudgingStore>((set) => ({
  init: ({ expoJudgingSessionId }) => {
    set({ expoJudgingSessionId });
  },
  isLoading: false,
  expoJudgingSessionId: '',
  currentProject: undefined,
  previousProject: undefined,
  continueToNext: async () => {
    openSuccessToast({ title: 'Continued to Next Team' });

    // TODO: Add implementation
    // TODO: Fetch teams; consider adding new flag to keep track of whether
  },
  skip: async () => {
    openSuccessToast({ title: 'Team Skipped' });
  },
  vote: async () => {
    openSuccessToast({ title: 'Vote cast' });
  },
}));
