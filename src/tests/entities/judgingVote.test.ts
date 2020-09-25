import { JudgingVote } from '../../entities/judgingVote';
import { Team } from '../../entities/team';

describe('Judging Vote entity', () => {
  it('scoreVotes throws error when vote references a team that does not exist', () => {
    // Generate a vote for each team, but the other team doesn't exist
    const votes = new Array(2).fill(0).map((_, i) => {
      let vote;

      if (i === 0) {
        vote = new JudgingVote(0, -1, true);
      } else {
        vote = new JudgingVote(1, -1, true);
      }

      vote.id = i;
      return vote;
    });

    // Generate two teams (but no team with the id -1)
    const teams = new Array(2).fill(0).map((_, i) => {
      const team = new Team('', i, '');
      team.id = i;
      return team;
    });

    expect(() => JudgingVote.scoreVotes(1, votes, teams)).toThrow('Vote references a team that does not exist');
  });
});
