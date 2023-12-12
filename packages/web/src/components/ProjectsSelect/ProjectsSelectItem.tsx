import { Checkbox, Flex, Text } from '@chakra-ui/react';
import { Config, Project } from '@hangar/shared';
import React from 'react';
import { ProjectsSelectStyleContext } from './ProjectsSelectStyleContext';

type ProjectsSelectItemProps = {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
};

export const ProjectsSelectItem: React.FC<ProjectsSelectItemProps> = ({
  project,
  isSelected,
  onClick,
}) => {
  const { rowPadding, checkboxSize, checkboxPadding } = React.useContext(
    ProjectsSelectStyleContext,
  );

  return (
    <Flex px={rowPadding} cursor="pointer">
      <Checkbox
        size={checkboxSize}
        isChecked={isSelected}
        onChange={onClick}
        px={checkboxPadding}
      />
      <Flex
        direction={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'baseline', md: 'center' }}
        gap={{ base: 1, md: 3 }}
        onClick={onClick}
        w="full"
      >
        <Text>{project.name}</Text>
        {!!project.location && (
          <Text fontSize="xs">
            ({Config.project.locationLabel}: {project.location})
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
