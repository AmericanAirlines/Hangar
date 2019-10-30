import { KnownBlock } from '@slack/types';

const repoUrl = 'https://github.com/AmericanAirlines/Hangar';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const openSourceBlock: KnownBlock = {
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text: `<${repoUrl} | _*Hangar*_> is an Open Source Slack App created by American Airlines.`,
    },
  ],
};

export default openSourceBlock;
