import { Button, Flex } from '@chakra-ui/react';
import { CriteriaJudgingSession, Project } from '@hangar/shared';
import React from 'react';
import { ProjectDetails } from './ProjectDetails';

type CriteriaJudgingFormProps = {
  project: Project;
  criteriaJudgingSession: CriteriaJudgingSession;
};

export const CriteriaJudgingForm: React.FC<CriteriaJudgingFormProps> = ({
  project,
  // criteriaJudgingSession,
}) => (
  <Flex direction="column" w="full" gap={10}>
    <ProjectDetails project={project} />

    <form onSubmit={() => {}}>
      <Button>Submit</Button>
    </form>
  </Flex>
);
