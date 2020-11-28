import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import User from './models/user';
import { AuthUser } from './constants/types';

export const initPassport = async () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user: AuthUser, done) => {
    if (user && user._id && user.createdAt) {
      return done(null, user);
    }

    try {
      const authUser = await User.findById(user._id, (err, user) => done(err, user));
      return done(null, authUser);
    } catch (error) {
      return done(error);
    }
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:4000/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ facebookId: profile.id });
        if (user) {
          done(null, user);
          return;
        }

        try {
          const firstName = profile.name && profile.name.givenName ? profile.name.givenName : '';
          const lastName = profile.name && profile.name.familyName ? profile.name.familyName : '';
          const newUser = new User({
            facebookId: profile.id,
            username: profile.displayName,
            fullName: firstName ? `${firstName} ${lastName}` : profile.displayName,
            email:
              profile.emails && profile.emails.length > 0 && profile.emails[0].value !== undefined
                ? profile.emails[0].value
                : null,
          });
          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL: 'http://localhost:4000/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
          return;
        }

        try {
          const firstName = profile.name && profile.name.givenName ? profile.name.givenName : '';
          const lastName = profile.name && profile.name.familyName ? profile.name.familyName : '';
          const newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
            fullName: firstName ? `${firstName} ${lastName}` : profile.displayName,
            email: (profile.emails && profile.emails.length > 0 && profile.emails[0].value) || null,
          });
          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
