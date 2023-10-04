import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { PageContainer } from '../../components/layout/PageContainer';
import { useAdminStore } from '../../stores/admin';
import { ExpoJudgingSessionList } from '../../components/Admin';

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const { admin, doneLoading: adminDoneLoading } = useAdminStore((state) => state);

  React.useEffect(() => {
    if (adminDoneLoading && !admin) {
      void router.push('/');
    }
  }, [admin, adminDoneLoading, router]);

  return (
    <PageContainer
      pageTitle={'Admin Dashboard'}
      heading={'Admin Dashboard'}
      isLoading={!adminDoneLoading}
    >
      <ExpoJudgingSessionList />
    </PageContainer>
  );
};

export default AdminDashboard;
