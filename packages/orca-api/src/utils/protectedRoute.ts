import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { ErrorCodes, UserRole } from '../constants';

export const checkIfUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(ErrorCodes.Un_Authorized).send('Not authorized.');
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export const checkIfAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(ErrorCodes.Un_Authorized).send('Not authorized.');
    }

    const isAdmin = user.role === UserRole.Admin;
    const isSuperAdmin = user.role === UserRole.SuperAdmin;

    if (!isAdmin && !isSuperAdmin) {
      return res.status(ErrorCodes.Un_Authorized).send('Not authorized.');
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export const checkIfSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(ErrorCodes.Un_Authorized).send('Not authorized.');
    }

    const isSuperAdmin = user.role === UserRole.SuperAdmin;
    if (!isSuperAdmin) {
      return res.status(ErrorCodes.Un_Authorized).send('Not authorized.');
    }

    req.user = user;
    return next();
  })(req, res, next);
};
