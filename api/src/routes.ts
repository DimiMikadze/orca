import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: process.env.FRONTEND_URL,
  })
);

router.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
  }
);

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.FRONTEND_URL }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
  }
);

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

export default router;
