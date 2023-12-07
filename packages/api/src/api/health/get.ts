import { Request, Response } from 'express';

export const get = async (req: Request, res: Response) => {
  const db = await req.entityManager.getConnection().isConnected();

  const dependencies: { [id: string]: boolean } = { db };
  const ok = Object.values(dependencies).every((val) => !!val);

  res.status(ok ? 200 : 503).send({
    ok,
    ...Object.assign({}, ...Object.entries(dependencies).map(([key, val]) => ({ [key]: val }))),
  });
};
