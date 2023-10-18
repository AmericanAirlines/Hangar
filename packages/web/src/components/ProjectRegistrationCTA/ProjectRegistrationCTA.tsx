import { Collapse, Flex, Heading, Text } from '@chakra-ui/react';
import { wait } from '@hangar/shared';
import React from 'react';
import { colors } from '../../theme';
import { ProjectRegistrationButton } from '../ProjectRegistrationButton';
import { useUserStore } from '../../stores/user';

export const ProjectRegistrationCTA: React.FC = () => {
  const [delayFinished, setDelayFinished] = React.useState(false);
  const { user, doneLoading } = useUserStore();

  React.useEffect(() => {
    const pageDelay = async () => {
      await wait(2500);
      setDelayFinished(true);
    };
    void pageDelay();
  }, []);

  return (
    <Collapse in={delayFinished && ((doneLoading && !user) || !user?.project)}>
      <Flex
        direction="column"
        rounded="xl"
        bgColor={colors.brandPrimary}
        boxShadow="2xl"
        p={5}
        w="full"
        gap={3}
      >
        <Heading>Hey there 👋</Heading>

        <Text fontSize="lg">You look new around here! Hacking with us? Register your project!</Text>

        <ProjectRegistrationButton />
      </Flex>
    </Collapse>
  );
};
