import { Heading, Text, Flex, Box, Link } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Project } from '@hangar/shared';

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { name, description, location, repoUrl } = project;

  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Box
        borderRadius="lg"
        p={6}
        background="linear-gradient(45deg, #4CAF50, #2196F3)"
        borderWidth="2"
        borderColor="teal.500"
        boxShadow="lg"
        transition="all 0.3s"
        _hover={{
          transform: 'scale(1.05)',
          borderColor: 'teal.300',
        }}
      >
        <Heading size="lg" mb={2} textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
          {name}
        </Heading>

        <Text fontSize="md" mb={4} textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
          {description}
        </Text>

        <Flex align="center" mb={2}>
          <Text fontSize="sm" fontWeight="bold" mr={2}>
            Location:
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            {location}
          </Text>
        </Flex>

        <Flex align="center" gap={2}>
          <Text fontSize="sm" fontWeight="bold">
            Repo URL:
          </Text>
          <Link href={repoUrl} isExternal display="flex" alignItems="center">
            {repoUrl}
            <FiExternalLink style={{ marginLeft: '4px' }} />
          </Link>
        </Flex>
      </Box>
    </motion.div>
  );
};
