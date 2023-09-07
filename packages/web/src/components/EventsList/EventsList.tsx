import React from 'react';
import { Event, eventStyle } from './utils';
import { Badge } from '@chakra-ui/react';

const Event = ({ event }: { event: Event }) => {
  
  const { name , description, start, end } = event;
  const stringFormat: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };
  const formattedStart = new Date(start).toLocaleTimeString([], stringFormat);
  const formattedEnd = new Date(end).toLocaleTimeString([], stringFormat);
  
  const now = new Date();
  const _start = new Date(start);
  const _end = new Date(end);
  const inProgress = _start < now && now < _end;
  const past = now > _end;
  const badge = inProgress ? 'IN PROGRESS' : past ? 'PAST' : '';
  
  return (
    <li style={eventStyle(badge)}>
      <h2>
        {name}&nbsp;&nbsp;
        
        { (badge=='IN PROGRESS') &&
          <Badge colorScheme="green" variant="solid" style={{ float:'right' }}>
            {badge} &nbsp;&nbsp;
            {/* clock icon */}
            &#x23F0;
          </Badge>
        }
      
      </h2>
      
      <p>
        {description}
      </p>
      
      <p>
        {formattedStart} - {formattedEnd}
      </p>
      
      {/* { (badge!=='PAST')
        ? <RegistrationModal />
        : ''
      } */}
    
    </li>
  );
}
  
export const EventsList: React.FC<{ events: Event[] }> = ({ events }) => (
  <ul>
    {events.map( event => <Event {...{ event, key:event.id }} /> )}
  </ul>
);
