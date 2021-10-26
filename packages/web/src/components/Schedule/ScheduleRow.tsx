import { Tr, Td } from '@chakra-ui/react';
import React from 'react';

interface ScheduleRowProps {
  event: Event;
}

export interface Event {
  id: string;
  name: string;
  start: Date;
  end: Date;
  description: string;
}

export const ScheduleRow: React.FC<ScheduleRowProps> = ({ event }) => {
  return (
    <Tr>
      <Td>{event.name}</Td>
      <Td>{event.start.toLocaleString()}</Td>
      <Td>{event.end.toLocaleString()}</Td>
      <Td>{event.description}</Td>
    </Tr>
  );
};
