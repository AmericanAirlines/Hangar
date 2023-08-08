import { NextPage } from 'next';
import { Button, Flex } from '@chakra-ui/react';
import { appName } from '@hangar/shared';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

async function signInWithSlack() {
  window.open('/api/auth/');
}

const Home: NextPage = () => (
  <PageContainer pageTitle={appName} heading={'Hello world'}>
    {/* cspell:disable-next */}
    <Flex>lorem ipsum dolor sit amet</Flex>
    <Button
      onClick={async () => {
        await signInWithSlack();
      }}
    >
      Sign in with Slack
    </Button>
  </PageContainer>
);

export default Home;
export { getServerSideProps } from '../components/Chakra';
