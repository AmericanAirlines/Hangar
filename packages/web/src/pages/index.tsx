import { NextPage } from 'next';
import { Config } from '@hangar/shared';
import { Flex, Heading, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Prizes } from '../components/Prizes';
import { RegistrationModal } from '../components/RegistrationModal';
import { usePrizesStore } from '../stores/prizes';

const Home: NextPage = () => {
  const { doneLoading: prizesFetched } = usePrizesStore();

  React.useEffect(() => {
    const { prizes } = usePrizesStore.getState();
    if (!prizes) void usePrizesStore.getState().fetchPrizes();
  }, []);

  return (
    <PageContainer
      pageTitle={Config.global.appName}
      heading={Config.homepage.welcome.title}
      isLoading={!prizesFetched}
    >
      <Box>
        <RegistrationModal />
      </Box>
      <Flex direction="column" gap={5}>
        {Config.homepage.welcome.content.map((text) => (
          <Text key={text.substring(0, 15)} fontSize="xl">
            {text}
          </Text>
        ))}
      </Flex>

      <Flex gap={5} direction={{ base: 'column', sm: 'row' }}>
        <Flex direction="column" flex={{ base: 1, md: 2 }} gap={2}>
          <Heading>{Config.homepage.challenge.title}</Heading>

          {Config.homepage.challenge.content.map((text) => (
            <Text key={text.substring(0, 15)} fontSize="xl">
              {text}
            </Text>
          ))}
        </Flex>

        <Flex flex={1}>
          <Prizes />
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default Home;
export { getServerSideProps } from '../components/Chakra';
