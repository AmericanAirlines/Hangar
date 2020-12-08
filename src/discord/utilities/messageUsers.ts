import { client } from '..';

export async function messageUsers(userIds: string[], message: string): Promise<void> {
  await Promise.all(
    userIds.map(async (id) => {
      const user = await client.users.fetch(id).catch(() => null);

      if (user) {
        user.send(message);
      }
    }),
  );
}
