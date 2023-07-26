import { events } from '../../../../src/api/slack/events';
import { appHomeOpened } from '../../../../src/api/slack/events/appHomeOpened';

describe('events handler registrations', () => {
  it('registers an app_home_opened event', () => {
    const mockEvent = jest.fn();
    const mockBolt = {
      event: mockEvent,
    };
    events(mockBolt as any);
    expect(mockEvent).toBeCalledWith('app_home_opened', appHomeOpened);
  });
});
