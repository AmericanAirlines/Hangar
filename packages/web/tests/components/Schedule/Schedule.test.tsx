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
    start: new Date().toLocaleString(),
    end: new Date().toLocaleString(),
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
    const errorMessage = "We don't have anything planned at the moment 😬 Please check back later!";
    expect(ScheduleRow).toBeCalledTimes(0);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
