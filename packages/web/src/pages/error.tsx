import { VStack } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ErrorPageContent } from '../components/ErrorPageContent';
import { PageContainer } from '../components/layout/PageContainer';

const Error: NextPage = () => {
  const router = useRouter();
  const { statusCode } = router.query;

  return (
    <PageContainer pageTitle={`Error - ${statusCode}`} heading={`Error - ${statusCode}`}>
      <VStack p={10} spacing={10}>
        <ErrorPageContent statusCode={Number(statusCode)} />
      </VStack>
    </PageContainer>
  );
};

export default Error;
