import { KnownBlock, View } from '@slack/types';
import { registerTeamViewConstants } from '../constants';

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
    },
    label: {
      type: 'plain_text',
      text: "What's your team name?",
      emoji: false,
    },
  },
  {
    type: 'input',
    block_id: registerTeamViewConstants.fields.tableNumber,
    element: {
      action_id: registerTeamViewConstants.fields.tableNumber,
      type: 'plain_text_input',
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
