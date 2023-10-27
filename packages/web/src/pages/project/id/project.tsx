import React from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import dayjs from 'dayjs';
import { Project, SerializedProject } from '@hangar/shared';
import { PageContainer } from '../../../components/layout/PageContainer';
import { ProjectsList } from '../../../components/ProjectList';
import { openErrorToast } from '../../../components/utils/CustomToast';

const fetchProjects: () => Promise<Project[]> = async () =>
  (await axios.get<SerializedProject[]>('/api/project/id')).data.map((serializedProject) => {
    const { name, description, location, judgeVisits, repoUrl, ...rest } = serializedProject;
    return {
      ...rest,
      createdAt: dayjs(createdAt),
      updatedAt: dayjs(updatedAt),
    };
  });

const ProjectDetails: NextPage = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useState(() => {
    const fetchAnsSetProjects = async () => {
      try {
        setProjects(await fetchProjects());
      } catch {
        openErrorToast({
          title: 'Failed to retrieve projects',
          description: 'An unexpected error  occurred',
        });
      }
    };

    void fetchAnsSetProjects();
  }, []);

  return (
    <PageContainer pageTitle={'Project Details'} heading={'Project details'}>
      <ProjectsList {...{ projects }}></ProjectsList>
    </PageContainer>
  );
};
