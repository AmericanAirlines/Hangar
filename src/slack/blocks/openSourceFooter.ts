import { KnownBlock } from '@slack/types';
import { stringDictionary } from '../../StringDictonary';

const repoUrl = 'https://github.com/AmericanAirlines/Hangar';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

const params: Record<string, string> = {
  repoUrl,
};
const dict = stringDictionary as Record<string, (params: Record<string, string>) => string>;

const openSourceBlock: KnownBlock = {
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text: dict.openSource(params),
    },
  ],
};

export default openSourceBlock;
