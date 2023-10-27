import { Ref } from 'react';
import { FlexProps, Flex, ListItem, Heading, Text } from '@chakra-ui/react';
import { Project } from '@hangar/shared';

type ProjectCardProps = {
  project: Project;
  containerRef?: Ref<HTMLLIElement>;
};

const BadgeContainerStyle: FlexProps = {
  top: 0,
  left: 0,
  justifyContent: 'center',
  position: 'absolute',
  width: 'full',
  mt: '-12px',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, containerRef }) => {
  const { name, description, location, judgeVisits, repoUrl } = project;

  return (
    <ListItem ref={containerRef}>
      <Flex {...BadgeContainerStyle}></Flex>

      <Heading as="h2" size="md">
        {name}
      </Heading>

      <Text>{description}</Text>
      <Text>{location}</Text>
      <Text>{judgeVisits}</Text>
      <Text>{repoUrl}</Text>
    </ListItem>
  );
};
