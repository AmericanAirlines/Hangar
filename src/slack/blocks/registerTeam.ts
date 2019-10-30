import { KnownBlock, View } from '@slack/types';
import { registerTeamViewConstants } from '../constants';
import openSourceFooter from './openSourceFooter';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const blocks: KnownBlock[] = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Register your team for judging* :mag:\n\nOnly one person from each team should register',
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
      text: 'Who are you hacking with?',
    },
    element: {
      action_id: registerTeamViewConstants.fields.teamMembers,
      type: 'multi_users_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select teammates',
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
        text: '404 - Name not found',
      },
    },
    label: {
      type: 'plain_text',
      text: "What's your team/app name?",
      emoji: false,
    },
  },
  {
    type: 'input',
    block_id: registerTeamViewConstants.fields.tableNumber,
    hint: {
      type: 'plain_text',
      text: "Make sure your table number is correct or we won't be able to find you!",
    },
    element: {
      action_id: registerTeamViewConstants.fields.tableNumber,
      type: 'plain_text_input',
      placeholder: {
        type: 'plain_text',
        text: 'e.g., 42',
      },
    },
    label: {
      type: 'plain_text',
      text: "What's your table number?",
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
        text: 'What does your project do? How will make a difference? What technologies are used?',
      },
    },
    label: {
      type: 'plain_text',
      text: 'What does your project do?',
      emoji: false,
    },
  },
];

export const registerTeamView: View = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'Register Team',
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  callback_id: registerTeamViewConstants.viewId,
  blocks,
};

export function registeredTeamSummary(
  registeringUser: string,
  teamMembers: string[],
  teamName: string,
  tableNumber: string,
  projectDescription: string,
): KnownBlock[] {
  const userString = teamMembers.length === 1 ? 'You have' : `<@${registeringUser}> has`;
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${userString} registered your team for sponsor judging. Our team will stop by during judging to see your hack. Best of luck and see you soon!

*Team Name*: ${teamName}
*Table Number*: ${tableNumber}
*Project Description*: ${projectDescription}
        `,
      },
    },
    openSourceFooter,
  ];
}
