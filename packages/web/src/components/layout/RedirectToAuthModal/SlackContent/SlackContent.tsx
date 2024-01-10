import React from 'react';
import { Flex, Heading, Code, Button, Text, useClipboard } from '@chakra-ui/react';
import { env } from '../../../../env';
import { JoinSlackButton } from '../../../JoinSlackButton';

type SlackContentProps = {
  secondsRemaining?: number;
  onContinue: () => void;
};

export const SlackContent: React.FC<SlackContentProps> = ({ secondsRemaining, onContinue }) => {
  const { onCopy } = useClipboard(env.slackWorkspaceName ?? '');

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={7}
      p={2}
      textAlign="center"
    >
      <Heading>
        {secondsRemaining !== undefined
          ? `Redirecting to login in ${secondsRemaining} seconds...`
          : 'Redirecting...'}
      </Heading>
      <Text fontWeight="bold" fontSize="xl">
        The next screen will ask for a <Code>Slack Workspace Name</Code>
      </Text>
      <Flex direction="column" alignItems="center" gap={1}>
        <Text>Workspace Name:</Text>
        <Code>{env.slackWorkspaceName}</Code>
      </Flex>
      <Button
        maxW="full"
        variant="secondary"
        onClick={() => {
          onCopy();
          onContinue();
        }}
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        py={{ base: 6, md: 0 }}
      >
        Copy Workspace Name and Continue
      </Button>

      <JoinSlackButton variant="ghost" />
    </Flex>
  );
};
