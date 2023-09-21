import { Event } from '@hangar/shared';
import React from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Tag, Flex, Heading, ListItem, Text, UnorderedList, FlexProps } from '@chakra-ui/react';
import { eventStyle, EventStatus } from './utils';

dayjs.extend(isBetween);

type EventCardProps = {
  event: Event;
};

type BadgeProps = {
  badge: EventStatus;
};

const BadgeContainerStyle: FlexProps = {
  top: 0,
  left: 0,
  justifyContent: 'center',
  position: 'absolute',
  width: 'full',
  mt: '-12px',
};

const ProgressBadge: React.FC<BadgeProps> = ({ badge }) =>
  badge !== 'IN PROGRESS' ? (
    <></>
  ) : (
    <Tag variant={badge === 'IN PROGRESS' ? 'success' : 'solid'}>
      <Flex gap={2} direction={'row'}>
        <Text>{badge}</Text>
        <Text>🕑</Text>
      </Flex>
    </Tag>
  );

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const cardRef = React.useRef<HTMLLIElement>(null);
  const { name, description, start, end } = event;
  const inProgress = dayjs().isBetween(start, end);

  React.useEffect(() => {
    if (inProgress) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [inProgress]);

  const format = 'h:mm a';
  const past = dayjs().isAfter(end);
  let badge: EventStatus = 'IN PROGRESS';
  if (past) {
    badge = 'PAST';
  } else if (!inProgress) {
    badge = 'FUTURE';
  }

  return (
    <ListItem style={eventStyle(badge)} ref={cardRef}>
      <Flex {...BadgeContainerStyle}>
        <ProgressBadge {...{ badge }} />
      </Flex>

      <Heading as="h2" size="md">
        {name}
      </Heading>

      <Text>{description}</Text>

      <Text>
        {start.format(format)} - {end.format(format)}
      </Text>
    </ListItem>
  );
};

export const EventsList: React.FC<{ events: Event[] }> = ({ events }) => (
  <UnorderedList variant="card" spacing={5} m={0}>
    {events.map((event) => (
      <EventCard {...{ event }} key={`event-${event.id}`} />
    ))}
  </UnorderedList>
);
