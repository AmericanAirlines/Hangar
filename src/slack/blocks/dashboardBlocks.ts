import { KnownBlock } from '@slack/types';
import { registerTeamActionId } from '../constants';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const headerBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text:
      "Hey there :wave: I'm a bot and I hope I can help you have an amazing experience this weekend! Here are some of the things I can help with:",
  },
};

const dividerBlock: KnownBlock = {
  type: 'divider',
};

const teamRegistrationBlock: KnownBlock = {
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
    action_id: registerTeamActionId,
  },
};

const comingSoonBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `\`404 - Useful Content Not Found\`

But seriously, we don't have anything else to show you at the moment. Message me again later!`,
  },
};

function dashboardBlocks(context: { [key: string]: boolean }): KnownBlock[] {
  const blocks: KnownBlock[] = [headerBlock, dividerBlock];

  const defaultBlocksLengh = blocks.length;

  if (context.teamRegistrationActive) {
    blocks.push(teamRegistrationBlock);
  }

  if (blocks.length === defaultBlocksLengh) {
    blocks.push(comingSoonBlock);
  }
  return blocks;
}

export default dashboardBlocks;
