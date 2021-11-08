import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, act } from '../../testUtils/testTools';
import { ScheduleRow, Event } from '../../../src/components/Schedule/ScheduleRow';

const mockEvent: Event = {
  id: '1',
  name: 'Workshop',
  start: new Date(2021, 0, 1, 13, 0).toISOString(), // 1pm
  end: new Date(2021, 0, 1, 14, 0).toISOString(), // 2pm
  description: 'A cool workshop',
};

const mockMultiDayEvent: Event = {
  id: '2',
  name: 'Virtual Game',
  start: new Date(2021, 0, 1, 20, 0).toISOString(), // 8pm
  end: new Date(2021, 0, 2, 8, 0).toISOString(), // 8am next day
  description: 'An overnight virtual game',
};

describe('Schedule row', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders same day event correctly', () => {
    render(<ScheduleRow event={mockEvent} />);

    expect(screen.queryByText(mockEvent.name)).toBeVisible();
    expect(screen.queryByText(mockEvent.description)).toBeInTheDocument();
    expect(screen.queryByText('Fri, Jan 1, 1:00 PM - 2:00 PM')).toBeVisible();
  });

  it('renders multi-day event correctly', () => {
    render(<ScheduleRow event={mockMultiDayEvent} />);

    expect(screen.queryByText(mockMultiDayEvent.name)).toBeVisible();
    expect(screen.queryByText(mockMultiDayEvent.description)).toBeInTheDocument();
    expect(screen.queryByText('Fri, Jan 1, 8:00 PM - Jan 2, 8:00 AM')).toBeVisible();
  });

  it('renders relative time if less than 12 hours', () => {
    render(
      <ScheduleRow
        event={{
          ...mockEvent,
          start: new Date(Date.now() + 1000 * 60 * 61).toISOString(), // 1 hour and 1 minute from now
        }}
      />,
    );

    expect(screen.queryByText('In 1 hour')).toBeVisible();
  });

  it('renders TBD for invalid dates', () => {
    render(
      <ScheduleRow
        event={{
          ...mockEvent,
          start: 'INVALID',
        }}
      />,
    );

    expect(screen.queryByText('TBD')).toBeVisible();
  });

  it('can expand and collapse details', async () => {
    render(<ScheduleRow event={mockEvent} />);

    expect(screen.queryByText(mockEvent.description)).not.toBeVisible();

    userEvent.click(screen.getByTitle('Expand details'));

    await waitFor(() => {
      expect(screen.queryByText(mockEvent.description)).toBeVisible();
    });

    userEvent.click(screen.getByTitle('Collapse details'));

    await waitFor(() => {
      expect(screen.queryByText(mockEvent.description)).not.toBeVisible();
    });
  });
});
