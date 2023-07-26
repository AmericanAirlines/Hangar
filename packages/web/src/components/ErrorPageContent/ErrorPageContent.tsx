import { Text, Image, VStack, Box, Button, Heading } from '@chakra-ui/react';
import { wait } from '@hangar/shared';
import React, { useEffect } from 'react';

interface ErrorPageContentProps {
  statusCode?: number;
}

const catGifs: string[] = [
  'https://media3.giphy.com/media/mlvseq9yvZhba/giphy.gif',
  'https://media3.giphy.com/media/13CoXDiaCcCoyk/giphy.gif',
  'https://media1.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif',
  'https://media0.giphy.com/media/lJNoBCvQYp7nq/giphy.gif',
  'https://media4.giphy.com/media/xTiQygY6HW1GjoYKFq/giphy.gif',
  'https://media3.giphy.com/media/bPWyTsy2huZji/giphy.gif',
  'https://media2.giphy.com/media/12bjQ7uASAaCKk/giphy.gif',
];

export const ErrorPageContent: (props: ErrorPageContentProps) => JSX.Element = ({ statusCode }) => {
  const [cooldown, setCooldown] = React.useState<number | undefined>();
  const [catGif, setCatGif] = React.useState<string | undefined>();
  let errorHeader: string;
  let errorBody: JSX.Element;
  let redirectUrl = '/';
  let redirectText = 'Try Again';

  useEffect(() => {
    setCatGif(catGifs[Math.round(Math.random() * (catGifs.length - 1))]);
    if ([429].includes(Number(statusCode))) {
      setCooldown(30);
    }
  }, [statusCode]);

  useEffect(() => {
    const decrementTimer = async () => {
      await wait(1000);
      setCooldown((cooldown ?? 1) - 1);
    };

    if (cooldown !== undefined) {
      void decrementTimer();
    }
  }, [cooldown]);

  switch (Number(statusCode)) {
    case 404:
      errorHeader = `👽 There's nothing to see here...`;
      errorBody = (
        <>
          <Text>Move along...</Text>
        </>
      );
      redirectUrl = '/';
      redirectText = 'Go Home 🛸';
      break;
    case 429:
      errorHeader = '🤠 Whoa there! Slow down, cowpoke!';
      errorBody = (
        <>
          <Text maxWidth="600px">
            {`We thought we were being generous with the number of requests per minute our users could
            make, but apparently we weren't prepared for your enthusiasm!`}
          </Text>
          <VStack>
            <Heading size="md">{`Here's a random cat gif to slow your roll...`}</Heading>
            <Image src={catGif} alt="a random cat" />
          </VStack>
          <Text maxWidth="600px">
            {`We're not exactly putting you in timeout, but we're gonna need you hold up for
            just a moment. Take a few deep breaths, look at the cat, and then try again.`}
          </Text>
        </>
      );
      break;
    default:
      errorHeader = '😵 Wow, we goofed up...';
      errorBody = (
        <>
          <Text maxWidth="500px">
            {
              "Oof this is awkward. Honestly this shouldn't be a thing... don't worry though, we just notified our dev team of the issue."
            }
          </Text>
          <Box textAlign="center">
            <Text>{`Check back soon and hopefully we'll be back online!`}</Text>
            <Text fontSize="12px">(Please use the button below sparingly)</Text>
          </Box>
        </>
      );
  }

  return (
    <>
      <Heading>{errorHeader}</Heading>
      {errorBody}
      <Button as="a" href={redirectUrl} disabled={!!cooldown}>
        {cooldown ? `${redirectText} in ${cooldown} seconds` : redirectText}
      </Button>
    </>
  );
};
