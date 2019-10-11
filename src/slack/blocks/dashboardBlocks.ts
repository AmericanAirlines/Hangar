import { KnownBlock, Block } from '@slack/types';
import { registerTeamCallbackId } from '../constants';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const blocks: (KnownBlock | Block)[] = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        "Hey there :wave: I'm a bot and I hope I can help you have an amazing experience this weekend! Here are some of the things I can help with:",
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Register Your Team*\nHacking with us this weekend? Make sure you register your team so we know to reach out before judging starts!',
    },
    accessory: {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Register',
      },
      action_id: registerTeamCallbackId,
    },
  },
];

export default blocks;
