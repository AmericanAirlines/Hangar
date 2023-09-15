import React from 'react';
import { NextPage } from 'next';
import { Text } from '@chakra-ui/react';
import { PageContainer } from '../../components/layout/PageContainer';
import { useAdminStore } from '../../stores/admin';

const AdminDashboard: NextPage = () => {
  const { admin, doneLoading } = useAdminStore((state) => state);

  React.useEffect(() => {
    if (doneLoading && admin === undefined) {
      window.location.href = '/';
    }
  });

  return (
    <PageContainer
      pageTitle={'Admin Dashboard'}
      heading={'Admin Dashboard'}
      isLoading={!doneLoading}
    >
      <Text>{admin === undefined ? 'Redirecting...' : admin?.id}</Text>
    </PageContainer>
  );
};

export default AdminDashboard;
