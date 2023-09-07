import React from 'react';
import { Event, eventSchema, EventsList } from '../components/EventsList';
import { PageContainer } from '../components/layout/PageContainer';

const fetchEvents = async () => {
  const res = await fetch('/api/event');

  if (res.ok) {
    const data: Event[] = await res.json();
    const events: Event[] = (data).map((event) => eventSchema.parse(event));
    
    return events;
  }
}

const Schedule: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  
  React.useEffect(() => {
    void fetchEvents().then( (events) => {
      setEvents(events as Event[]);
    });
  }, []);
  
  return (
    <div>
      <PageContainer pageTitle={'Schedule'} heading={'Events'}>
        {/* cspell:disable-next */}
      </PageContainer>
      <div style={{width:'350px'}}>
        <EventsList {...{events}} />
      </div>
    </div>
  );
}

export default Schedule