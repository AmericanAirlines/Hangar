import React from 'react';
import { Spinner } from '@chakra-ui/react';
import { RegistrationForm } from './RegistrationForm';
import { PopUpModal } from '../PopupModal';

export const RegistrationModal: React.FC = () => {

  const [loading, setLoading] = React.useState(true);
  const [project, setProject] = React.useState(undefined);

  const fetchRegistration = async () => {
    const res = await fetch('/api/project');

    if (res.ok) {
      const data = await res.json();
      setProject(data);
    }

    setLoading(false);
  };

  const modalProps = {
    openModalText: project ? 'Edit Project' : 'Register',
    header: 'Project Registration',
    openButtonProps: { colorScheme: 'blue' },
  };

  const formProps = {
    initialValues: project,
    onSubmit: () => {
      void fetchRegistration();
    },
  };
  
  React.useEffect(() => {
    void fetchRegistration();
  }, []);

  return loading
    ? <Spinner size="lg" />
    : <PopUpModal {...modalProps}>
        <RegistrationForm {...formProps} />
      </PopUpModal>
  
};
