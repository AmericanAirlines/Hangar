import Discord from 'discord.js';

import { Config } from '../../../entities/config';
import logger from '../../../logger';
import { colors } from '../../constants';
import { Team } from '../../../entities/team';

class TeamInfo {
  idArr: string[] = [];

  name = '';

  description = '';

  table = 0;

  user = '';

  constructor(i: string) {
    this.user = i;
  }

  addMembers(mem: string[]): void {
    this.idArr = mem;
  }

  addUser(): void {
    this.idArr.push(this.user);
  }

  addName(n: string): void {
    this.name = n;
  }

  addDescription(d: string): void {
    this.description = d;
  }

  addTable(t: number): void {
    this.table = t;
  }
}

let registrationInProgress = false;
let decrement = false;
let findName: Team;
let findTable: Team;

const promptArr = [
  'Who are you hacking with? You have 5 minutes to send a reply. If you are hacking alone, simply write `none`!\n**Be sure to input their Discord ID in a comma-separated list e.g. 111222333444555,666777888999000,...**',
  "What's your team/app name? You have 2 minutes to answer.",
  "What's your table number (e.g. 42)? You have 2 minutes to answer.",
  'What does your project do? How will it make a difference? What technologies are used? You have 5 minutes to answer.',
];
const componentArr = ['members', 'name', 'table', 'description'];
const timeArr = [300000, 120000, 120000, 300000];
const currentUsers: string[] = [];

async function question(
  m: Discord.Message,
  f: (m: Discord.Message) => boolean,
  prompt: string,
  t: number,
  component: string,
  currentTeam: TeamInfo,
): Promise<void> {
  await m.author.send(prompt);
  await m.channel
    .awaitMessages(f, {
      max: 1,
      time: t,
    })
    .then(async (collected) => {
      const input = collected.first().content;
      if (input === '!quit') {
        registrationInProgress = false;
        m.author.send('You successfully halted the signup process! Feel free to keep using the bot like normal.');
      } else {
        switch (component) {
          case 'members':
            if (input === 'none') {
              currentTeam.addUser();
            } else {
              currentTeam.addMembers(input.split(','));
              currentTeam.addUser();
            }
            break;

          case 'name':
            findName = await Team.findOne({ name: input });
            if (findName !== undefined) {
              m.author.send('Oops, looks like that team name already exists!');
              decrement = true;
            } else {
              currentTeam.addName(input);
            }
            break;

          case 'table':
            if (Number.isNaN(parseInt(input, 10))) {
              m.author.send('Oops, looks like the input for the table number is not a number!');
              decrement = true;
            } else {
              findTable = await Team.findOne({ tableNumber: parseInt(input, 10) });
              if (findTable !== undefined) {
                m.author.send('Oops, looks like someone is already at that table!');
                currentTeam.addTable(0);
                decrement = true;
              } else {
                currentTeam.addTable(parseInt(input, 10));
              }
            }
            break;

          case 'description':
            currentTeam.addDescription(input);
            break;

          default:
            break;
        }
      }
    })
    .catch(() => {
      m.author.send('Oops, looks like you timed out! Send another command to start the process again.');
      registrationInProgress = false;
    });
}

export async function registerTeam(msg: Discord.Message): Promise<void> {
  const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
  const filter = (m: Discord.Message): boolean => m.author.id === msg.author.id;

  if (!teamRegistrationActive) {
    await msg.author.send(
      "**Registration Not Open**\n:warning: Team registration is not open yet. Check back later or, if you're subscribed to updates, watch for a direct message from the bot!",
    );
  } else {
    try {
      const team = new TeamInfo(msg.author.id);
      currentUsers.push(msg.author.id);
      registrationInProgress = true;
      await msg.author.send({
        embed: {
          color: colors.info,
          title: '*Register your team for judging* :mag:\nOnly one person from each team should register',
          description:
            'Answer each question the bot provides. Once you are done answering a question, DM the answer to the bot and it will reply prompting for the next one!',
          fields: [
            {
              name: '**Discord IDs**',
              value:
                'This process requires the use of Discord IDs. These IDs can be found by going to `User Settings` -> `Appearance` -> `Advanced` and then enabling `Developer Mode`.\nAfterwards, simply right click on a user and click `Copy ID`',
            },
            {
              name: 'Quitting',
              value: 'If you would like to exit the signup process at any time, simply send `!quit` to the bot!',
            },
          ],
        },
      });
      for (let i = 0; i < promptArr.length - 1; i += 1) {
        if (registrationInProgress) {
          await question(msg, filter, promptArr[i], timeArr[i], componentArr[i], team);
          if (decrement) {
            i -= 1;
            decrement = false;
          }
        }
      }
      if (registrationInProgress) {
        await question(msg, filter, promptArr[promptArr.length - 1], timeArr[timeArr.length - 1], componentArr[componentArr.length - 1], team).then(
          () => {
            const newTeam = new Team(team.name, team.table, team.description, team.idArr);
            msg.author.send({
              embed: {
                color: colors.info,
                title: '**You are signed up :partying_face:**',
                description: 'Below is what has been submitted as your team!',
                fields: [
                  {
                    name: 'Team Name:',
                    value: newTeam.name,
                  },
                  {
                    name: 'Team Description:',
                    value: newTeam.projectDescription,
                  },
                  {
                    name: 'Table Number:',
                    value: newTeam.tableNumber,
                  },
                  {
                    name: 'Team Members (By Discord ID):',
                    value: newTeam.members,
                  },
                ],
              },
            });
            newTeam.save();
          },
        );
      }
      registrationInProgress = false;
      currentUsers.splice(currentUsers.indexOf(msg.author.id), 1);
    } catch (err) {
      logger.error('Error with team signup: ', err);
    }
  }
}

export function getUsers(): string[] {
  return currentUsers;
}
