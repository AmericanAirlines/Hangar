import React from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import dayjs from 'dayjs';
import { Project, SerializedProject } from '@hangar/shared';
import { useRouter } from 'next/router';
import { Circle } from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import { PageContainer } from '../../../components/layout/PageContainer';
import { ProjectCard } from '../../../components/ProjectCard';
import { openErrorToast } from '../../../components/utils/CustomToast';
import { colors } from '../../../theme';
import { useUserStore } from '../../../stores/user';

const fetchProject: (id: string) => Promise<Project> = async (id) => {
  const { data } = await axios.get<SerializedProject>(`/api/project/${id}`);
  return { ...data, createdAt: dayjs(data.createdAt), updatedAt: dayjs(data.updatedAt) };
};

const ProjectDetails: NextPage = () => {
  const router = useRouter();
  const { user } = useUserStore();
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

  const editProjectButton =
    user?.project === project?.id ? (
      <Circle
        size="40px"
        bg={colors.brandPrimary}
        cursor={'pointer'}
        _hover={{ bg: colors.brandPrimaryDark }}
      >
        <MdEdit />
      </Circle>
    ) : undefined;

  return (
    <PageContainer
      pageTitle={'Project Details'}
      heading={'Project Details'}
      isLoading={!project}
      headerActionElement={editProjectButton}
    >
      {project && <ProjectCard project={project} />}
    </PageContainer>
  );
};

export default ProjectDetails;
