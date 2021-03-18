import { KnownBlock, View } from '@slack/types';
import { joinSupportQueueConstants } from '../constants';
import openSourceFooter from './openSourceFooter';
import { stringDictionary } from '../../StringDictionary';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const blocks: KnownBlock[] = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: stringDictionary.joinSupportQueueblocks,
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'input',
    block_id: joinSupportQueueConstants.fields.primaryLanguage,
    element: {
      action_id: joinSupportQueueConstants.fields.primaryLanguage,
      type: 'plain_text_input',
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.nameNotFound,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.askPrimaryLanguage,
      emoji: false,
    },
  },
  {
    type: 'input',
    block_id: joinSupportQueueConstants.fields.problemDescription,
    element: {
      action_id: joinSupportQueueConstants.fields.problemDescription,
      type: 'plain_text_input',
      multiline: true,
      placeholder: {
        type: 'plain_text',
        text: stringDictionary.problemInfoDesc,
      },
    },
    label: {
      type: 'plain_text',
      text: stringDictionary.problemDescription,
      emoji: false,
    },
  },
];

export const joinSupportQueueView: View = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: stringDictionary.technicalRequest2,
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: stringDictionary.submit,
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: stringDictionary.cancel,
    emoji: true,
  },
  callback_id: joinSupportQueueConstants.viewId,
  blocks,
};

export function joinedSupportQueueSummary(primaryLanguage: string, problemDescription: string): KnownBlock[] {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: stringDictionary.joinSupportQueueSummary({
          primaryLanguage,
          problemDescription,
        }),
      },
    },
    openSourceFooter,
  ];
}
