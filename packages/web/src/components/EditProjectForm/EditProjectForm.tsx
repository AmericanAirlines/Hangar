import { Flex } from '@chakra-ui/react';
import { Project } from '@hangar/shared';
import { useEditProjectForm } from './useEditProjectForm';

type EditProjectFormProps = {
  onComplete: (updatedProject: Project) => void;
};

export const EditProjectForm: React.FC<EditProjectFormProps> = () => {
  const { formik, isLoading, errors } = useEditProjectForm();

  return (
    <Flex direction="column" gap={3}>
      <form onSubmit={formik.handleSubmit}></form>
    </Flex>
  );
};
