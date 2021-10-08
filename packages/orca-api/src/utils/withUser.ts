import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const withUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      req.user = user;
    }

    return next();
  })(req, res, next);
};
