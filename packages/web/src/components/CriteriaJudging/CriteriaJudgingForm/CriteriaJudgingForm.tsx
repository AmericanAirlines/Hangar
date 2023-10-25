/* eslint-disable max-lines, no-underscore-dangle */
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputProps,
  Text,
  TextareaProps,
} from '@chakra-ui/react';
import { CriteriaJudgingSession, Project } from '@hangar/shared';
import React from 'react';
import { ProjectDetails } from './ProjectDetails';
import { useCriteriaJudgingForm } from './useCriteriaJudgingForm';
import { FormHelperHint } from '../../Forms';
import { colors } from '../../../theme';

type CriteriaJudgingFormProps = {
  project: Project;
  criteriaJudgingSession: CriteriaJudgingSession;
};

export const CriteriaJudgingForm: React.FC<CriteriaJudgingFormProps> = ({
  project,
  criteriaJudgingSession,
}) => {
  const [submissionCreated, setSubmissionCreated] = React.useState(false);
  const { formik, isLoading, errors } = useCriteriaJudgingForm({
    project,
    criteriaJudgingSession,
    onSubmissionComplete: () => setSubmissionCreated(true),
  });

  React.useEffect(() => {
    // On project change, reset submission created flag
    setSubmissionCreated(false);
  }, [project]);

  const inputElementsStyleProps: InputProps & TextareaProps = {
    variant: 'filled',
    isDisabled: isLoading || submissionCreated,
  };

  return (
    <Flex direction="column" w="full" gap={10}>
      <ProjectDetails project={project} />

      <form onSubmit={formik.handleSubmit}>
        <Flex direction="column" gap={5}>
          {formik.values.scores.map(({ score, criteria: criteriaId }, idx) => {
            const criteria = criteriaJudgingSession.criteriaList.find((c) => c.id === criteriaId);

            if (!criteria) return null;

            return (
              // eslint-disable-next-line react/no-array-index-key
              <FormControl key={idx} id={`scores[${idx}].score`}>
                <FormLabel>
                  <Heading size="md">{criteria.title}</Heading>
                </FormLabel>
                <Text pb={2} whiteSpace={'pre-wrap'} wordBreak="break-word">
                  {criteria.description}
                </Text>
                <Input
                  {...inputElementsStyleProps}
                  value={score}
                  isInvalid={!!errors?.scores?.[idx]?.score?._errors}
                  onChange={(e) => {
                    if (
                      e.target.value !== '' &&
                      (Number.isNaN(Number(e.target.value)) ||
                        Number(e.target.value) < criteria.scaleMin ||
                        Number(e.target.value) > criteria.scaleMax)
                    ) {
                      return;
                    }
                    formik.handleChange(e);
                  }}
                />
                <Text color={colors.muted}>
                  Score must be between {criteria.scaleMin} and {criteria.scaleMax}
                </Text>
                <FormHelperHint
                  hint={criteria.scaleDescription}
                  error={errors?.scores?.[idx]?.score?._errors}
                />
              </FormControl>
            );
          })}

          <Button isLoading={isLoading} isDisabled={submissionCreated} type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
