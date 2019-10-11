import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { Schedule } from '../../../src/components/Schedule';
import { Event, ScheduleRow } from '../../../src/components/Schedule/ScheduleRow';

jest.mock('../../../src/components/Schedule/ScheduleRow.tsx');
getMock(ScheduleRow).mockImplementation(({ event }) => (
  <div data-testid={event.id}>schedule row</div>
));

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Workshop',
    start: new Date(2021, 1, 1, 13, 0).toISOString(), // 1pm
    end: new Date(2021, 1, 1, 14, 0).toISOString(), // 2pm
    description: 'A cool workshop',
  },
  {
    id: '2',
    name: 'Virtual Game',
    start: new Date(2021, 1, 1, 20, 0).toISOString(), // 8pm
    end: new Date(2021, 1, 2, 8, 0).toISOString(), // 8am next day
    description: 'An overnight virtual game',
  },
];

describe('Schedule', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders a loading spinner when events are being fetched', async () => {
    fetchMock.getOnce('/api/events', mockEvents);

    render(<Schedule />);

    await waitFor(() => {
      expect(screen.queryByText('Loading', { exact: false })).toBeVisible();
    });
  });

  it('renders a ScheduleRow for each event fetched', async () => {
    fetchMock.getOnce('/api/events', mockEvents);

    render(<Schedule />);

    await waitFor(() => {
      expect(ScheduleRow).toBeCalledTimes(2);
    });

    expect(ScheduleRow).toHaveBeenCalledWith(
      expect.objectContaining({ event: mockEvents[0] }),
      expect.anything(),
    );

    expect(ScheduleRow).toHaveBeenCalledWith(
      expect.objectContaining({ event: mockEvents[1] }),
      expect.anything(),
    );

    expect(screen.queryByTestId(mockEvents[0].id)).toBeVisible();
    expect(screen.queryByTestId(mockEvents[1].id)).toBeVisible();
  });

  it('renders info message if there are no events', async () => {
    fetchMock.getOnce('/api/events', []);

    render(<Schedule />);

    await waitFor(async () => {
      expect(screen.queryByText('check back later', { exact: false })).toBeVisible();
    });
  });

  it('renders error message if events cannot be fetched', async () => {
    fetchMock.getOnce('/api/events', 500);

    render(<Schedule />);

    await waitFor(async () => {
      expect(screen.queryByText('There was an error fetching events')).toBeVisible();
    });
  });
});
