import React from 'react';
import { RegistrationForm } from '.';
import { PopUpModal } from '../PopupModal';

export const RegistrationModal: React.FC = () => (
  <PopUpModal openModalText="Register" header="Project Registration">
    <RegistrationForm />
  </PopUpModal>
);
