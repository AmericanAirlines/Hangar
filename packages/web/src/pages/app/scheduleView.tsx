import React from 'react';
import { NextPage } from 'next';
import { AppLayout } from '../../components/Layout';
import { Schedule } from '../../components/Schedule';
import { Event } from '../../components/Schedule/ScheduleRow';

const ScheduleView: NextPage = () => {
  const [schedule, setSchedule] = React.useState<Event[]>([]);

  React.useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch('/api/event');
      const scheduleList = await res.json();

      setSchedule(scheduleList);
    };

    void fetchSchedule();
  }, []);

  return (
    <AppLayout>
      <Schedule events={schedule} />
    </AppLayout>
  );
};

export default ScheduleView;
