import React from 'react';
import { ZodFormattedError, z } from 'zod';
import { useFormik } from 'formik';
import axios, { isAxiosError } from 'axios';
import { Project, ProjectWithInviteCode, Schema, SerializedProject } from '@hangar/shared';
import dayjs from 'dayjs';
import { openErrorToast } from '../utils/CustomToast';
import { useUserStore } from '../../stores/user';

type CreateProjectValues = z.infer<typeof Schema.project.post>;
type UpdateProjectValues = z.infer<typeof Schema.project.post>;
type CreateOrUpdateProjectValues = CreateProjectValues | UpdateProjectValues;

export type RegistrationFormProps = {
  project?: Project;
  onComplete: (project: Project | ProjectWithInviteCode) => void;
};

export const useProjectRegistrationForm = ({ onComplete, project }: RegistrationFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [validateWhileTyping, setValidateWhileTyping] = React.useState(false);
  const [errors, setErrors] = React.useState<ZodFormattedError<CreateOrUpdateProjectValues>>();

  const { id } = project ?? {};
  const initialValues = {
    name: project?.name ?? '',
    description: project?.description ?? '',
    location: project?.location ?? '',
    repoUrl: project?.repoUrl ?? '',
  };
  const projectExists = !!id;

  const formik = useFormik<CreateOrUpdateProjectValues>({
    initialValues,
    validateOnChange: validateWhileTyping,
    validateOnBlur: true,
    validate: (values) => {
      const result = Schema.project[projectExists ? 'put' : 'post'].safeParse(values);

      if (result.success) {
        setErrors(undefined);
        return undefined;
      }
      setErrors(result.error.format());
      return { errorsExist: true };
    },
    async onSubmit(values) {
      try {
        setIsLoading(true);
        const { data: projectData } = await axios<SerializedProject>(
          projectExists ? `/api/project/${id}` : `/api/project`,
          {
            method: projectExists ? 'PUT' : 'POST',
            data: JSON.stringify({
              ...values,
              location: (values?.location ?? '').trim(),
            }),
            headers: { 'Content-Type': 'application/json' },
          },
        );

        await useUserStore.getState().fetchUser(); // Refresh user to populate project
        onComplete?.({
          ...projectData,
          createdAt: dayjs(projectData.createdAt),
          updatedAt: dayjs(projectData.updatedAt),
        });
      } catch (error) {
        let errorMessage =
          isAxiosError(error) && typeof error.response?.data === 'string'
            ? error.response.data
            : '';

        if (isAxiosError(error) && error.response?.status === 409) {
          errorMessage = 'Project already exists for user';
        }

        openErrorToast({
          title: 'Failed to create project',
          description: errorMessage,
        });
      }
      setIsLoading(false);
    },
  });

  React.useEffect(() => {
    if (formik.submitCount && !validateWhileTyping) {
      setValidateWhileTyping(true);
    }
  }, [formik.submitCount, validateWhileTyping]);

  return { formik, isLoading, errors };
};
