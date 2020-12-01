import { KnownBlock } from '@slack/types';
import { stringDictionary } from '../../StringDictonary';

const repoUrl = 'https://github.com/AmericanAirlines/Hangar';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const openSourceBlock: KnownBlock = {
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text: stringDictionary.openSource({
        repoUrl,
      }),
    },
  ],
};

export default openSourceBlock;
