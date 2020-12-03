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
      text: stringDictionary.registerTeamblocks,
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
      text: stringDictionary.hackingWithWho,
    },
    element: {
      action_id: registerTeamViewConstants.fields.teamMembers,
      type: 'multi_users_select',
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.selectTeammate,
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
        text: stringDictionary.nameNotFound,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.askName,
      emoji: false,
    },
  },
  {
    type: 'input',
    block_id: registerTeamViewConstants.fields.tableNumber,
    hint: {
      type: 'plain_text',
      text: stringDictionary.tableDoubleCheck,
    },
    element: {
      action_id: registerTeamViewConstants.fields.tableNumber,
      type: 'plain_text_input',
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.exampleTableNumber,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.askTable,
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
        text: stringDictionary.projectInfoDesc,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.projectDescription,
      emoji: false,
    },
  },
];

export const registerTeamView: View = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: stringDictionary.registerTeam,
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: stringDictionary.submit,
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: stringDictionary.cancel,
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
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: stringDictionary.registerTeamSummary({
          userString,
          teamName,
          tableNumber: tableNumberStr,
          projectDescription,
        }),
      },
    },
    openSourceFooter,
  ];
}
