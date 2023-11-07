import React from 'react';
import { Config } from '@hangar/shared';
import { create } from 'zustand';

type SignInWithSlackArgs = {
  returnTo?: string;
};

type RedirectToAuthStore = {
  isOpen: boolean;
  returnTo?: string;
  closeModal: () => void;
  triggerRedirect: (args?: SignInWithSlackArgs) => void;
};

const useRedirectToAuthStore = create<RedirectToAuthStore>((set) => ({
  isOpen: false,
  returnTo: undefined,
  closeModal: () => {
    set({ isOpen: false });
  },
  triggerRedirect: ({ returnTo } = {}) => {
    set({ isOpen: true, returnTo });
  },
}));

export const useRedirectToAuth = () => {
  const { isOpen, returnTo } = useRedirectToAuthStore();
  const { triggerRedirect, closeModal } = useRedirectToAuthStore.getState();
  const redirect = React.useCallback(() => {
    if (!returnTo) {
      window.location.href = `/api/auth`;
      return;
    }

    const returnToQuery = new URLSearchParams({
      [Config.global.authReturnUriParamName]: returnTo,
    }).toString();

    window.location.href = `/api/auth?${returnToQuery}`;
  }, [returnTo]);

  return {
    isOpen,
    closeModal,
    triggerRedirect,
    redirect,
  };
};

export const { triggerRedirect } = useRedirectToAuthStore.getState();
