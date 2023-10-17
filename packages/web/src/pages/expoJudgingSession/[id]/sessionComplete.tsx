import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Button, keyframes } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useConfetti } from '../../../pageUtils/confetti/confetti';

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
  const router = useRouter();
  const [trigger1, Cannon1] = useConfetti();
  const [trigger2, Cannon2] = useConfetti();

  useEffect(() => {
    trigger1();
    trigger2();
  }, []); // eslint-disable-line

  return (
    <PageContainer pageTitle={'Session Complete'} heading={'You did it!'}>
      <Box>
        <Box animation={animation} style={{ ...centered, ...largeIcon }}>
          😃
        </Box>
        <Cannon1 />
        <Cannon2 right />
        <Button
          style={centered}
          onClick={() => {
            void router.push('/');
          }}
        >
          Return to Home
        </Button>
      </Box>
    </PageContainer>
  );
};

export default SessionComplete;
