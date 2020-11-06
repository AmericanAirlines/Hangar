import { KnownBlock } from '@slack/types';
import { actionIds } from '../constants';
import openSourceBlock from './openSourceFooter';

const challengeUrl = process.env.CHALLENGE_URL;

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const headerBlock: KnownBlock = {
  type: 'header',
  text: {
    type: 'plain_text',
    text: 'Welcome to Hangar',
    emoji: true,
  },
};

const introBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: "Hey there :wave: I'm a bot designed to provide you with resources for the hackathon!",
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
    action_id: actionIds.ignore,
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
    action_id: actionIds.joinIdeaPitchRequestQueue,
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
    action_id: actionIds.joinTechnicalRequestQueue,
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
      text: 'Register Team',
    },
    action_id: actionIds.registerTeam,
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

export function dashboardBlocks(): KnownBlock[] {
  const blocks: KnownBlock[] = [headerBlock, introBlock, dividerBlock];
  const defaultBlocksLengh = blocks.length;

  if (challengeUrl) {
    blocks.push(challengeBlock);
  }

  blocks.push(ideaPitchRequestBlock);
  blocks.push(technicalRequestBlock);

  blocks.push(teamRegistrationBlock);

  if (blocks.length === defaultBlocksLengh) {
    blocks.push(comingSoonBlock);
  }

  blocks.push(dividerBlock);
  blocks.push(openSourceBlock);

  return blocks;
}
