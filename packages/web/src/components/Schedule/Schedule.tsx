import React from 'react';
import { Center, Spinner, Alert, AlertDescription, AlertIcon, VStack } from '@chakra-ui/react';
import { Event, ScheduleRow } from './ScheduleRow';

export const Schedule: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [events, setEvents] = React.useState<Event[]>([]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events');

      try {
        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError('There was an error fetching events');
      }

      setLoading(false);
    };

    void fetchEvents();
  }, []);

  if (loading) {
    return (
      <Center height={24}>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" rounded="2xl">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (events.length === 0) {
    return (
      <Alert status="info" rounded="2xl">
        <AlertIcon />
        <AlertDescription>
          We haven&apos;t posted any events yet, please check back later
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack alignItems="stretch" spacing={3}>
      {events.map((event: Event) => (
        <ScheduleRow key={event.id} event={event} />
      ))}
    </VStack>
  );
};
