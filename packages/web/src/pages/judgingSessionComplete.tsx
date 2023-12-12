import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Button, keyframes } from '@chakra-ui/react';
import NextLink from 'next/link';
import { PageContainer } from '../components/layout/PageContainer';
import { useConfetti } from '../pageUtils/Confetti/Confetti';

const bob = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const centered = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
};
const largeIcon = {
  fontSize: '10rem',
};
const animation = `${bob} infinite 2s linear`;

const SessionComplete: NextPage = () => {
  const [trigger1, Cannon1] = useConfetti();
  const [trigger2, Cannon2] = useConfetti();

  useEffect(() => {
    // onMount ( only ever run once )
    trigger1();
    trigger2();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContainer
      pageTitle={'Judging Session Complete'}
      heading={'You did it!'}
      subHeading={"You've judged all projects"}
    >
      <Box style={{ cursor: 'default' }}>
        <Box animation={animation} style={{ ...centered, ...largeIcon }}>
          😃
        </Box>
        <Cannon1 />
        <Cannon2 right />
        <Box style={{ ...centered, opacity: 0.3, margin: '8px' }}>
          You can safely close your browser
        </Box>
        <NextLink passHref href="/">
          <Button as="a" style={centered}>
            Return to Home
          </Button>
        </NextLink>
      </Box>
    </PageContainer>
  );
};

export default SessionComplete;
