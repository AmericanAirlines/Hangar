import { NextPage } from 'next';
import { appName } from '@hangar/shared';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { useUserStore as any } from '../stores/user';

const User: React.FC = () => {
  useUserStore((state:any) => state.user); 
  return (
    <div>
      <h1>user</h1>
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
