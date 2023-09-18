import React from 'react';
import { NextPage } from 'next';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { PageContainer } from '../../components/layout/PageContainer';
import { useAdminStore } from '../../stores/admin';
import { AddExpoJudgingSession } from '../../components/AddExpoJudgingSession';

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const { admin, doneLoading } = useAdminStore((state) => state);

  React.useEffect(() => {
    if (doneLoading && !admin) {
      void router.push('/');
    }
  }, [admin, doneLoading, router]);

  return (
    <PageContainer
      pageTitle={'Admin Dashboard'}
      heading={'Admin Dashboard'}
      isLoading={!doneLoading}
    >
      <Text>{admin ? admin.id : 'Redirecting...'}</Text>
      {/* Check out the below line please :) I don't like it but don't know the best way to conditionally hide the dashboard */}
      {admin ? <AddExpoJudgingSession /> : <></>}
    </PageContainer>
  );
};

export default AdminDashboard;
