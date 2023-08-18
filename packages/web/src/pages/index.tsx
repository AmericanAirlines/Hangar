import { NextPage } from 'next';
import { appName } from '@hangar/shared';
import React, { useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { useUserStore } from '../stores/user';

const User: React.FC = () => {
  const { user, loading, fetchUser } = useUserStore((state:any) => state); 
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>

      <h1>{loading+''}</h1>
      <h1>{user.firstName}</h1>
    </div>
  );
}


const Home: NextPage = () => (
  <>
    <PageContainer pageTitle={appName} heading={'Welcome to Hangar!'}>
      {/* cspell:disable-next */}
    </PageContainer>
    <User />
  </>
);

export default Home;
export { getServerSideProps } from '../components/Chakra';
