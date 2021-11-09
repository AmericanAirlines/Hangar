import React from 'react';
import { PopUpModal } from '.';

const subscribeUser = async () => {
  const res = await fetch('/api/subscription/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error();
  }
};

export const RemindMeModal: React.FC = () => (
  <PopUpModal
    openModalText="Remind Me"
    onConfirm={subscribeUser}
    header="Confirm Notification Subscription"
    body="By pressing confirm, you will be subscribed to our notification system"
    openButtonVariant="ghost"
    succussMessage="You will now be notified of upcoming events via Discord"
    errorMessage="Something went wrong, please try again later."
  />
);
