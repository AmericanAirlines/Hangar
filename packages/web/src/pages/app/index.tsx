import React from 'react';
import {
  Text,
  Heading,
  HStack,
  VStack,
  useColorModeValue,
  Box,
  Button,
  List,
  ListItem,
  ListIcon,
  Link,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { TiMinus } from 'react-icons/ti';
import { AppLayout } from '../../components/Layout';
import { AppContainer } from '../../components/AppContainer/AppContainer';
import { Prizes } from '../../components/Prizes';
import { Schedule } from '../../components/Schedule';

const AppHome: NextPage = () => (
  <AppLayout>
    <Box backgroundColor={useColorModeValue('gray.200', 'gray.900')}>
      <AppContainer>
        <HStack paddingY={12} spacing={16} alignItems="flex-start">
          <VStack flex={1} alignItems="flex-start" spacing={4}>
            <Heading>Welcome</Heading>
            <Text>
              We&apos;re big on attending hackathons, sharing our tech, and helping students have an
              amazing time. Come join us for a chance to meet our team, learn more about what we do,
              and win some great prizes! If you are want to be eligible for our prizes, you must
              register on this site.
            </Text>
            <HStack spacing={4}>
              <Button colorScheme="blue">Pre-Register</Button>
              <Button variant="ghost">Remind Me</Button>
            </HStack>
          </VStack>
          <VStack
            alignItems="stretch"
            spacing={4}
            width="350px"
            padding={4}
            backgroundColor={useColorModeValue('gray.50', 'rgba(0, 0, 0, 0.35)')}
            borderRadius="md"
          >
            <Heading as="h3" size="md">
              Prizes
            </Heading>
            <Prizes />
          </VStack>
        </HStack>
      </AppContainer>
    </Box>
    <Box>
      <AppContainer>
        <HStack paddingY={12} spacing={16} alignItems="flex-start">
          <VStack flex={1} alignItems="flex-start" spacing={12}>
            <VStack alignItems="stretch">
              <Heading variant="h2" size="lg">
                Our Challenge
              </Heading>
              <Text>
                Thousands of people fly American each and every day. This awesome responsibility
                opens the door to incredible opportunities. Help us elevate the customer travel
                experience, boost operational efficiencies and employee performance (baggage
                handling, gate agents, etc.), or enhance American&apos;s brand image with your
                innovative hacks!
              </Text>
            </VStack>
            <VStack alignItems="stretch">
              <Heading variant="h2" size="lg">
                How to Win
              </Heading>
              <Text>
                Follow these guidelines and you&apos;ll have a much higher chance of winning one of
                our awesome prizes!
              </Text>
              <VStack paddingY={4} alignItems="stretch">
                <Heading variant="h3" size="md">
                  Judging Criteria
                </Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={TiMinus} />
                    Likelihood of your app improving customer experience, boosting operational
                    efficiencies and employee performance, or enhancing brand image
                  </ListItem>
                  <ListItem>
                    <ListIcon as={TiMinus} />
                    Look and feel
                  </ListItem>
                  <ListItem>
                    <ListIcon as={TiMinus} />
                    Functionality, how much of your idea is built out
                  </ListItem>
                  <ListItem>
                    <ListIcon as={TiMinus} />
                    API Utilization (use our Flight Engine, or any other source of data that you did
                    not create)
                  </ListItem>
                </List>
              </VStack>
              <Text>
                Attendees and hacks must adhere to all event rules and policies. We reserve the
                right to perform a technical inspection for any hack.
              </Text>
            </VStack>
            <VStack alignItems="stretch">
              <Heading variant="h2" size="lg">
                Resources
              </Heading>
              <Text>
                Wanting to use some flight data in your hack? We&apos;ve got a great project setup
                that will generate mock flight data for you! Check out Flight Engine, it&apos;s
                super easy to deploy on the free-tier of Heroku. If you have any questions or issues
                setting it up, please let us know and one of us will help you out.
              </Text>
              <Link href="https://github.com/AmericanAirlines/Flight-Engine#readme">
                https://github.com/AmericanAirlines/Flight-Engine#readme
              </Link>
            </VStack>
          </VStack>
          <VStack alignItems="stretch" spacing={4} width="350px">
            <Heading as="h2" size="md">
              Schedule
              <Text fontSize="sm" fontWeight="medium" opacity={0.5}>
                Click to read details
              </Text>
            </Heading>
            <Schedule />
          </VStack>
        </HStack>
      </AppContainer>
    </Box>
  </AppLayout>
);

export default AppHome;
