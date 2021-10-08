import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from './models';

export const initPassport = (): void => {
  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const { fullName } = req.body;
        try {
          const user = new User({
            fullName,
            email,
            password,
          });
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'A user with a given email has not been found.' });
          }

          const validate = await user.isValidPassword(password);
          if (!validate) {
            return done(null, false, { message: 'Your email and password combination does not match an account.' });
          }

          return done(null, user, { message: 'Logged in Successfully.' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
      },
      async (token, done) => {
        try {
          const authUser = await User.findOne({ email: token.user.email });
          return done(null, authUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
