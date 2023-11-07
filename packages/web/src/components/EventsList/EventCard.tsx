import React, { Ref } from 'react';
import { FlexProps, Tag, Flex, ListItem, Heading, Text } from '@chakra-ui/react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '@hangar/shared';
import { EventStatus, eventStyle } from './utils';

type EventCardProps = {
  event: Event;
  containerRef?: Ref<HTMLLIElement>;
};

const BadgeContainerStyle: FlexProps = {
  top: 0,
  left: 0,
  justifyContent: 'center',
  position: 'absolute',
  width: 'full',
  mt: '-12px',
};

const timeFormat = 'h:mm a';
const dateFormat = 'dddd MM/DD';

const getRelativeTimeStatus: (start: Dayjs, end: Dayjs) => EventStatus = (start, end) => {
  if (dayjs().isBetween(start, end)) return 'IN PROGRESS';
  if (dayjs().isAfter(end)) return 'PAST';
  return 'FUTURE';
};

export const EventCard: React.FC<EventCardProps> = ({ event, containerRef }) => {
  const { name, description, start, end } = event;
  const [status, setStatus] = React.useState<EventStatus>(getRelativeTimeStatus(start, end));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getRelativeTimeStatus(start, end));
    }, 1000); // Trigger every 60 seconds

    return () => {
      clearInterval(interval);
    };
  }, [end, start]);

  return (
    <ListItem style={eventStyle(status)} ref={containerRef}>
      <Flex {...BadgeContainerStyle} hidden={status !== 'IN PROGRESS'}>
        <Tag variant={'success'}>
          <Flex gap={2} direction={'row'}>
            <Text>In Progress</Text>
            <Text>🕑</Text>
          </Flex>
        </Tag>
      </Flex>

      <Flex w="full" direction="column" gap={3}>
        <Heading as="h2" size="md">
          {name}
        </Heading>

        <Text>{description}</Text>

        <Flex w="full" justifyContent="center" gap={5}>
          <Text variant="outline" fontWeight="bold">
            {start.format(timeFormat)} - {end.format(timeFormat)} on {start.format(dateFormat)}
          </Text>
        </Flex>
      </Flex>
    </ListItem>
  );
};
