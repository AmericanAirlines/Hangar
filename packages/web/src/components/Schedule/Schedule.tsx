import { Table, Th, Tbody, Thead, TableCaption, Tr } from '@chakra-ui/react';
import React from 'react';
import { ScheduleRow } from './ScheduleRow';
import { Event } from './ScheduleRow';

export interface ScheduleProps {
  events: Event[];
}

export const Schedule: React.FC<ScheduleProps> = ({ events }) => {
  return (
    <Table variant="simple">
      <TableCaption>Upcoming Events</TableCaption>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Start Date</Th>
          <Th>End Date</Th>
          <Th>Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {events.length ? events.map((scheduledEvent: Event) => (
          <ScheduleRow event={scheduledEvent} key={scheduledEvent.id} />
        )) : 
        <Box>We don&apos;t have anything planned at the moment 😬 Please check back later!</Box>
        }
      </Tbody>
    </Table>
  );
};
