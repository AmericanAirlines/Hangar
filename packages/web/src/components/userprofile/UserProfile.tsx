import React from 'react';
import { Heading, HStack, Spacer, useTheme, VStack, Text, Box } from '@chakra-ui/react';

export interface UserProfileProps {
  name: string;
  pronouns?: string;
  schoolName?: string;
}

export const UserProfile: React.FC<UserProfileProps> = (user: UserProfileProps) => {
  return (
    <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
      <Text fontSize="6xl">{user.name}</Text>
      <Text fontSize="xl">{user.pronouns}</Text>
      <Text fontSize="xl">{user.schoolName}</Text>
    </Box>
  );
};
