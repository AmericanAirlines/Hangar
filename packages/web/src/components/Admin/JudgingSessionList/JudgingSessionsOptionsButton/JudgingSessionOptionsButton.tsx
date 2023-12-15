import React from 'react';
import { Text, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import NextLink from 'next/link';
import { BsThreeDots } from 'react-icons/bs';

export const JudgingSessionOptionsButton: React.FC = () => (
  <Menu>
    <MenuButton as={IconButton} aria-label={'options'} icon={<BsThreeDots />} />
    <MenuList>
      <NextLink passHref href="/admin/createExpoJudgingSession">
        <MenuItem as="a" py={3}>
          <Text>Create Expo Judging Session</Text>
        </MenuItem>
      </NextLink>

      <NextLink passHref href="/admin/createCriteriaJudgingSession">
        <MenuItem as="a" py={3}>
          <Text>Create Criteria Judging Session</Text>
        </MenuItem>
      </NextLink>
    </MenuList>
  </Menu>
);
