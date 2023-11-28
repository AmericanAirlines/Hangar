import React from 'react';
import NextLink from 'next/link';
import { Menu, MenuButton, Button, MenuList, MenuItem, useClipboard } from '@chakra-ui/react';
import { BsChevronDown } from 'react-icons/bs';
import { ExpoJudgingSession, CriteriaJudgingSession } from '@hangar/shared';
import { openSuccessToast } from '../../utils/CustomToast';
import { env } from '../../../env';

type JudgingSessionActionsMenuProps = {
  judgingSession: ExpoJudgingSession | CriteriaJudgingSession;
};

export const JudgingSessionActionsMenu: React.FC<JudgingSessionActionsMenuProps> = ({
  judgingSession,
}) => {
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
          py={3}
          onClick={() => {
            onCopy();
            openSuccessToast({ title: 'Link copied to clipboard' });
          }}
        >
          Copy Invite Link
        </MenuItem>

        <NextLink href={invitePath}>
          <MenuItem as="a" py={3}>
            Join Session
          </MenuItem>
        </NextLink>

        <NextLink href={`/admin/${judgingSessionType}/${judgingSession.id}`}>
          <MenuItem as="a" py={3}>
            See Results
          </MenuItem>
        </NextLink>
      </MenuList>
    </Menu>
  );
};
