import React from 'react';
import { Table, Th, Tbody, Thead, Tr, Box, Center } from '@chakra-ui/react';
import { Event, ScheduleRow } from './ScheduleRow';

export interface ScheduleProps {
  events: Event[];
}

export const Schedule: React.FC<ScheduleProps> = ({ events }) =>
  events.length > 0 ? (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Start Date</Th>
          <Th>End Date</Th>
          <Th>Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {events.map((scheduledEvent: Event) => (
          <ScheduleRow event={scheduledEvent} key={scheduledEvent.name} />
        ))}
      </Tbody>
    </Table>
  ) : (
    <Center>
      <Box>We don&apos;t have anything planned at the moment 😬 Please check back later!</Box>
    </Center>
  );
