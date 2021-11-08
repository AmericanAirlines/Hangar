import React from 'react';
import { Heading, VStack, Text, useDisclosure, Box, Collapse, Icon } from '@chakra-ui/react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
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

const formatDuration = (start: string, end: string) => {
  const startDate = DateTime.fromISO(start);
  const endDate = DateTime.fromISO(end);

  if (!startDate.isValid || !endDate.isValid) {
    return <Text>TBD</Text>;
  }

  const localeStart = startDate.toFormat('ccc, LLL d, t'); // Mon, Jan 1, 12:00 PM
  const localeEnd =
    startDate.day === endDate.day ? endDate.toFormat('t') : endDate.toFormat('LLL d, t');
  const hoursAway = startDate.diffNow('hours').hours;
  const relativeDate = startDate.toRelative()!; // The bang is ONLY here because we check validity above

  return (
    <VStack alignItems="flex-start" spacing={0}>
      <Text>
        {localeStart} - {localeEnd}
      </Text>
      {Math.abs(hoursAway) < 12 ? (
        <Text fontSize="sm" fontWeight="medium" opacity={0.5}>
          {relativeDate[0].toUpperCase()}
          {relativeDate.substring(1)}
        </Text>
      ) : null}
    </VStack>
  );
};

export const ScheduleRow: React.FC<ScheduleRowProps> = ({ event }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box
      as="button"
      textAlign="unset"
      backgroundColor="white"
      shadow="md"
      padding={4}
      paddingBottom={2}
      rounded="2xl"
      onClick={onToggle}
      title={isOpen ? 'Collapse details' : 'Expand details'}
    >
      <VStack alignItems="stretch" spacing={0}>
        <Heading as="p" size="sm">
          {event.name}
        </Heading>
        <Box>{formatDuration(event.start, event.end)}</Box>
        <Collapse in={isOpen} animateOpacity>
          <Text paddingTop={2}>{event.description}</Text>
        </Collapse>
        <VStack>
          <Icon as={isOpen ? HiChevronUp : HiChevronDown} />
        </VStack>
      </VStack>
    </Box>
  );
};
