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
          <Th>name</Th>
          <Th>start date</Th>
          <Th>end date</Th>
          <Th>description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {events.map((scheduledEvent: Event) => (
          <ScheduleRow event={scheduledEvent} key={scheduledEvent.id} />
        ))}
      </Tbody>
    </Table>
  );
};
