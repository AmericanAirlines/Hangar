import { KnownBlock } from '@slack/types';
import {
  registerTeamActionId,
  subscribeActionId,
  unsubscribeActionId,
  ideaPitchRequestActionId,
  technicalRequestActionId,
  ignoreActionId,
} from '../constants';
import openSourceBlock from './openSourceFooter';

const challengeUrl = process.env.CHALLENGE_URL;

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const headerBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text:
      "Hey there :wave: I'm a bot designed to provide you with resources for the hackathon! You can message me at any time to see the options below.",
  },
};

const dividerBlock: KnownBlock = {
  type: 'divider',
};

const challengeBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: '*Sponsor Challenge*\nWant to read up on our challenge and see what our prizes are?',
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'Challenge Info',
    },
    url: challengeUrl,
    action_id: ignoreActionId,
  },
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
    text:
      "*Need idea help?*\nCome pitch your idea to us and get feedback, you might even get some bonus points towards your final score! No idea what to build? Let's chat!",
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

  if (challengeUrl) {
    blocks.push(challengeBlock);
  }

  blocks.push(context.isSubscribed ? unsubscribeBlock : subscribeBlock);

  blocks.push(ideaPitchRequestBlock);
  blocks.push(technicalRequestBlock);

  blocks.push(teamRegistrationBlock);

  if (blocks.length === defaultBlocksLengh) {
    blocks.push(comingSoonBlock);
  }

  blocks.push(openSourceBlock);

  return blocks;
}

export default dashboardBlocks;
