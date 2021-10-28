import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { ScheduleRow } from '../../../src/components/Schedule/ScheduleRow';
import { Event } from '../../../src/components/Schedule/ScheduleRow';
import { Table, Tbody } from '@chakra-ui/table';

const mockEvents: Event = {
  id: 'halloweenId',
  name: 'Halloween',
  start: new Date().toLocaleString(),
  end: new Date().toLocaleString(),
  description: 'A day with lots of candy',
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
});
