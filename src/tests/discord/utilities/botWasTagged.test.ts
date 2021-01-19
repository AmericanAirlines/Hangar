import 'jest';
import Discord from 'discord.js';
import { botWasTagged } from '../../../discord/utilities/botWasTagged';
import { makeDiscordMessage } from '../../utilities/makeDiscordMessage';

const botId = '123456';
const getMockMessage = (mentionedUsers: string[] = []): Discord.Message =>
  // eslint-disable-next-line implicit-arrow-linebreak
  makeDiscordMessage({
    mentions: {
      users: {
        keys: (): string[] => mentionedUsers,
      },
    },
    client: {
      user: {
        id: botId,
      },
    },
  });

describe('discord wasBotTagged', () => {
  test('will return false if bot is not tagged', () => {
    expect(botWasTagged(getMockMessage())).toBe(false);
  });

  test('will return true if bot is tagged', () => {
    expect(botWasTagged(getMockMessage([botId]))).toBe(true);
  });
});
