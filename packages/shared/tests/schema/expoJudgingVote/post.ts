import { Schema } from '../../../src';

const validExpoJudgingVote = {
  currentProjectChosen: true,
  expoJudgingSessionId: '1',
};

describe('expo judging vote post schema', () => {
  it('validates a matching object', () => {
    expect(Schema.project.post.safeParse(validExpoJudgingVote).success).toBe(true);
  });

  it('does not validate an object with an invalid currentProjectChosen', () => {
    expect(
      Schema.project.post.safeParse({
        ...validExpoJudgingVote,
        currentProjectChosen: 'invalid',
      }).success,
    ).toBe(false);
  });

  it('does not validate an object with an invalid expoJudgingSessionId', () => {
    expect(
      Schema.project.post.safeParse({
        ...validExpoJudgingVote,
        expoJudgingSessionId: 1,
      }).success,
    ).toBe(false);
  });

  it('does not validate an object without an expoJudgingSessionId', () => {
    const expoJudgingVoteWithoutExpoJudgingSessionId = { ...validExpoJudgingVote } as Record<
      string,
      string | boolean
    >;
    delete expoJudgingVoteWithoutExpoJudgingSessionId.expoJudgingSessionId;

    expect(Schema.project.post.safeParse(expoJudgingVoteWithoutExpoJudgingSessionId).success).toBe(
      false,
    );
  });

  it('does not validate an object without a currentProjectChosen', () => {
    const expoJudgingVoteWithoutCurrentProjectChosen = { ...validExpoJudgingVote } as Record<
      string,
      string | boolean
    >;
    delete expoJudgingVoteWithoutCurrentProjectChosen.currentProjectChosen;

    expect(Schema.project.post.safeParse(expoJudgingVoteWithoutCurrentProjectChosen).success).toBe(
      false,
    );
  });
});
