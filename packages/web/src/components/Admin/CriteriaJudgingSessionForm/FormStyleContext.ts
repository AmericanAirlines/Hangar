import { InputProps, TextareaProps } from '@chakra-ui/react';
import { createContext } from 'react';

export type FormStyleContextValues = {
  inputStyleProps: InputProps & TextareaProps;
};

export const FormStyleContext = createContext<FormStyleContextValues>({
  inputStyleProps: {},
});
