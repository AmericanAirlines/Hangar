import { KnownBlock } from '@slack/types';
import { registerTeamActionId, subscribeActionId, unsubscribeActionId, ideaPitchRequestActionId, technicalRequestActionId } from '../constants';
import openSourceBlock from './openSourceFooter';

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

const subscribeBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text:
      "*Subscribe to Updates*\nWant to stay informed throughout the event? Subscribe and we'll send you occasional updates here in Slack (_you can unsubscribe at any time_).",
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'Subscribe',
    },
    action_id: subscribeActionId,
  },
};

const unsubscribeBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: "*Unsubscribe from Updates*\nWant us to stop sending you messages about the event? Don't worry, we can still be friends.",
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'Unsubscribe',
    },
    action_id: unsubscribeActionId,
  },
};

const ideaPitchRequestBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: "*Need idea help?*\nCome pitch your idea to us and get feedback. No idea what to build? Let's chat!",
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'Join Idea Pitch Queue',
    },
    action_id: ideaPitchRequestActionId,
  },
};

const technicalRequestBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: '*Need technical help?*\nHaving trouble with your app? Our team is here to help!',
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'Join Tech Support Queue',
    },
    action_id: technicalRequestActionId,
  },
};

const teamRegistrationBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: '*Register Your Team*\nHacking with us this weekend? Make sure to register your team so we know to reach out before judging starts!',
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

But seriously, I don't have anything else to show you at the moment. Message me again later!`,
  },
};

function dashboardBlocks(context: { [key: string]: boolean }): KnownBlock[] {
  const blocks: KnownBlock[] = [headerBlock, dividerBlock];

  const defaultBlocksLengh = blocks.length;

  blocks.push(context.isSubscribed ? unsubscribeBlock : subscribeBlock);

  blocks.push(ideaPitchRequestBlock);
  blocks.push(technicalRequestBlock);

  if (context.teamRegistrationActive) {
    blocks.push(teamRegistrationBlock);
  }

  if (blocks.length === defaultBlocksLengh) {
    blocks.push(comingSoonBlock);
  }

  blocks.push(openSourceBlock);

  return blocks;
}

export default dashboardBlocks;
