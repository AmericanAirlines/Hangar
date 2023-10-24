import React from 'react';
import { Box, Button, Flex, List, ListItem, ListIcon, Heading } from '@chakra-ui/react';
import { BsFill1CircleFill, BsFill2CircleFill, BsFill3CircleFill } from 'react-icons/bs';
import { PageContainer } from '../../layout/PageContainer';
import { useExpoJudgingSessionFetcher } from '../../../pageUtils/expoJudgingSession/[id]/useExpoJudgingSessionFetcher';
import { colors } from '../../../theme/colors';

type ExpoJudgingIntroProps = { onStart: () => void };

export const ExpoJudgingIntro: React.FC<ExpoJudgingIntroProps> = ({ onStart }) => (
  <Flex direction="column" gap={5}>
    <Heading>How Judging Works </Heading>
    <Box>
      <List spacing={4}>
        <ListItem fontSize={20}>
          <ListIcon as={BsFill1CircleFill} color={colors.brandPrimaryLight} boxSize={6} />
          {`Locate the project you need to judge and listen to their amazing pitch.`}
        </ListItem>
        <ListItem fontSize={20}>
          <ListIcon as={BsFill2CircleFill} color={colors.brandPrimaryLight} boxSize={6} />
          {`After you heard the pitch and judged the project, quickly find you next one.`}
        </ListItem>
        <ListItem fontSize={20}>
          <ListIcon as={BsFill3CircleFill} color={colors.brandPrimaryLight} boxSize={6} />
          {`Continue judging projects until there's no more teams to judge or until judging has
          ended.`}
        </ListItem>
      </List>
    </Box>
    <Button onClick={onStart}>Start Judging</Button>
  </Flex>
);
