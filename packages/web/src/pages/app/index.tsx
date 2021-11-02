import { Heading } from '@chakra-ui/react';
import { NextPage } from 'next';
import { AppLayout } from '../../components/Layout';

const AppHome: NextPage = () => (
  <AppLayout>
    <Heading>App Home</Heading>
  </AppLayout>
);

export default AppHome;
