import {
  Box,
  Button,
  Text,
  Code,
  Flex,
  Heading,
  useClipboard,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ProjectWithInviteCode } from '@hangar/shared';
import React from 'react';
import { env } from '../../../env';
import { openSuccessToast } from '../../utils/CustomToast';

type CopyProjectInviteCodeProps = { project: ProjectWithInviteCode };

export const CopyProjectInviteCode: React.FC<CopyProjectInviteCodeProps> = ({ project }) => {
  const inviteCodeUrl = `${env.baseUrl}?projectInviteCode=${project.inviteCode}`;
  const { onCopy } = useClipboard(inviteCodeUrl);
  return (
    <Flex p={3} direction={'column'} alignItems={'center'} gap={10}>
      <Flex direction={'column'} alignItems={'center'}>
        <Heading size={'lg'}>Invite Your Team</Heading>
        <Text>Share the link below to add others to this project.</Text>
      </Flex>

      <Flex
        onClick={() => {
          onCopy();
          openSuccessToast({ title: 'Link Copied' });
        }}
        direction={'column'}
        alignItems={'center'}
        gap={2}
        cursor={'pointer'}
      >
        <Code>{inviteCodeUrl}</Code>
        <Box>
          <Button>Copy Invite Code</Button>
        </Box>
      </Flex>

      <Alert status="warning">
        <AlertIcon />
        <Text>
          This is the only point where you can access the invite code. Make sure to copy it before
          leaving this page.
        </Text>
      </Alert>
    </Flex>
  );
};
