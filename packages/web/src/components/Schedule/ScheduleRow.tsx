import { Tr, Td, VStack, Text } from '@chakra-ui/react';
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
  return (
    <Tr>
      <Td>{event.name}</Td>
      <Td>{formatDate(event.start)}</Td>
      <Td>{formatDate(event.end)}</Td>
      <Td>{event.description}</Td>
    </Tr>
  );
};

const formatDate = (isoDate: string) => {
  const luxonDate = DateTime.fromISO(isoDate);
  const localDate = luxonDate.toFormat('ccc, LLL d, t'); // '2019/10/10'
  const relativeDate = luxonDate.toRelative() ?? ' '; // 'in 2 days'
 // console.log(isoDate, luxonDate.toRelative());
  return (
    <VStack alignItems="flex-start">
      <Text>{localDate}</Text>
      <Text opacity={0.5}>
        {relativeDate[0].toUpperCase()}
        {relativeDate.substring(1)}
      </Text>
    </VStack>
  );
};
