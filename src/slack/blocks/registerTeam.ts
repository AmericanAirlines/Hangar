import { KnownBlock, View } from '@slack/types';
import { registerTeamViewConstants } from '../constants';
import openSourceFooter from './openSourceFooter';
import { stringDictionary } from '../../StringDictonary';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const blocks: KnownBlock[] = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: stringDictionary.registerTeamblocks as string,
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'input',
    optional: true,
    block_id: registerTeamViewConstants.fields.teamMembers,
    label: {
      type: 'plain_text',
      text: stringDictionary.hackingWithWho as string,
    },
    element: {
      action_id: registerTeamViewConstants.fields.teamMembers,
      type: 'multi_users_select',
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.selectTeammate as string,
      },
    },
  },
  {
    type: 'input',
    block_id: registerTeamViewConstants.fields.teamName,
    element: {
      action_id: registerTeamViewConstants.fields.teamName,
      type: 'plain_text_input',
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.nameNotFound as string,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.askName as string,
      emoji: false,
    },
  },
  {
    type: 'input',
    block_id: registerTeamViewConstants.fields.tableNumber,
    hint: {
      type: 'plain_text',
      text: stringDictionary.tableDoubleCheck as string,
    },
    element: {
      action_id: registerTeamViewConstants.fields.tableNumber,
      type: 'plain_text_input',
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.exampleTableNumber as string,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.askTable as string,
      emoji: false,
    },
  },
  {
    type: 'input',
    block_id: registerTeamViewConstants.fields.projectDescription,
    element: {
      action_id: registerTeamViewConstants.fields.projectDescription,
      type: 'plain_text_input',
      multiline: true,
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.projectInfoDesc as string,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.projectDescription as string,
      emoji: false,
    },
  },
];

export const registerTeamView: View = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: stringDictionary.registerTeam as string,
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: stringDictionary.submit as string,
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: stringDictionary.cancel as string,
    emoji: true,
  },
  callback_id: registerTeamViewConstants.viewId,
  blocks,
};

export function registeredTeamSummary(
  registeringUser: string,
  teamMembers: string[],
  teamName: string,
  tableNumber: number,
  projectDescription: string,
): KnownBlock[] {
  const userString = teamMembers.length === 1 ? 'You have' : `<@${registeringUser}> has`;
  
  const tableNumberStr = tableNumber.toString();
  const params: Record<string, string> = {
    userString,
    teamName,
    tableNumber: tableNumberStr,
    projectDescription,
  };
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: stringDictionary.registerTeamSummary(params),
      },
    },
    openSourceFooter,
  ];
}
