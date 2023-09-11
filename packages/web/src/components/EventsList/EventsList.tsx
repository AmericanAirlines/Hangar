import React from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Tag, Flex, Heading, ListItem, Text, UnorderedList, FlexProps } from '@chakra-ui/react';

import { Event } from '@hangar/shared';

import { eventStyle } from './utils';

dayjs.extend(isBetween)

type EventProps = {
  event: Event
};

type BadgeProps = {
  badge: 'IN PROGRESS' | 'PAST' | 'FUTURE'
};

const BadgeContainerStyle: FlexProps = {
  left:'0px',
  justifyContent: "center",
  position: "absolute",
  width: "full",
  mt: "-15px"
};

const ProgressBadge: React.FC<BadgeProps> = ({ badge }) =>
  (badge!=='IN PROGRESS') ? '' :
    <Tag variant={badge==='IN PROGRESS' ? 'success' : 'solid'}>
      <Flex gap={2} direction={'row'}>
        <Text>
          {badge}
        </Text>
        <Text>
          ⏰
        </Text>
      </Flex>
    </Tag>

const Event: React.FC<EventProps>  = ({ event }) => {
  const { name , description, start, end } = event;
  
  const inProgress = dayjs().isBetween(start, end);
  const past = dayjs().isAfter(end);
  const badge = inProgress ? 'IN PROGRESS' : past ? 'PAST' : 'FUTURE';
  
  return (
    <ListItem style={eventStyle(badge)}>
      <Flex {...BadgeContainerStyle}>
        <ProgressBadge {...{badge}} />        
      </Flex>
      
      <Heading as="h2" size="md">
        {name}
      </Heading>
      
      <Text>
        {description}
      </Text>
      
      <Text>
        {start.format('HH:mm a')} - {end.format('HH:mm a')}
      </Text>
    
    </ListItem>
  );
}
  
export const EventsList: React.FC<{ events: Event[] }> = ({ events }) =>
  <UnorderedList variant="card">
    {events.map( event => <Event {...{ event, key:event.id }} /> )}
  </UnorderedList>
