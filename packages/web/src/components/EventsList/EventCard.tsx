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

const timeFormat = 'h:mm a';
const dateFormat = 'dddd MM/DD';

export const EventCard: React.FC<EventCardProps> = ({ event, containerRef }) => {
  const { name, description, start, end } = event;
  const inProgress = dayjs().isBetween(start, end);

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
