import React from 'react';
import { Text, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ExpoJudgingSession, Project } from '@hangar/shared';
import NextLink from 'next/link';
import { BsThreeDots } from 'react-icons/bs';
import { openErrorToast, openSuccessToast } from '../../../utils/CustomToast';
import { useExpoJudgingSessionStore } from '../../../../stores/expoJudgingSession';
import { fetchProjects } from '../../../ProjectsSelect/fetchProjects';

export const JudgingSessionOptionsButton: React.FC = () => {
  const { addExpoJudgingSession } = useExpoJudgingSessionStore();
  let expoJudgingSession: ExpoJudgingSession | undefined;

  let projects: Project[] = [];
  const tryFetchProjects = async () => {
    try {
      projects = await fetchProjects();
      openSuccessToast({
        title: 'Success!',
        description: 'Projects successfully fetched.',
      });
    } catch {
      openErrorToast({
        title: 'An error occurred.',
        description: 'Unable to fetch projects.',
      });
    }

    return projects.map(({ id }) => id);
  };

  const tryPostExpoJudgingSession = async () => {
    try {
      await addExpoJudgingSession({ projectIds: await tryFetchProjects() });
      openSuccessToast({
        title: 'Success!',
        description: 'Expo Judging Session successfully created.',
      });
    } catch {
      openErrorToast({
        title: 'An error occurred.',
        description: 'Unable to create a new Expo Judging Session.',
      });
    }

    return expoJudgingSession;
  };

  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={'options'} icon={<BsThreeDots />} />
      <MenuList>
        <MenuItem py={3} onClick={tryPostExpoJudgingSession}>
          <Text>Create Expo Judging Session</Text>
        </MenuItem>

        <NextLink passHref href="/admin/createCriteriaJudgingSession">
          <MenuItem as="a" py={3}>
            <Text>Create Criteria Judging Session</Text>
          </MenuItem>
        </NextLink>
      </MenuList>
    </Menu>
  );
};
