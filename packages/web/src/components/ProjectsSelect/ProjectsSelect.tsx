import React from 'react';
import { Flex, Skeleton } from '@chakra-ui/react';
import { Project } from '@hangar/shared';
import { ProjectsSelectItem } from './ProjectsSelectItem';
import { ProjectsSelectStyleContext } from './ProjectsSelectStyleContext';
import { fetchProjects } from './fetchProjects';
import { ProjectSelectActions } from './ProjectsSelectActions';
import { colors } from '../../theme';

type ProjectsSelectProps = {
  onChange: (projects: Project[]) => void;
  isInvalid?: boolean;
};

export const ProjectsSelect: React.FC<ProjectsSelectProps> = ({ onChange, isInvalid }) => {
  const [projects, setProjects] = React.useState<Project[]>();
  const [selectedProjects, setSelectedProjects] = React.useState<Project[]>([]);

  const selectedProjectIds = React.useMemo(
    () => selectedProjects.map((p) => p.id),
    [selectedProjects],
  );

  // eslint-disable-next-line react/no-array-index-key
  const skeletons = Array(10).map((val, i) => <Skeleton key={i} flexShrink={0} height={'50px'} />);

  React.useEffect(() => {
    const makeInitialFetch = async () => {
      setProjects(await fetchProjects());
    };
    void makeInitialFetch();
  }, []);

  React.useEffect(() => {
    onChange(selectedProjects);
  }, [onChange, selectedProjects]);

  return (
    <ProjectsSelectStyleContext.Provider
      value={{ rowPadding: 2, checkboxSize: 'lg', checkboxPadding: 2 }}
    >
      <Flex
        direction="column"
        w="full"
        borderWidth={1}
        rounded={'xl'}
        borderColor={isInvalid ? colors.error : undefined}
      >
        <ProjectSelectActions
          projects={projects}
          selectedProjects={selectedProjects}
          onSelectAll={() => {
            setSelectedProjects(projects ?? []);
          }}
          onDeselectAll={() => {
            setSelectedProjects([]);
          }}
        />
        <Flex direction="column" w="full" maxH={'300px'} overflow="scroll" gap={3} pb="5">
          {projects?.length
            ? projects.map((project) => (
                <ProjectsSelectItem
                  key={project.id}
                  project={project}
                  isSelected={selectedProjectIds.includes(project.id)}
                  onClick={() => {
                    if (selectedProjectIds.includes(project.id)) {
                      setSelectedProjects(selectedProjects.filter((p) => p.id !== project.id));
                    } else {
                      setSelectedProjects([...selectedProjects, project]);
                    }
                  }}
                />
              ))
            : skeletons}
        </Flex>
      </Flex>
    </ProjectsSelectStyleContext.Provider>
  );
};
