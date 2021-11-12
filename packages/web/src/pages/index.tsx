import { NextPage } from 'next';
import { Link, Button, Heading, HStack, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { MarketingLayout } from '../components/Layout';

const Home: NextPage = () => (
  <MarketingLayout>
    <VStack alignItems="center" paddingY={32} spacing={8}>
      <Heading size="4xl" textAlign="center" lineHeight="1.4">
        Welcome to Hangar 🛩️
      </Heading>
      <Text textAlign="center" maxWidth="60ch" fontSize="2xl" lineHeight="2">
        Hangar is an{' '}
        <Link
          target="_blank"
          href="https://github.com/AmericanAirlines/Hangar"
          isExternal
          color="teal.500"
          textDecoration={useColorModeValue('underline', 'none')}
        >
          Open Source
        </Link>{' '}
        Hackathon sponsorship platform.
      </Text>
      <Text textAlign="center" maxWidth="60ch" fontSize="2xl" lineHeight="2">
        We&apos;re happy you&apos;re here and we can&apos;t wait to see what you build! Let&apos;s
        get started 👇
      </Text>
      <HStack spacing={8}>
        <Button
          as="a"
          size="lg"
          colorScheme={useColorModeValue('teal', 'blue')}
          href="/app"
          variant={useColorModeValue('solid', 'outline')}
          p="7"
          fontWeight="bold"
          borderRadius="10px"
        >
          ✨ Get Started ✨
        </Button>
      </HStack>
    </VStack>
  </MarketingLayout>
);

export default Home;
export { getServerSideProps } from '../components/Chakra';
