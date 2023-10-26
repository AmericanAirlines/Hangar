import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import { CriteriaJudgingSessionResults } from '@hangar/shared';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { fetchCriteriaJudgingSessionResults } from '../../../../pageUtils/admin/criteriaJudgingSession/[id]/fetchCriteriaJudgingSessionResults';

const CriteriaJudgingSessionDetailsPage: NextPage = () => {
  const router = useRouter();
  const [results, setResults] = React.useState<CriteriaJudgingSessionResults | undefined>();

  React.useEffect(() => {
    const fetchResults = async (id: string) => {
      setResults(await fetchCriteriaJudgingSessionResults({ criteriaJudgingSessionId: id }));
    };

    const { id } = router.query;
    if (router.isReady && id) {
      void fetchResults(id as string);
    }
  }, [router]);

  return (
    <PageContainer
      pageTitle={'Criteria Judging Session Details'}
      heading={'Criteria Judging Session Details'}
      isLoading={!results}
    >
      <Text whiteSpace={'pre-wrap'}>{JSON.stringify(results, null, 2)}</Text>
    </PageContainer>
  );
};

export default CriteriaJudgingSessionDetailsPage;
