import { Box, Flex, Heading, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { CriteriaJudgingSessionResult } from '@hangar/shared';
import { colors } from '../../../theme';

type CriteriaJudgingSessionProjectResultsProps = {
  projectWithResults: CriteriaJudgingSessionResult;
};

export const CriteriaJudgingSessionProjectResults: React.FC<
  CriteriaJudgingSessionProjectResultsProps
> = ({ projectWithResults: project }) => {
  if (project.results === undefined) return null;

  return (
    <Flex direction="column" w="full" p={5} bgColor={colors.brandPrimary} rounded="2xl">
      <Flex alignItems="center" justifyContent="space-between" gap={3} w="full">
        <Heading wordBreak="break-word">{project.name}</Heading>
        <Box>
          <Stat>
            <StatLabel>Score</StatLabel>
            <StatNumber>{project.results.score.toFixed(2)}</StatNumber>
          </Stat>
        </Box>
      </Flex>
      <Text whiteSpace="pre-wrap">{project.description}</Text>
    </Flex>
  );
};
