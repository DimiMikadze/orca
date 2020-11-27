import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import User from './models/user';
import { AuthUser } from './constants/types';

export const initPassport = async () => {
  const usersList = await User.find({});
  console.log('USERS length:', usersList.length);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user: AuthUser, done) => {
    console.log('Desirializing user user:', user);

    const desUser = await User.findById(user._id, (err, user) => done(err, user));

    console.log('Desirializing userr, desUser', desUser);

    done(null, desUser);
  });

  const allUsers = await User.find();
  console.log('allUsers', allUsers.length);

  const facebookOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:4000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
  };

  const facebookCallback = async (accessToken, refreshToken, profile, done) => {
    console.log('Facebook Callback, profile: ', profile);
    const user = await User.findOne({ facebookId: profile.id });

    if (user) {
      console.log('Facebook Callback: Found user in DB, user: ', user);
      done(null, user);
      return;
    }

    try {
      console.log('Facebook Callback: saving user');
      const firstName = profile.name && profile.name.givenName ? profile.name.givenName : '';
      const lastName = profile.name && profile.name.familyName ? profile.name.familyName : '';
      const newUser = await new User({
        facebookId: profile.id,
        username: profile.displayName,
        fullName: firstName ? `${firstName} ${lastName}` : profile.displayName,
        email:
          profile.emails && profile.emails.length > 0 && profile.emails[0].value !== undefined
            ? profile.emails[0].value
            : null,
        password: 'password',
      });
      await newUser.save();
      done(null, newUser);
    } catch (error) {
      console.log('Facebook Callback: cant create user in db, error:', error);
      done(error);
    }
  };

  passport.use(new FacebookStrategy(facebookOptions, facebookCallback));
};
