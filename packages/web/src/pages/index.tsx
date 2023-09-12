import { NextPage } from 'next';
import { appName } from '@hangar/shared';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Prizes } from '../components/Prizes';

const Home: NextPage = () => (
  <PageContainer pageTitle={appName} heading={'Welcome to Hangar!'}>
    {/* cspell:disable-next */}
    <Prizes />
  </PageContainer>
);

export default Home;
export { getServerSideProps } from '../components/Chakra';
