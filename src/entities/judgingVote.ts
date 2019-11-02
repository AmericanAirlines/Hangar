import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Team } from './team';

interface TeamScore {
  id: number;
  score: number;
}

interface TeamResult extends TeamScore {
  name: string;
}

@Entity()
export class JudgingVote extends BaseEntity {
  constructor(previousTeam: number, currentTeam: number, currentTeamChosen: boolean) {
    super();

    this.previousTeam = previousTeam;
    this.currentTeam = currentTeam;
    this.currentTeamChosen = currentTeamChosen;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  previousTeam: number;

  @Column()
  currentTeam: number;

  @Column()
  currentTeamChosen: boolean;

  static async tabulate(): Promise<TeamResult[]> {
    const votes = await JudgingVote.find();
    const scores: { [id: string]: TeamScore } = {};

    for (let i = 0; i < votes.length; i += 1) {
      const vote = votes[i];
      scores[vote.currentTeam] = updateTeamScoreWithVote(vote, scores[vote.currentTeam]);
    }

    const teamResults: TeamResult[] = await Promise.all(
      Object.keys(scores).map(async (key) => {
        const teamScore = scores[key];
        const team = await Team.findOne({ id: teamScore.id });
        return {
          name: team.name,
          ...teamScore,
        };
      }),
    );
    // TODO: Determine if ties are likely and figure out how to break them
    return teamResults.sort((a, b) => (a.score > b.score ? -1 : 1));
  }
}

function updateTeamScoreWithVote(vote: JudgingVote, teamScore?: TeamScore): TeamScore {
  // TODO: Implement actual score calculation
  const updatedTeamScore = teamScore || { id: vote.currentTeam, score: 0 };
  return updatedTeamScore;
}
