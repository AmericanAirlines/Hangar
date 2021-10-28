import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { Schedule, ScheduleProps } from '../../../src/components/Schedule';
import { ScheduleRow } from '../../../src/components/Schedule/ScheduleRow';
import { Td, Tr } from '@chakra-ui/react';

jest.mock('../../../src/components/Schedule/ScheduleRow.tsx');
getMock(ScheduleRow).mockImplementation(() => (
  <Tr>
    <Td>{'A Title'}</Td>
  </Tr>
));

const mockEvents: ScheduleProps['events'] = [
  {
    id: 'halloweenId',
    name: 'Halloween',
    start: new Date(),
    end: new Date(),
    description: 'A day with lots of candy',
  },
];

describe('Schedule', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    expect(() => render(<Schedule events={mockEvents} />)).not.toThrowError();

    expect(ScheduleRow).toBeCalledTimes(1);
    expect(screen.getByText('A Title')).toBeInTheDocument();
  });

  it('does not create a row if events are not present', async () => {
    expect(() => render(<Schedule events={[]} />)).not.toThrowError();

    expect(ScheduleRow).toBeCalledTimes(0);
    expect(screen.getByText('A Title')).not.toBeInTheDocument();
    // TODO: Add expectation for the new `check back later` message
  });
});
