import React from 'react';
import { Text, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ExpoJudgingSession } from '@hangar/shared';
import { BsThreeDots } from 'react-icons/bs';
import { openErrorToast, openSuccessToast } from '../../../utils/CustomToast';
import { useExpoJudgingSessionStore } from '../../../../stores/expoJudgingSession';

export const JudgingSessionOptionsButton: React.FC = () => {
  const { addExpoJudgingSession } = useExpoJudgingSessionStore();
  let expoJudgingSession: ExpoJudgingSession | undefined;

  const tryPostExpoJudgingSession = async () => {
    try {
      await addExpoJudgingSession();
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

        <MenuItem py={3}>
          <Text>Create Criteria Judging Session</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
