import React from 'react';
import { Checkbox, Flex, Text } from '@chakra-ui/react';
import { Project } from '@hangar/shared';
import { ProjectsSelectStyleContext } from './ProjectsSelectStyleContext';

type ProjectSelectActionsProps = {
  projects?: Project[];
  selectedProjects: Project[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

export const ProjectSelectActions: React.FC<ProjectSelectActionsProps> = ({
  projects,
  selectedProjects,
  onSelectAll,
  onDeselectAll,
}) => {
  const { rowPadding, checkboxSize, checkboxPadding } = React.useContext(
    ProjectsSelectStyleContext,
  );

  const allSelected = React.useMemo(
    () => !!projects?.length && projects.length === selectedProjects?.length,
    [projects, selectedProjects],
  );

  const clickHandler = allSelected ? onDeselectAll : onSelectAll;

  return (
    <Flex alignItems="center" h="10" px={rowPadding}>
      <Flex cursor="pointer">
        <Checkbox
          px={checkboxPadding}
          isChecked={allSelected}
          size={checkboxSize}
          onChange={clickHandler}
        />
        <Text onClick={clickHandler}>{allSelected ? 'Remove' : 'Add'} All</Text>
      </Flex>
    </Flex>
  );
};
