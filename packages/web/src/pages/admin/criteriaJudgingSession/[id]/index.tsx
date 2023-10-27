import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CriteriaJudgingSessionResults } from '@hangar/shared';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { fetchCriteriaJudgingSessionResults } from '../../../../pageUtils/admin/criteriaJudgingSession/[id]/fetchCriteriaJudgingSessionResults';
import { CriteriaJudgingSessionProjectResults } from '../../../../components/Admin/CriteriaJudgingSessionProjectResults';

const CriteriaJudgingSessionDetailsPage: NextPage = () => {
  const router = useRouter();
  const [results, setResults] = React.useState<CriteriaJudgingSessionResults | undefined>();

  React.useEffect(() => {
    const fetchResultsAndProjects = async (criteriaJudgingSessionId: string) => {
      setResults(await fetchCriteriaJudgingSessionResults({ criteriaJudgingSessionId }));
    };

    const { id } = router.query;
    if (router.isReady && id) {
      void fetchResultsAndProjects(id as string);
    }
  }, [router]);

  return (
    <PageContainer
      pageTitle={'Criteria Judging Session Details'}
      heading={'Criteria Judging Session Details'}
      subHeading="Projects are sorted by score with highest score at the top"
      isLoading={!results}
    >
      {results?.map((project) => (
        <CriteriaJudgingSessionProjectResults key={project.id} projectWithResults={project} />
      ))}
    </PageContainer>
  );
};

export default CriteriaJudgingSessionDetailsPage;
