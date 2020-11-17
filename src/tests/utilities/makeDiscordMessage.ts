import Discord from 'discord.js';
import { DeepPartial } from 'typeorm';

export const makeDiscordMessage = (partialMessage: DeepPartial<Discord.Message>): Discord.Message => (partialMessage as unknown) as Discord.Message;
