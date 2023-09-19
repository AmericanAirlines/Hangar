import React from 'react';
import { RegistrationForm } from './RegistrationForm';
import { PopUpModal } from '../PopupModal';

const modalProps = {
  openModalText: 'Register',
  header: 'Project Registration',
  openButtonProps: { colorScheme: 'blue' },
};

export const RegistrationModal: React.FC = () => (
  <PopUpModal {...modalProps}>
    <RegistrationForm />
  </PopUpModal>
);
