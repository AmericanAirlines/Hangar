/* eslint-disable @typescript-eslint/camelcase */
import { KnownBlock } from '@slack/bolt';
import { WebClient } from '@slack/web-api';

interface ModalOptions {
  title?: string;
  text?: string;
  blocks?: KnownBlock[];
}

export async function openAlertModal(client: WebClient, trigger_id: string, options: ModalOptions): Promise<void> {
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

  await client.views.open({
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
