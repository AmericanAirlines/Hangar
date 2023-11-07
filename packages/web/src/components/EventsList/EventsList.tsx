import React from 'react';
import { Event } from '@hangar/shared';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { UnorderedList } from '@chakra-ui/react';
import { EventCard } from './EventCard';

dayjs.extend(isBetween);

export const EventsList: React.FC<{ events: Event[] }> = ({ events }) => {
  const nextEventCardRef = React.useRef<HTMLLIElement>(null);

  const nextEventId = React.useMemo(
    () => events.find((event) => dayjs().isBefore(event.end))?.id, // Grab the id of the first event that isn't in the past
    [events],
  );

  React.useEffect(() => {
    nextEventCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [nextEventId]);

  return (
    <UnorderedList variant="card" spacing={8} m={0}>
      {events.map((event) => (
        <EventCard
          {...{ event }}
          key={`event-${event.id}`}
          containerRef={nextEventId === event.id ? nextEventCardRef : undefined}
        />
      ))}
    </UnorderedList>
  );
};
