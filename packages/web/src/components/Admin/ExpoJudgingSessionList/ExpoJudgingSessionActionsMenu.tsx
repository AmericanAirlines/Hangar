import React from 'react';
import { useRouter } from 'next/router';
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  MenuItemProps,
  useClipboard,
} from '@chakra-ui/react';
import { BsChevronDown } from 'react-icons/bs';
import { ExpoJudgingSession } from '@hangar/shared';
import { openSuccessToast } from '../../utils/CustomToast';
import { env } from '../../../env';

type ExpoJudgingSessionActionsMenuProps = {
  expoJudgingSession: ExpoJudgingSession;
};

const menuItemStyle: MenuItemProps = {
  py: 3,
};

export const ExpoJudgingSessionActionsMenu: React.FC<ExpoJudgingSessionActionsMenuProps> = ({
  expoJudgingSession,
}) => {
  const router = useRouter();
  const invitePath = React.useMemo(() => {
    const inviteCodeQueryKey = 'inviteCode';
    const inviteCodeQueryString = new URLSearchParams({
      [inviteCodeQueryKey]: expoJudgingSession.inviteCode,
    }).toString();
    return `/expoJudgingSession/${expoJudgingSession.id}?${inviteCodeQueryString}`;
  }, [expoJudgingSession]);
  const { onCopy } = useClipboard(`${env.baseUrl}${invitePath}`);

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem
          {...menuItemStyle}
          onClick={() => {
            onCopy();
            openSuccessToast({ title: 'Link copied to clipboard' });
          }}
        >
          Copy Invite Link
        </MenuItem>

        <MenuItem
          {...menuItemStyle}
          onClick={() => {
            void router.push(invitePath);
          }}
        >
          Join Session
        </MenuItem>

        <MenuItem
          {...menuItemStyle}
          onClick={() => {
            void router.push(`/admin/expoJudgingSession/${expoJudgingSession.id}/results`);
          }}
        >
          See Results
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
