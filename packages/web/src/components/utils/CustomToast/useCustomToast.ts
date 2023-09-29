import { UseToastOptions } from '@chakra-ui/react';
import { create } from 'zustand';
import { defaultErrorToastProps } from './defaultErrorToastProps';
import { defaultSuccessToastProps } from './defaultSuccessToastProps';

type OpenErrorToastArgs = UseToastOptions;
type OpenSuccessToastArgs = UseToastOptions;

type CustomToastStore = {
  toastValues?: UseToastOptions;
  openErrorToast: (args: OpenErrorToastArgs) => void;
  openSuccessToast: (args: OpenSuccessToastArgs) => void;
};

export const useCustomToast = create<CustomToastStore>((set) => ({
  toastValues: undefined,
  openErrorToast: (args) => {
    set({ toastValues: { ...defaultErrorToastProps, ...args } });
  },
  openSuccessToast: (args) => {
    set({ toastValues: { ...defaultSuccessToastProps, ...args } });
  },
}));

export const { openErrorToast, openSuccessToast } = useCustomToast.getState();
