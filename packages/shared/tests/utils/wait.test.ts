import { wait } from '../../src/utils/wait';

jest.useFakeTimers();

describe('wait function', () => {
  it('waits for specified time', async () => {
    const delay = 1000;
    const mockFunc = jest.fn();

    const waitPromise = wait(delay).then(mockFunc);

    jest.advanceTimersByTime(delay);

    await waitPromise;

    expect(mockFunc).toHaveBeenCalled();
  });
});
