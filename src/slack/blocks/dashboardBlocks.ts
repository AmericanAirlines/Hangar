import { KnownBlock } from '@slack/types';
import { actionIds } from '../constants';
import openSourceBlock from './openSourceFooter';
import { stringDictionary } from '../../StringDictonary';

const challengeUrl = process.env.CHALLENGE_URL;

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const headerBlock: KnownBlock = {
  type: 'header',
  text: {
    type: 'plain_text',
    text: stringDictionary.headerinfo,
    emoji: true,
  },
};

const introBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.intro,
  },
};

const dividerBlock: KnownBlock = {
  type: 'divider',
};

const challengeBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.challenge,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.challenge2,
    },
    url: challengeUrl,
    action_id: actionIds.ignore,
  },
};

const ideaPitchRequestBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.ideaPitchRequest,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.ideaPitchRequest2,
    },
    action_id: actionIds.joinIdeaPitchRequestQueue,
  },
};

const technicalRequestBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.technicalRequest,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.technicalRequest2,
    },
    action_id: actionIds.joinTechnicalRequestQueue,
  },
};

const teamRegistrationBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.teamRegistration,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.teamRegistration2,
    },
    action_id: actionIds.registerTeam,
  },
};

const comingSoonBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.comingSoon,
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
