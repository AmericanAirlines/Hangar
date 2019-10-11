import React from 'react';
import { Spinner } from '@chakra-ui/react';
import { RegistrationForm } from '.';
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

  React.useEffect(() => {
    void fetchRegistration();
  }, []);

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <PopUpModal
      openModalText={project ? 'Edit Project' : 'Register'}
      header="Project Registration"
      openButtonProps={{ colorScheme: 'blue' }}
    >
      <RegistrationForm
        initialValues={project}
        onSubmit={() => {
          void fetchRegistration();
        }}
      />
    </PopUpModal>
  );
};
