import { Flex, Heading, Text } from '@chakra-ui/react';
import { Config, Project } from '@hangar/shared';
import React from 'react';
import { colors } from '../../../theme';

type CriteriaJudgingFormProps = { project: Project };

export const CriteriaJudgingForm: React.FC<CriteriaJudgingFormProps> = ({ project }) => (
  <Flex direction="column" w="full">
    <Heading>{project.name}</Heading>
    <Text>{project.description}</Text>
    <Text color={colors.muted}>
      {Config.project.locationLabel}: {project.location}
    </Text>
  </Flex>
);
