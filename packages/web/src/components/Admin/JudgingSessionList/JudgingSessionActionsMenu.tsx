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
import { ExpoJudgingSession, CriteriaJudgingSession } from '@hangar/shared';
import { openSuccessToast } from '../../utils/CustomToast';
import { env } from '../../../env';

type JudgingSessionActionsMenuProps = {
  judgingSession: ExpoJudgingSession | CriteriaJudgingSession;
};

const menuItemStyle: MenuItemProps = {
  py: 3,
};

export const JudgingSessionActionsMenu: React.FC<JudgingSessionActionsMenuProps> = ({
  judgingSession,
}) => {
  const router = useRouter();
  const judgingSessionType =
    'criteriaList' in judgingSession ? 'criteriaJudgingSession' : 'expoJudgingSession';

  const invitePath = React.useMemo(() => {
    const inviteCodeQueryKey = 'inviteCode';
    const inviteCodeQueryString = new URLSearchParams({
      [inviteCodeQueryKey]: judgingSession.inviteCode,
    }).toString();
    return `/${judgingSessionType}/${judgingSession.id}?${inviteCodeQueryString}`;
  }, [judgingSession, judgingSessionType]);
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
            void router.push(`/admin/${judgingSessionType}/${judgingSession.id}`);
          }}
        >
          See Results
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
