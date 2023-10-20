import React from 'react';
import { NextPage } from 'next';
import { Box, UnorderedList, ListItem, Heading, Flex, Text } from '@chakra-ui/react';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { useExpoJudgingSessionFetcher } from '../../../../pageUtils/expoJudgingSession/[id]/useExpoJudgingSessionFetcher';
import {
  ExpoJudgingSessionResult,
  fetchExpoJudgingSessionResults,
} from '../../../../pageUtils/expoJudgingSession/[id]/fetchExpoJudgingSessionResults';
import { openErrorToast } from '../../../../components/utils/CustomToast';

const ExpoJudgingSessionDetails: NextPage = () => {
  const { expoJudgingSession } = useExpoJudgingSessionFetcher();
  const [expoJudgingSessionResults, setExpoJudgingSessionResults] =
    React.useState<ExpoJudgingSessionResult[]>();

  React.useEffect(() => {
    const getExpoJudgingSessionResults = async () => {
      if (expoJudgingSession) {
        const results = await fetchExpoJudgingSessionResults({
          expoJudgingSessionId: expoJudgingSession.id,
        });

        if ('status' in results) {
          const { status } = results;
          if (status === 404) {
            openErrorToast({ title: 'Expo Judging Session Not Found' });
          } else if (status === 403) {
            openErrorToast({ title: 'You are not authorized to view this Expo Judging Session' });
          } else if (status === 500) {
            openErrorToast({ title: 'Internal Server Error' });
          } else {
            openErrorToast({ title: 'Unknown Error' });
          }
          return;
        }

        if (results.length === 0) {
          openErrorToast({ title: 'No results found' });
        }
        setExpoJudgingSessionResults(results);
      }
    };
    if (expoJudgingSession) {
      void getExpoJudgingSessionResults();
    }
  }, [expoJudgingSession]);

  return (
    <PageContainer
      pageTitle={'Expo Judging Overview'}
      heading={'Expo Judging Overview'}
      isLoading={!expoJudgingSessionResults}
    >
      <UnorderedList variant="card" m={0} spacing={5}>
        {expoJudgingSessionResults &&
          expoJudgingSessionResults.map((result) => (
            <Box key={result.id}>
              <ListItem>
                <Heading as="h2" size="md">
                  <Flex gap={2}>
                    <Text>Project {result.name}</Text>
                  </Flex>
                </Heading>

                <Text>Score: {result.score}</Text>
              </ListItem>
            </Box>
          ))}
      </UnorderedList>
    </PageContainer>
  );
};

export default ExpoJudgingSessionDetails;
