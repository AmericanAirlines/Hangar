import { Project } from '@hangar/shared';
import { create } from 'zustand';
import { openSuccessToast } from '../../utils/CustomToast';

type VoteArgs = {
  currentTeamChosen: boolean;
};

type InitArgs = Pick<ExpoJudgingStore, 'expoJudgingSessionId'>;

type ExpoJudgingStore = {
  init: (args: InitArgs) => void;
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
  expoJudgingSessionId: '',
  currentProject: undefined,
  previousProject: undefined,
  continueToNext: async () => {
    openSuccessToast({ title: 'Continued' });
  },
  skip: async () => {
    openSuccessToast({ title: 'Skipped' });
  },
  vote: async () => {
    openSuccessToast({ title: 'Vote cast' });
  },
}));
