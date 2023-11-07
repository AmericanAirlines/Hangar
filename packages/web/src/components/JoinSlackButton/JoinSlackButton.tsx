import { Button, ButtonProps, LinkProps } from '@chakra-ui/react';
import React from 'react';
import { FaSlack } from 'react-icons/fa';
import { useUserStore } from '../../stores/user';
import { env } from '../../env';

type JoinSlackButtonProps = ButtonProps & LinkProps;

export const JoinSlackButton: React.FC<JoinSlackButtonProps> = ({ ...style }) => {
  const { user } = useUserStore();

  if (user || !env.slackInviteUrl) return null;

  return (
    <Button
      onClick={() => {
        window.open(env.slackInviteUrl, '_blank');
      }}
      rightIcon={<FaSlack />}
      {...style}
    >
      Join Slack
    </Button>
  );
};
