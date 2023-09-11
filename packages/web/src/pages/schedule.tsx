import React from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import dayjs from 'dayjs';
import { useToast, UseToastOptions } from '@chakra-ui/react';
import { Event, SerializedEvent } from '@hangar/shared';
import { PageContainer } from '../components/layout/PageContainer';
import { EventsList } from '../components/EventsList';

const FAILED_FETCH_TOAST: UseToastOptions = {
  title: 'An error occurred.',
  description: 'Unable to fetch events.',
  status: 'error',
  duration: 3000,
  isClosable: true,
};

const fetchEvents: () => Promise<Event[]> = async () =>
  (await axios.get<SerializedEvent[]>('/api/event')).data.map((serializedEvent) => {
    const { start, end, createdAt, updatedAt, ...rest } = serializedEvent;
    return {
      ...rest,
      start: dayjs(start),
      end: dayjs(end),
      createdAt: dayjs(createdAt),
      updatedAt: dayjs(updatedAt),
    };
  });

const Schedule: NextPage = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const toast = useToast();

  React.useEffect(() => {
    const fetchAndSetEvents = async () => {
      try {
        setEvents(await fetchEvents());
      } catch {
        toast(FAILED_FETCH_TOAST);
      }
    };

    void fetchAndSetEvents();
  }, [toast]);

  return (
    <PageContainer pageTitle={'Schedule'} heading={'Events'}>
      <EventsList {...{ events }} />
    </PageContainer>
  );
};

export default Schedule;
