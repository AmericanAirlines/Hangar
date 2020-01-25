import express from 'express';

export const admin = express.Router();

admin.use(express.json());

admin.post('/login', (req, res): void => {
  if (req.body.secret !== process.env.ADMIN_SECRET) {
    res.status(401).send('Incorrect secret');
    return;
  }

  res
    .status(200)
    .cookie('authed', 'yes', {
      maxAge: 48 * 60 * 60 * 1000, // 48 hours
      httpOnly: true,
      signed: true,
    })
    .send();
});
