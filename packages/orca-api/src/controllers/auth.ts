import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
  getAuthUser,
  createUser,
  getUserByEmail,
  updateUserResetPasswordToken,
  updatePassword,
  deleteUser,
  updateUser,
} from '../db';
import { EmailRegex, ErrorCodes, ErrorMessages } from '../constants';
import { sendEmail, getEmailTemplate, checkEmailVerification } from '../utils';
import { URLSearchParams } from 'url';
import { SocialProvider } from '../authentication';

const AuthController = {
  authUser: async (req: Request, res: Response): Promise<any> => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (!user) {
        return res.send(null);
      }

      try {
        const authUser = await getAuthUser(user._id);
        return res.send(authUser);
      } catch (error) {
        return res.send(ErrorCodes.Internal).send(ErrorMessages.Generic);
      }
    })(req, res);
  },
  signUp: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(ErrorCodes.Bad_Request).send('Please fill in all of the fields.');
    }

    if (!email.match(EmailRegex)) {
      return res.status(ErrorCodes.Bad_Request).send('The email address is not valid.');
    }

    const isEmailVerificationRequired = await checkEmailVerification();

    const existingUser = await getUserByEmail(email);

    // If the "isEmailVerificationRequired" setting is false,
    // we don't allow the usage of duplicate emails even if their email is not verified.
    if ((existingUser && !isEmailVerificationRequired) || (existingUser && existingUser.emailVerified)) {
      return res.status(ErrorCodes.Bad_Request).send('The email address is already being used.');
    }

    // We should not duplicate emails in Schema as they are unique.
    // Hence If the email is not verified, and the "isEmailVerificationRequired" is set to true we'll remove the old one.
    if (existingUser && isEmailVerificationRequired && !existingUser.emailVerified) {
      await deleteUser(existingUser._id);
    }

    const user = await createUser(fullName, username, email, password, true);
    const token = jwt.sign({ user: { userId: user._id, email } }, process.env.SECRET, { expiresIn: '1h' });

    if (isEmailVerificationRequired) {
      try {
        const template = await getEmailTemplate({
          greeting: `Hey ${fullName}`,
          description: `Thank you for signing up. To complete your registration, please confirm your email.`,
          ctaLink: `${req.headers.origin}/email-verify?email=${email}&token=${token}`,
          ctaText: 'Confirm email',
        });
        await sendEmail({
          to: email,
          subject: 'Email verification',
          html: template,
        });
        return res.send('success');
      } catch (error) {
        return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
      }
    }

    try {
      passport.authenticate('signup', { session: false }, async (err) => {
        if (err) {
          return res.status(ErrorCodes.Bad_Request).send(ErrorMessages.Generic);
        }

        const handler = await passport.authenticate('signup', { session: false });
        req.login({ email, password: user.password }, { session: false }, async () => {
          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.SECRET);
          res.cookie('token', token).send({ user, token });
          handler(req, res, next);
        });
      })(req, res, next);
    } catch (error) {
      res.send(ErrorCodes.Un_Authorized).send(ErrorMessages.Generic);
    }
  },
  emailVerify: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    passport.authenticate('signup', { session: false }, async (err) => {
      if (err) {
        return res.status(ErrorCodes.Bad_Request).send(ErrorMessages.Generic);
      }

      const { token, email } = req.body;
      if (!token || !email) {
        return res.status(ErrorCodes.Bad_Request).send('Email verification has been failed due to invalid arguments.');
      }

      let decoded = null;
      try {
        decoded = await jwt.verify(token, process.env.SECRET);
      } catch (error) {
        return res.status(ErrorCodes.Bad_Request).send('The link has expired.');
      }

      const user = await getUserByEmail(decoded.user.email);
      if (!user) {
        return res.status(ErrorCodes.Bad_Request).send('Email verification has been failed due to invalid arguments.');
      }

      if (user.emailVerified) {
        return res.status(ErrorCodes.Bad_Request).send('Email is already verified.');
      }

      try {
        const handler = await passport.authenticate('signup', { session: false });
        await updateUser(user._id, { emailVerified: true });

        req.login({ email, password: user.password }, { session: false }, async () => {
          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.SECRET);
          res.cookie('token', token).send({ user, token });
          handler(req, res, next);
        });
      } catch (error) {
        res.send(ErrorCodes.Un_Authorized).send(ErrorMessages.Generic);
      }
    })(req, res, next);
  },
  login: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    passport.authenticate('login', async (err, user) => {
      try {
        const isEmailVerificationRequired = await checkEmailVerification();
        if (err || !user || (user && isEmailVerificationRequired && !user.emailVerified)) {
          return res
            .status(ErrorCodes.Bad_Request)
            .send('Your email and password combination does not match an account.');
        }

        if (user.banned) {
          return res
            .status(ErrorCodes.Bad_Request)
            .send('The account is banned. Please get in touch with support for help.');
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.SECRET);
          const authUser = await getAuthUser(user._id);
          return res.cookie('token', token).send({ user: authUser, token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  },
  logout: async (req: Request, res: Response): Promise<any> => {
    if (req.cookies['token']) {
      return res.clearCookie('token').send('You have been successfully logged out.');
    } else {
      return res.send('You have been successfully logged out.');
    }
  },
  forgotPassword: async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    const isEmailVerificationRequired = await checkEmailVerification();
    if (!user || (user && isEmailVerificationRequired && !user.emailVerified)) {
      return res.status(ErrorCodes.Bad_Request).send("A user with a given email address doesn't exist.");
    }

    const token = jwt.sign({ user: { email } }, process.env.SECRET, { expiresIn: '1h' });
    await updateUserResetPasswordToken(user._id, token);

    const template = await getEmailTemplate({
      greeting: `Hey ${user.fullName}`,
      description: `We received a request to reset your password. You may click the button below to choose your new password. If you do not make this request, you can safely ignore this message.`,
      ctaLink: `${req.headers.origin}/reset-password?email=${email}&token=${token}`,
      ctaText: 'Reset password',
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Reset Password Request',
        html: template,
      });
      return res.send(`Password reset instruction has been sent to the ${email} email address.`);
    } catch (error) {
      return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
    }
  },
  resetPassword: async (req: Request, res: Response): Promise<any> => {
    const { password, token, email } = req.body;
    let decoded = null;

    try {
      decoded = await jwt.verify(token, process.env.SECRET);
    } catch (error) {
      return res.status(ErrorCodes.Bad_Request).send('The link has expired.');
    }

    const user = await getUserByEmail(decoded.user.email);
    if (!user) {
      return res.status(ErrorCodes.Bad_Request).send('Password reset has been failed due to invalid arguments.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await updatePassword(user._id, passwordHash);

    req.login({ email, password }, { session: false }, async () => {
      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, process.env.SECRET);
      return res.cookie('token', token).send({ user, token });
    });
  },
  githubCallback: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    passport.authenticate(
      'github',
      { failureRedirect: `${process.env.FRONTEND_URL}?auth=social&responseType=error`, session: false },
      async (err, user) => {
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.SECRET);

          const payload = {
            auth: 'social',
            responseType: 'success',
            provider: SocialProvider.Github,
            token,
          };
          const queryString = new URLSearchParams(payload).toString();
          return res.cookie('token', token).redirect(`${process.env.FRONTEND_URL}/?${queryString}`);
        });
      }
    )(req, res, next);
  },
  googleCallback: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    passport.authenticate(
      'google',
      { failureRedirect: `${process.env.FRONTEND_URL}?auth=social&responseType=error`, session: false },
      async (err, user) => {
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.SECRET);

          const payload = {
            auth: 'social',
            responseType: 'success',
            provider: SocialProvider.Google,
            token,
          };
          const queryString = new URLSearchParams(payload).toString();
          return res.cookie('token', token).redirect(`${process.env.FRONTEND_URL}/?${queryString}`);
        });
      }
    )(req, res, next);
  },
  facebookCallback: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    passport.authenticate(
      'facebook',
      { failureRedirect: `${process.env.FRONTEND_URL}?auth=social&responseType=error`, session: false },
      async (err, user) => {
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.SECRET);

          const payload = {
            auth: 'social',
            responseType: 'success',
            provider: SocialProvider.Facebook,
            token,
          };
          const queryString = new URLSearchParams(payload).toString();
          return res.cookie('token', token).redirect(`${process.env.FRONTEND_URL}/?${queryString}`);
        });
      }
    )(req, res, next);
  },
};

export default AuthController;
