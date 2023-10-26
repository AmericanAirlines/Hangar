import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CriteriaJudgingSessionResults, Project } from '@hangar/shared';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { fetchCriteriaJudgingSessionResults } from '../../../../pageUtils/admin/criteriaJudgingSession/[id]/fetchCriteriaJudgingSessionResults';
import { fetchProjects } from '../../../../components/CriteriaJudging/hooks/useCriteriaJudging/fetchProjects';
import {
  CriteriaJudgingSessionProjectResults,
  ProjectWithResults,
} from '../../../../components/Admin/CriteriaJudgingSessionProjectResults';

const CriteriaJudgingSessionDetailsPage: NextPage = () => {
  const router = useRouter();
  const [results, setResults] = React.useState<CriteriaJudgingSessionResults | undefined>();
  const [projects, setProjects] = React.useState<Project[] | undefined>();

  React.useEffect(() => {
    const fetchResultsAndProjects = async (criteriaJudgingSessionId: string) => {
      const [fetchedResults, fetchedProjects] = await Promise.all([
        fetchCriteriaJudgingSessionResults({ criteriaJudgingSessionId }),
        fetchProjects({ criteriaJudgingSessionId }),
      ]);
      setResults(fetchedResults);
      setProjects(fetchedProjects);
    };

    const { id } = router.query;
    if (router.isReady && id) {
      void fetchResultsAndProjects(id as string);
    }
  }, [router]);

  /**
   * An array of sorted projects with their score data
   */
  const projectsWithResults = React.useMemo<ProjectWithResults[] | null>(() => {
    if (!projects || !results) return null;

    return projects
      .map((project) => ({ ...project, results: results[project.id] }))
      .sort((l, r) => ((l.results ?? 0) > (r.results ?? 0) ? -1 : 1));
  }, [projects, results]);

  return (
    <PageContainer
      pageTitle={'Criteria Judging Session Details'}
      heading={'Criteria Judging Session Details'}
      subHeading="Projects are sorted by score with highest score at the top"
      isLoading={!projectsWithResults}
    >
      {projectsWithResults?.map((project) => (
        <CriteriaJudgingSessionProjectResults key={project.id} projectWithResults={project} />
      ))}
    </PageContainer>
  );
};

export default CriteriaJudgingSessionDetailsPage;
