import { Heading, Text, Flex } from '@chakra-ui/react';
import { Project } from '@hangar/shared';

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { name, description, location, repoUrl } = project;

  return (
    <Flex direction={'column'}>
      <Heading size="md">{name}</Heading>

      <Text>{description}</Text>
      <Text>{location}</Text>
      <Text>{repoUrl}</Text>
    </Flex>
  );
};
