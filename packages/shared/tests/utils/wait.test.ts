import { wait } from '../../src/utils/wait';

describe('wait function', () => {
  it('waits for specified time', async () => {
    const delay = 1000;
    const mockFunc = jest.fn();

    const waitPromise = wait(delay).then(mockFunc);

    jest.useFakeTimers();

    await waitPromise;

    expect(mockFunc).toHaveBeenCalled();
  });
});
