import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Box , keyframes} from '@chakra-ui/react';
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
const centeredLargeIcon = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '10rem',
  margin: '0 auto',
};
const animation = `${bob} infinite 2s linear`;


const SessionComplete: NextPage = () => {
  const [ trigger1 , Cannon1 ] = useConfetti()
  const [ trigger2 , Cannon2 ] = useConfetti()

  useEffect( () => {
    trigger1()
    trigger2()
  }, [] )
  
  return (
    <PageContainer
      pageTitle={'Session Complete'}
      heading={'You did it!'}
    >
      <Box>
        <Box animation={animation} style={centeredLargeIcon}>😃</Box>
        <Cannon1 />
        <Cannon2 right/>
      </Box>
    </PageContainer>
  );
};

export default SessionComplete;
