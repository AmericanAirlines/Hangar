import { Tr, Td } from '@chakra-ui/react';
import React from 'react';
import { DateTime } from 'luxon';

interface ScheduleRowProps {
  event: Event;
}

export interface Event {
  id: string;
  name: string;
  start: string;
  end: string;
  description: string;
}

export const ScheduleRow: React.FC<ScheduleRowProps> = ({ event }) => {
  const startTime = new Date(event.start);
  const endTime = new Date(event.end);

  return (
    <Tr>
      <Td>{event.name}</Td>
      <Td>{formatDate(startTime)}</Td>
      <Td>{formatDate(endTime)}</Td>
      <Td>{event.description}</Td>
    </Tr>
  );
};

const formatDate = (isoDate: Date) => {
  const localDate = isoDate.toLocaleDateString(); // '2019/10/10'
  const relativeDate = DateTime.fromJSDate(isoDate).toRelative(); // 'in 2 days'
  return `${localDate} (${relativeDate})`;
};
