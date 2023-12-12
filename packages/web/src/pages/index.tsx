import { NextPage } from 'next';
import { Config } from '@hangar/shared';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Prizes } from '../components/Prizes';
import { usePrizesStore } from '../stores/prizes';
import { ProjectRegistrationCTA } from '../components/ProjectRegistrationCTA';
import { useRouter } from 'next/router';
import { useUserStore } from '../stores/user';

const Home: NextPage = () => {
  const { doneLoading: prizesFetched } = usePrizesStore();
  React.useEffect(() => {
    const { prizes } = usePrizesStore.getState();
    if (!prizes) void usePrizesStore.getState().fetchPrizes();
  }, []);

  const router = useRouter();
  const handledRef = React.useRef(false);
  const { user, doneLoading } = useUserStore();

  React.useEffect(() => {
    const handleUrl = async () => {
      // Check for query param
      // If query param present; perform actions

      // Update the router to remove query params
      await router.replace(router.pathname, undefined, { shallow: true });
    };

    if (!handledRef.current) {
      // First time router is ready AND we haven't evaluated query params
      handledRef.current = true;
      void handleUrl();
    } else {
      // Router isn't ready for use
      // OR
      // We've already looked at the URL
    }
  }, [user, doneLoading]);

  const countRef = React.useRef(0);
  React.useEffect(() => {
    setInterval(() => {
      console.log('wat');
      countRef.current += 1;
    }, 1000);
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
      <Text>Count: {countRef.current}</Text>
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
