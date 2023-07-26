import { NextPage } from 'next';
import { Flex } from '@chakra-ui/react';
import { appName } from '@hangar/shared';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

const Home: NextPage = () => (
  <PageContainer pageTitle={appName} heading={'Hello world'}>
    {/* cspell:disable-next */}
    <Flex>lorem ipsum dolor sit amet</Flex>
  </PageContainer>
);

export default Home;
export { getServerSideProps } from '../components/Chakra';
