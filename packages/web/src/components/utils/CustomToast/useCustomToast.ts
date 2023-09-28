import { UseToastOptions } from '@chakra-ui/react';
import { create } from 'zustand';
import { defaultErrorToastProps } from './defaultErrorToastProps';

type OpenErrorToastArgs = UseToastOptions;

type CustomToastStore = {
  toastValues?: UseToastOptions;
  openErrorToast: (args: OpenErrorToastArgs) => void;
  openSuccessToast: () => void;
};

export const useCustomToast = create<CustomToastStore>((set) => ({
  toastValues: undefined,
  openErrorToast: (args) => {
    set({ toastValues: { ...defaultErrorToastProps, ...args } });
  },
  openSuccessToast: () => {},
}));
