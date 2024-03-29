import React from 'react';
import { Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { Config, Project } from '@hangar/shared';
import { BsChevronDown } from 'react-icons/bs';
import { colors } from '../../../theme';

type ProjectSelectionMenuProps = {
  projects: Project[];
  onSelect: (project: Project) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
};

export const ProjectSelectionMenu: React.FC<ProjectSelectionMenuProps> = ({
  projects,
  onSelect,
  containerRef,
}) => (
  <Flex w="full" justifyContent="stretch" position="relative" ref={containerRef} scrollMargin={20}>
    <Menu matchWidth>
      <MenuButton w="full">
        <Flex
          rounded="lg"
          borderColor={colors.brandPrimary}
          borderWidth={2}
          p={5}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="md">Select a Project</Heading>
          <BsChevronDown />
        </Flex>
      </MenuButton>

      <MenuList maxH="60vh" overflow="scroll">
        {projects?.map((project) => (
          <MenuItem key={project.id} onClick={() => onSelect(project)}>
            <Flex py={5} direction="column">
              <Heading size="sm">{project.name}</Heading>
              <Text>{project.description}</Text>
              {project.location && (
                <Text color={colors.muted}>
                  {Config.project.locationLabel}: {project.location}
                </Text>
              )}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </Flex>
);
