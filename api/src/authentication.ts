import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

import {
  getUserInfoFromFacebook,
  getUserInfoFromGoogle,
  getUserInfoFromGithub,
  SocialProfile,
} from './utils/social-profile';

import User from './models/user';
import { AuthUser } from './constants/types';

enum SocialProvider {
  Facebook = 'facebook',
  Google = 'google',
  Github = 'github',
}

const createOrUpdateUser = async (profile: SocialProfile, provider: SocialProvider) => {
  if (profile.email || profile.username) {
    const user = await User.findOne({ $or: [{ email: profile.email }, { username: profile.username }] });
    if (user) {
      user[`${provider}Id`] = profile.id;
      await user.save();
      return user;
    }
  }

  const user = new User(profile);
  await user.save();
  return user;
};

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
        callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
        profileFields: [
          'id',
          'displayName',
          'email',
          'picture.type(large)',
          'about',
          'cover',
          'first_name',
          'last_name',
          'website',
        ],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ facebookId: profile.id });
        if (user) {
          return done(null, user);
        }

        try {
          const userProfile = await getUserInfoFromFacebook(profile);
          const user = await createOrUpdateUser(userProfile, SocialProvider.Facebook);
          done(null, user);
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
        callbackURL: `${process.env.API_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
          return;
        }

        try {
          const userProfile = getUserInfoFromGoogle(profile);
          const user = await createOrUpdateUser(userProfile, SocialProvider.Google);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_APP_ID,
        clientSecret: process.env.GITHUB_APP_SECRET,
        callbackURL: `${process.env.API_URL}/auth/github/callback`,
        scope: ['user'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ githubId: profile.id });
        if (user) {
          done(null, user);
          return;
        }

        try {
          const userProfile = getUserInfoFromGithub(profile);
          const user = await createOrUpdateUser(userProfile, SocialProvider.Github);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
