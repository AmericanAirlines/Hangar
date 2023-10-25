import { Flex, FormControl, FormLabel, Link } from '@chakra-ui/react';
import { Schema } from '@hangar/shared';
import { CriteriaFields, CriteriaFieldsProps } from './CriteriaFields';

export type CriteriaListProps = Omit<CriteriaFieldsProps, 'index'> & {};

export const CriteriaList: React.FC<CriteriaListProps> = (props) => (
  <FormControl id="criteria">
    <FormLabel>Criteria</FormLabel>
    <Flex direction="column" gap={10}>
      {props.formik.values.criteriaList.map((criteria, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <CriteriaFields key={`criteria-${index}`} index={index} {...props} />
      ))}
    </Flex>
    <Flex justifyContent="flex-end" pt={2}>
      <Link
        hidden={
          props.formik.values.criteriaList.length >=
          Schema.criteriaJudgingSession.PostValidation.MAX_CRITERIA
        }
        onClick={props.addCriteria}
      >
        Add Criteria
      </Link>
    </Flex>
  </FormControl>
);
