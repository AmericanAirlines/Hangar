import { Flex, Heading, Button } from '@chakra-ui/react';

type PingfedContentProps = {
  secondsRemaining?: number;
  onContinue: () => void;
};

export const PingfedContent: React.FC<PingfedContentProps> = ({ secondsRemaining, onContinue }) => (
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
    <Button
      maxW="full"
      variant="secondary"
      onClick={() => {
        onContinue();
      }}
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      py={{ base: 6, md: 0 }}
    >
      Continue to Login
    </Button>
  </Flex>
);
