import React from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import dayjs from 'dayjs';
import { Event, SerializedEvent } from '@hangar/shared';
import { PageContainer } from '../components/layout/PageContainer';
import { EventsList } from '../components/EventsList';
import { openErrorToast } from '../components/utils/CustomToast';

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

  React.useEffect(() => {
    const fetchAndSetEvents = async () => {
      try {
        setEvents(await fetchEvents());
      } catch {
        openErrorToast({
          title: 'Failed to retrieve events',
          description: 'An unexpected error occurred',
        });
      }
    };

    void fetchAndSetEvents();
  }, []);

  return (
    <PageContainer pageTitle={'Schedule'} heading={'Schedule'}>
      <EventsList {...{ events }} />
    </PageContainer>
  );
};

export default Schedule;
