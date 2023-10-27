import React from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import dayjs from 'dayjs';
import { Project, SerializedProject } from '@hangar/shared';
import { useRouter } from 'next/router';
import { PageContainer } from '../../../components/layout/PageContainer';
import { ProjectCard } from '../../../components/ProjectCard';
import { openErrorToast } from '../../../components/utils/CustomToast';

const fetchProject: (id: string) => Promise<Project> = async (id) => {
  const { data } = await axios.get<SerializedProject>(`/api/project/${id}`);
  return { ...data, createdAt: dayjs(data.createdAt), updatedAt: dayjs(data.updatedAt) };
};

const ProjectDetails: NextPage = () => {
  const router = useRouter();

  const [project, setProject] = React.useState<Project>();

  React.useEffect(() => {
    const fetchAndSetProjects = async (id: string) => {
      try {
        setProject(await fetchProject(id));
      } catch {
        openErrorToast({
          title: 'Failed to retrieve project',
          description: 'An unexpected error occurred',
        });
      }
    };

    const { id } = router.query;
    if (router.query && id) {
      void fetchAndSetProjects(id as string);
    }
  }, [router]);

  return (
    <PageContainer pageTitle={'Project Details'} heading={'Project Details'} isLoading={!project}>
      {project && <ProjectCard project={project} />}
    </PageContainer>
  );
};

export default ProjectDetails;
