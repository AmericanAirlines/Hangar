import Discord from 'discord.js';
import { SupportRequest } from '../../../entities/supportRequest';
import { SupportRequestType, SupportRequestStatus } from '../../../types/supportRequest';
import logger from '../../../logger';
import { Config } from '../../../entities/config';
import { SubCommands } from '.';
import { DiscordContext } from '../../../entities/discordContext';
import { stringDictionary } from '../../../StringDictionary';

/* eslint-disable no-param-reassign */

interface PayloadInfo {
  [k: string]: number | string | string[];
  id: string;
  requestType: SupportRequestType;
  username: string;
  primaryLanguage: string;
  problemDescription: string;
}

enum Steps {
  inputName = 'inputName',
  primaryLanguage = 'primaryLanguage',
  description = 'description',
}

const requestTypeMapping: { [id: string]: SupportRequestType } = {
  '!technicalSupport': SupportRequestType.TechnicalSupport,
  '!ideaPitch': SupportRequestType.IdeaPitch,
  '!jobChat': SupportRequestType.JobChat,
};

export async function supportRequest(msg: Discord.Message, context: DiscordContext): Promise<void> {
  let queueActive = false;
  switch (msg.content) {
    case '!jobChat':
      queueActive = await Config.findToggleForKey('jobChatQueueActive');
      break;
    default:
      queueActive = await Config.findToggleForKey('supportRequestQueueActive');
      break;
  }
  if (!queueActive) {
    msg.author.send(stringDictionary.queueNotActive);
    return;
  }
  const commonConditions = { slackId: msg.author.id };
  const userOpenRequestsCount = await SupportRequest.createQueryBuilder()
    .where([
      { status: SupportRequestStatus.Pending, ...commonConditions },
      { status: SupportRequestStatus.InProgress, ...commonConditions },
    ])
    .getCount();
  if (userOpenRequestsCount > 0) {
    await msg.author.send(stringDictionary.requestAlreadyOpen);
    await context.clear();
    return;
  }
  const payloadInfo: PayloadInfo = {
    id: msg.author.id,
    requestType: requestTypeMapping[msg.content],
    username: '',
    primaryLanguage: '',
    problemDescription: '',
  };
  const cmdName = msg.content.replace('!', '');
  const info = payloadInfo;
  const prompt =
    payloadInfo.requestType === SupportRequestType.JobChat
      ? "what's your name"
      : "what's the name of your team's voice channel (e.g. Hacker Room 51)";
  msg.author.send(
    stringDictionary.beforeAddToQueue({
      prompt,
    }),
  );
  context.nextStep = Steps.inputName;
  context.currentCommand = cmdName;
  context.payload = info;
  await context.save();
}

export const supportRequestSubCommands: SubCommands = {
  inputName: async (msg, ctx) => {
    ctx.nextStep = Steps.primaryLanguage;
    const info = ctx.payload as PayloadInfo;
    info.username = msg.content;
    ctx.payload = info;
    await ctx.save();
    await msg.author.send(stringDictionary.askPrimaryLanguage);
  },
  primaryLanguage: async (msg, ctx) => {
    ctx.nextStep = Steps.description;
    const info = ctx.payload as PayloadInfo;
    info.primaryLanguage = msg.content;
    ctx.payload = info;
    await ctx.save();
    await msg.author.send(stringDictionary.problemInfoDesc);
  },
  description: async (msg, ctx) => {
    ctx.nextStep = Steps.description;
    const info = ctx.payload as PayloadInfo;
    info.problemDescription = msg.content;
    ctx.payload = info;
    const userSupportRequest = new SupportRequest(info.id, info.username, info.requestType, info.primaryLanguage, info.problemDescription);
    try {
      await userSupportRequest.save();
      const responseString = stringDictionary.addedToQueue;
      msg.author.send(responseString);
    } catch (err) {
      await msg.author.send(stringDictionary.warningSomethingWrong);
      logger.error(stringDictionary.supportRequestErr, err);
    }
    await ctx.clear();
  },
};

export const jobChatIdeaPitchSubCommands: SubCommands = {
  inputName: async (msg, ctx) => {
    ctx.nextStep = Steps.inputName;
    const info = ctx.payload as PayloadInfo;
    info.username = msg.content;
    ctx.payload = info;

    const userSupportRequest = new SupportRequest(info.id, info.username, info.requestType, info.primaryLanguage, info.problemDescription);
    try {
      await userSupportRequest.save();
      let responseString = stringDictionary.addedToQueue;
      if (info.requestType === SupportRequestType.JobChat) {
        responseString += stringDictionary.jobChatResponse;
      }
      msg.author.send(responseString);
    } catch (err) {
      await msg.author.send(stringDictionary.warningSomethingWrong);
      logger.error(stringDictionary.supportRequestErr, err);
    }
    await ctx.clear();
  },
};
