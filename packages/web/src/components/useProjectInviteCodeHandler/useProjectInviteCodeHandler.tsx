import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
import { openErrorToast, openSuccessToast } from '../utils/CustomToast';
import { useRedirectToAuth } from '../layout/RedirectToAuthModal';

const toasts = {
  Success: () => openSuccessToast({
    title: `Registration successful!`,
    description: "You're all set! 🚀",
  }) ,
  Invalid: () => openErrorToast({
    title: 'Invalid invite code',
    description: 'Please check your invite code and try again.',
  }),
  ProjectExists: () => openErrorToast({
    title: 'Project already exists',
    description: 'You already have a project.',
  }),
}

const useProjectInviteCodeHandler = () => {
  const router = useRouter();
  const { triggerRedirect } = useRedirectToAuth();
  const { user , doneLoading:userLoaded } = useUserStore();
  const { projectInviteCode } = router.query;

  useEffect(() => {
    if (!userLoaded || !projectInviteCode) return;
    if (!user) {
      triggerRedirect({returnTo:`/?projectInviteCode=${projectInviteCode}`});
      return;
    }
    if (user?.project)  {
      toasts.ProjectExists();
      return;
    }
    
    void ( async () => {
      let project;
      try {
        project  = (await axios.put(`/api/project/contributors`, { inviteCode:projectInviteCode } )).data
      } catch {
        toasts.Invalid();
        return;
      }
      toasts.Success();
        
      await useUserStore.getState().fetchUser();
      void router.push(`/project/${project.id}`);
    })();
  }, [projectInviteCode , userLoaded, triggerRedirect, user, router]);
}

export { useProjectInviteCodeHandler };