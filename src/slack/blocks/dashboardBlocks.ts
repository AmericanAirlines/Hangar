import { KnownBlock } from '@slack/types';
import { actionIds } from '../constants';
import openSourceBlock from './openSourceFooter';
import { stringDictionary } from "../../StringDictonary";

const challengeUrl = process.env.CHALLENGE_URL;

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const headerBlock: KnownBlock = {
  type: 'header',
  text: {
    type: 'plain_text',
    text: stringDictionary.headerBlock as string,
    emoji: true,
  },
};

const introBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.introBlock as string,
  },
};

const dividerBlock: KnownBlock = {
  type: 'divider',
};

const challengeBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.challengeBlock as string,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.challengeBlock2 as string,
    },
    url: challengeUrl,
    action_id: actionIds.ignore,
  },
};

const subscribeBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text:
    stringDictionary.subscribeBlock as string,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.subscribeBlock2 as string,
    },
    action_id: actionIds.subscribe,
  },
};

const unsubscribeBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.unsubscribeBlock as string,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.unsubscribeBlock2 as string,
    },
    action_id: actionIds.unsubscribe,
  },
};

const ideaPitchRequestBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text:
    stringDictionary.ideaPitchRequestBlock as string,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.ideaPitchRequestBlock2 as string,
    },
    action_id: actionIds.joinIdeaPitchRequestQueue,
  },
};

const technicalRequestBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.technicalRequestBlock as string,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.technicalRequestBlock2 as string,
    },
    action_id: actionIds.joinTechnicalRequestQueue,
  },
};

const teamRegistrationBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.teamRegistrationBlock as string,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: stringDictionary.teamRegistrationBlock2 as string,
    },
    action_id: actionIds.registerTeam,
  },
};

const comingSoonBlock: KnownBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: stringDictionary.comingSoonBlock as string,
  },
};

export function dashboardBlocks(context: { [key: string]: boolean }): KnownBlock[] {
  const blocks: KnownBlock[] = [headerBlock, introBlock, dividerBlock];
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

  blocks.push(dividerBlock);
  blocks.push(openSourceBlock);

  return blocks;
}
