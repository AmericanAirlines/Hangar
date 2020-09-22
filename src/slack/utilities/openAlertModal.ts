/* eslint-disable @typescript-eslint/camelcase */
import { KnownBlock } from '@slack/bolt';
import { app } from '..';

interface ModalOptions {
  title?: string;
  text?: string;
  blocks?: KnownBlock[];
}

export async function openAlertModal(token: string, trigger_id: string, options: ModalOptions): Promise<void> {
  if (options?.title.length > 25) {
    throw new Error('Title must be 25 characters or less');
  }

  let blocks: KnownBlock[] = options.blocks || [];
  if (options.text) {
    blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: options.text,
          emoji: true,
        },
      },
      ...blocks,
    ];
  }

  await app.client.views.open({
    token,
    trigger_id,
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: options.title || 'Something Went Wrong',
      },
      blocks,
    },
  });
}
