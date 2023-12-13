import { Heading, Text, Flex, Box, Link } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Config, Project } from '@hangar/shared';
import { colors } from '../../theme';

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { name, description, location, repoUrl } = project;

  return (
    <Box
      mx={{ base: 3, xl: 0 }}
      borderRadius="lg"
      p={6}
      background={`linear-gradient(45deg, ${colors.brandPrimaryLight}, ${colors.brandPrimaryDark})`}
      boxShadow="lg"
      as={motion.div}
      whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
    >
      <Heading size="lg" mb={2} textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
        {name}
      </Heading>

      <Text fontSize="md" mb={4} textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
        {description}
      </Text>

      {location && (
        <Flex align="center" mb={2}>
          <Text fontSize="sm" fontWeight="bold" mr={2}>
            {Config.project.locationLabel}:
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            {location}
          </Text>
        </Flex>
      )}

      <Flex align="center" gap={2}>
        <Text fontSize="sm" fontWeight="bold">
          Repo URL:
        </Text>
        <Link href={repoUrl} isExternal display="flex" alignItems="center">
          {repoUrl}
          <Box ml={2}>
            <FiExternalLink style={{ marginLeft: '4px' }} />
          </Box>
        </Link>
      </Flex>
    </Box>
  );
};
