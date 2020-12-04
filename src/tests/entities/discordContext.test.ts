import 'jest';
import { DiscordContext } from '../../entities/discordContext';

describe('message handler', () => {
  it('will clear all values when clear is called', async () => {
    const ctx = new DiscordContext('123', 'something', 'aSubStep');
    ctx.payload = {
      theMeaningOfLife: 42,
    };

    ctx.save = jest.fn();
    await ctx.clear();
    expect(ctx.id).toBe('123');
    expect(ctx.currentCommand).toBe('');
    expect(ctx.nextStep).toBe('');

    expect(ctx.save).toBeCalled();
  });
});
