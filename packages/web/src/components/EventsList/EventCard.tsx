import { Ref } from 'react';
import { FlexProps, Tag, Flex, ListItem, Heading, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { Event } from '@hangar/shared';
import { EventStatus, eventStyle } from './utils';

type EventCardProps = {
  event: Event;
  containerRef?: Ref<HTMLLIElement>;
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

export const EventCard: React.FC<EventCardProps> = ({ event, containerRef }) => {
  const { name, description, start, end } = event;
  const inProgress = dayjs().isBetween(start, end);

  const format = 'h:mm a';
  const past = dayjs().isAfter(end);
  let badge: EventStatus = 'IN PROGRESS';
  if (past) {
    badge = 'PAST';
  } else if (!inProgress) {
    badge = 'FUTURE';
  }

  return (
    <ListItem style={eventStyle(badge)} ref={containerRef}>
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
