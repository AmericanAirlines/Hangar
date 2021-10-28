import { NextPage } from 'next';
import React from 'react';
import { AppLayout } from '../../components/Layout';
import { Schedule, ScheduleProps } from '../../components/Schedule';
import { Event } from '../../components/Schedule/ScheduleRow';

const ScheduleView: NextPage = () => {
  const [schedule, setSchedule] = React.useState<Event[]>([]);

  React.useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch('/api/event');
      const scheduleList = await res.json();

      setSchedule(scheduleList);
    };

    fetchSchedule();
  }, []);

  return (
    <AppLayout>
      <Schedule events={schedule} />
    </AppLayout>
  );
};

export default ScheduleView;
