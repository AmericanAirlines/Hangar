import React from 'react';
import { NextPage } from 'next';
import { Box } from '@chakra-ui/react';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { useExpoJudgingSessionFetcher } from '../../../../pageUtils/expoJudgingSession/[id]/useExpoJudgingSessionFetcher';
// import { useExpoJudging } from '../../../../components/ExpoJudging';
import { ExpoJudgingSessionResult, fetchExpoJudgingSessionResults } from '../../../../pageUtils/expoJudgingSession/[id]/fetchExpoJudgingSessionResults';
import { openErrorToast } from '../../../../components/utils/CustomToast';

const ExpoJudgingSessionDetails: NextPage = () => {
  const { expoJudgingSession } = useExpoJudgingSessionFetcher();
  const [expoJudgingSessionResults, setExpoJudgingSessionResults] = React.useState<ExpoJudgingSessionResult[]>();
  React.useEffect( () => {
    const getExpoJudgingSessionResults = async () => {
      if (expoJudgingSession) {
        const results = await fetchExpoJudgingSessionResults({expoJudgingSessionId:expoJudgingSession.id});

        if ('status' in results) {
          const { status } = results;
          if (status === 404) {
            openErrorToast({ title: 'Expo Judging Session Not Found' });
          }
          else if (status === 403) {
            openErrorToast({ title: 'You are not authorized to view this Expo Judging Session' });
          }
          else if (status === 500) {
            openErrorToast({ title: 'Internal Server Error' });
          }
          else{
            openErrorToast({ title: 'Unknown Error' });
          }
          return;
        }
        if (Array.isArray(results)) {
          if (results) {
            if (results.length === 0) {
              openErrorToast({ title: 'No results found' });
            }
            setExpoJudgingSessionResults(results);
          }
        }
      }
    }
    if (expoJudgingSession) {
      void getExpoJudgingSessionResults()
    }
  }, [expoJudgingSession]);

  return (
    <PageContainer
      pageTitle={'Expo Judging'}
      heading={'Expo Judging'}
      isLoading={!expoJudgingSessionResults}
    >
      {expoJudgingSessionResults&&expoJudgingSessionResults.map((result) => (
          <Box key={result.id}>
            <Box>
              {result.name}
            </Box>
            <Box>
              {result.score}
            </Box>
          </Box>
        )
      )}
    </PageContainer>
  );
};

export default ExpoJudgingSessionDetails;
