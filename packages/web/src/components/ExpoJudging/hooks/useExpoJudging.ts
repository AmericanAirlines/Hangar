import { Project } from '@hangar/shared';
import { create } from 'zustand';
import { openSuccessToast } from '../../utils/CustomToast';

type VoteArgs = {
  currentTeamChosen: boolean;
};

type ExpoJudgingStore = {
  currentProject?: Project;
  previousProject?: Project;
  continue: () => Promise<void>;
  skip: () => Promise<void>;
  vote: (args: VoteArgs) => Promise<void>;
};

export const useExpoJudging = create<ExpoJudgingStore>(() => ({
  currentProject: undefined,
  previousProject: undefined,
  continue: async () => {
    openSuccessToast({ title: 'Continued' });
  },
  skip: async () => {
    openSuccessToast({ title: 'Skipped' });
  },
  vote: async () => {
    openSuccessToast({ title: 'Vote cast' });
  },
}));
