import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { ScheduleRow } from '../../../src/components/Schedule/ScheduleRow';
import { Event } from '../../../src/components/Schedule/ScheduleRow';
import { Table, Tbody } from '@chakra-ui/table';

const mockEvents: Event = {
  id: 'halloweenId',
  name: 'Halloween',
  start: new Date().toISOString(),
  end: new Date().toISOString(),
  description: 'A day with lots of candy',
};

const mockInvalidEvent: Event = {
  id: 'thanksgivingId',
  name: 'thanksgiving',
  start: new Date().toISOString(),
  end: 'Invalid End Date',
  description: 'Something about a turkey?',
};

describe('Schedule', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    expect(() =>
      render(
        <Table>
          <Tbody>
            <ScheduleRow event={mockEvents} />
          </Tbody>
        </Table>,
      ),
    ).not.toThrowError();

    expect(screen.getByText('Halloween')).toBeInTheDocument();
    expect(screen.getByText('A day with lots of candy')).toBeInTheDocument();
  });

  it('does not render an invalid date', async () => {
    expect(() =>
      render(
        <Table>
          <Tbody>
            <ScheduleRow event={mockInvalidEvent} />
          </Tbody>
        </Table>,
      ),
    ).not.toThrowError();

    expect(screen.getByText('thanksgiving')).toBeInTheDocument();
    expect(screen.getByText('Something about a turkey?')).toBeInTheDocument();
    expect(screen.getAllByText('Invalid DateTime')[0]).toBeInTheDocument();
  });
});
