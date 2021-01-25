import Discord from 'discord.js';
import { colors } from '../../constants';
import { Team } from '../../../entities/team';
import { Config } from '../../../entities/config';
import { DiscordContext } from '../../../entities/discordContext';
import { SubCommands } from '.';
import logger from '../../../logger';

/* eslint-disable no-param-reassign */

enum RegistrationSteps {
  teamMembers = 'teamMembers',
  teamName = 'teamName',
  teamDescription = 'teamDescription',
  teamChannel = 'teamChannel',
}

interface PartialTeamInfo {
  [k: string]: number | string | string[];
  members?: string[];
  name?: string;
  description?: string;
  channel?: string;
}

export async function registerTeam(msg: Discord.Message, context: DiscordContext): Promise<void> {
  const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
  if (!teamRegistrationActive) {
    await msg.author.send(':warning: Team registration is not open yet. Please check back later or wait for announcements!');
    return;
  }
  await msg.author.send({
    embed: {
      color: colors.info,
      title: '*Register your team for judging* :mag:\n:warning: Only one person from each team should register',
      description:
        'Answer each question the bot provides. Once you are done answering a question, DM the answer to the bot and it will reply prompting for the next answer!',
      fields: [
        {
          name: 'Exiting the flow',
          value: 'If you would like to exit the signup process at any time, either type `!exit` or any other command!',
        },
      ],
    },
  });
  context.nextStep = RegistrationSteps.teamMembers;
  context.currentCommand = 'registerTeam';
  await context.save();
  await msg.author.send(
    "Who are you hacking with? If you are hacking alone, simply write your name!\n**Be sure to input your name as well as your teammate's names in a comma-separated list (e.g. John Smith, Jane Doe, ...)!**",
  );
}

export const regSubCommands: SubCommands = {
  teamMembers: async (msg, ctx) => {
    ctx.nextStep = RegistrationSteps.teamName;
    const team: PartialTeamInfo = {
      members: [],
    };
    const temp = msg.content.split(',');

    for (let i = 0; i < temp.length; i += 1) {
      temp[i] = temp[i].trim();
      team.members.push(temp[i]);
    }
    ctx.payload = team;
    ctx.currentCommand = 'registerTeam';
    await ctx.save();
    msg.author.send("What's your team or app name?");
  },
  teamName: async (msg, ctx) => {
    ctx.nextStep = RegistrationSteps.teamDescription;
    const team = ctx.payload as PartialTeamInfo;
    team.name = msg.content;
    ctx.payload = team;
    ctx.currentCommand = 'registerTeam';
    await ctx.save();
    await msg.author.send('What does your project do? How will it make a difference? What technologies are used?');
  },
  teamDescription: async (msg, ctx) => {
    ctx.nextStep = RegistrationSteps.teamChannel;
    const team = ctx.payload as PartialTeamInfo;
    team.description = msg.content;
    ctx.payload = team;
    ctx.currentCommand = 'registerTeam';
    await ctx.save();
    await msg.author.send("What's your team's channel name? (e.g. Hacker Room 51)");
  },
  teamChannel: async (msg, ctx) => {
    const team = ctx.payload as PartialTeamInfo;
    ctx.currentCommand = 'registerTeam';
    ctx.nextStep = 'teamChannel';
    team.channel = msg.content;
    ctx.payload = team;
    await ctx.save();
    const finalTeam = new Team(team.name, null, team.description, team.members, team.channel);
    try {
      await finalTeam.save();
      await msg.author.send({
        embed: {
          color: colors.info,
          title: '**You are signed up :partying_face:**',
          description: 'Here are the details for your team:',
          fields: [
            {
              name: 'Team Name:',
              value: (await finalTeam).name,
            },
            {
              name: 'Team Members:',
              value: (await finalTeam).members,
            },
            {
              name: 'Team Description:',
              value: (await finalTeam).projectDescription,
            },
            {
              name: 'Team Channel Name',
              value: (await finalTeam).channelName,
            },
          ],
        },
      });
      ctx.currentCommand = undefined;
      ctx.nextStep = undefined;
      await ctx.save();
    } catch (err) {
      // Check if duplicate key constraint error (Postgres error 23505 - unique_violation)
      if (err.code === '23505') {
        await msg.author.send('Oops, looks like someone already entered the channel name that you input! Please try again');
      } else {
        logger.error('Saving team failed: ', err);
        await msg.author.send('Oops, looks like something went wrong on our end! Come to our booth and we will try to sort things out.');
      }
    }
  },
};
