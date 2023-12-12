import { NextPage } from 'next';
import { Config } from '@hangar/shared';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Prizes } from '../components/Prizes';
import { usePrizesStore } from '../stores/prizes';
import { ProjectRegistrationCTA } from '../components/ProjectRegistrationCTA';

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
      <Flex direction="column" gap={5}>
        {Config.homepage.welcome.content.map((text) => (
          <Text key={text.substring(0, 15)} fontSize="xl">
            {text}
          </Text>
        ))}
      </Flex>

      <ProjectRegistrationCTA />

      <Flex gap={5} direction={{ base: 'column', sm: 'row' }}>
        <Flex direction="column" gap={10} flex={{ base: 1, md: 2 }}>
          {/* Content sections */}
          <Flex direction="column" gap={2}>
            <Heading>{Config.homepage.challenge.title}</Heading>

            {Config.homepage.challenge.content.map((text) => (
              <Text key={text.substring(0, 15)} fontSize="xl">
                {text}
              </Text>
            ))}
          </Flex>

          {Config.homepage.sections.map((section) => (
            <Flex key={section.title} direction="column" gap={2}>
              <Heading>{section.title}</Heading>

              {section.content.map((text) => (
                <Text key={text.substring(0, 15)} fontSize="xl" whiteSpace="pre-wrap">
                  {text}
                </Text>
              ))}

              {section.links && (
                <Flex direction={{ base: 'column', sm: 'row' }} gap={2}>
                  {section.links.map(({ url, title }) => (
                    <Box key={url}>
                      <Button
                        onClick={() => {
                          window.open(url, '_blank');
                        }}
                      >
                        {title ?? 'Read More'}
                      </Button>
                    </Box>
                  ))}
                </Flex>
              )}
            </Flex>
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
