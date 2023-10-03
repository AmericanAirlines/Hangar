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

const fakeTeams: Partial<Project>[] = [
  {
    name: 'First Team',
    description:
      'Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit',
  },
  {
    name: 'Second Team',
    description:
      'Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit',
  },
  {
    name: 'Third Team',
    description:
      'Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit',
  },
  {
    name: 'Fourth Team',
    description:
      'Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit,Lorem ipsum dolor sit',
  },
];

export const useExpoJudging = create<ExpoJudgingStore>((set, state) => ({
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
    set({
      currentProject: fakeTeams[state().currentProject ? 1 : 0] as Project,
      previousProject: state().currentProject ? (fakeTeams[0] as Project) : undefined,
    });
  },
  skip: async () => {
    openSuccessToast({ title: 'Team Skipped' });
  },
  vote: async () => {
    openSuccessToast({ title: 'Vote cast' });
  },
}));
