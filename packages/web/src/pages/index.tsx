import { NextPage } from 'next';
import { appName } from '@hangar/shared';
import React from 'react';
import { Box } from '@chakra-ui/react';
import { PageContainer } from '../components/layout/PageContainer';
import { Prizes } from '../components/Prizes';
import { RegistrationModal } from '../components/RegistrationModal';


const Home: NextPage = () => (
  <PageContainer pageTitle={appName} heading={'Welcome to Hangar!'}>
    {/* cspell:disable-next */}
    <Box>
      <RegistrationModal />
    </Box>
    <Prizes />
  </PageContainer>
);

export default Home;
export { getServerSideProps } from '../components/Chakra';
