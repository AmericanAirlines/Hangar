import { VStack } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { ErrorPageContent } from '../components/ErrorPageContent';
import { PageContainer } from '../components/layout/PageContainer';

const FourOhFour: NextPage = () => (
  <PageContainer pageTitle={`Error - 404`} heading={`Error - 404`}>
    <VStack p={10} spacing={10}>
      <ErrorPageContent statusCode={404} />
    </VStack>
  </PageContainer>
);

export default FourOhFour;
