/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { client } from '../../../discord';
import { messageUsers } from '../../../discord/utilities/messageUsers';

jest.mock('../../../discord/index.ts');

describe('discord messageUsers', () => {
  test('calls send on a found user', async () => {
    const sendFn = jest.fn();
    const testId = 'discord-id';
    const message = 'Hello World';

    client.users.fetch = jest.fn().mockResolvedValue({ send: sendFn });

    await messageUsers([testId], message);

    expect(client.users.fetch).toHaveBeenCalledWith(testId);
    expect(sendFn).toHaveBeenCalledWith(message);
  });

  test('does not throw error when user not found', async () => {
    const testId = 'discord-id';
    const message = 'Hello World';

    client.users.fetch = jest.fn().mockRejectedValue(undefined);

    await expect(messageUsers([testId], message)).resolves.toBeUndefined();
  });
});
