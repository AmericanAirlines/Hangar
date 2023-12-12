import { CheckboxProps, FlexProps } from '@chakra-ui/react';
import { createContext } from 'react';

type ProjectsSelectStyleContextArgs = {
  rowPadding: FlexProps['px'];
  checkboxSize: CheckboxProps['size'];
  checkboxPadding: FlexProps['px'];
};

export const ProjectsSelectStyleContext = createContext<ProjectsSelectStyleContextArgs>({
  rowPadding: 0,
  checkboxSize: 'md',
  checkboxPadding: 0,
});
