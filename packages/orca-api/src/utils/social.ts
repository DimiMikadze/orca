export interface SocialProfile {
  id?: string;
  facebookId?: string;
  googleId?: string;
  githubId?: string;
  fullName?: string;
  email?: string;
  about?: string;
  website?: string;
  image?: string;
  coverImage?: string;
}

export const getUserInfoFromFacebook = (profile: any): SocialProfile => {
  const user = {
    facebookId: profile.id,
    fullName: '',
    email: '',
    about: '',
    website: '',
    image: '',
    coverImage: '',
  };

  const firstName = profile.name && profile.name.givenName ? profile.name.givenName : '';
  const lastName = profile.name && profile.name.familyName ? profile.name.familyName : '';

  if (firstName && lastName) {
    user.fullName = `${firstName} ${lastName}`;
  } else if (firstName && !lastName) {
    user.fullName = firstName;
  } else if (lastName && !firstName) {
    user.fullName = lastName;
  } else if (profile.displayName) {
    user.fullName = profile.displayName;
  } else if (profile._json.name) {
    user.fullName = profile._json.name;
  }

  user.email =
    profile.emails && profile.emails.length > 0 && profile.emails[0].value !== undefined ? profile.emails[0].value : '';
  user.about = profile.about ? profile.about : '';
  user.website = profile.website ? profile.website : '';
  user.image =
    profile.photos && profile.photos.length > 0 && profile.photos[0].value !== undefined ? profile.photos[0].value : '';
  user.coverImage = profile._json.cover ? profile._json.cover.source : '';

  return user;
};

export const getUserInfoFromGoogle = (profile: any): SocialProfile => {
  const user = {
    googleId: profile.id,
    fullName: '',
    email: '',
    about: '',
    website: '',
    image: '',
    coverImage: '',
  };

  const firstName = profile.name && profile.name.givenName ? profile.name.givenName : '';
  const lastName = profile.name && profile.name.familyName ? profile.name.familyName : '';

  if (firstName && lastName) {
    user.fullName = `${firstName} ${lastName}`;
  } else if (firstName && !lastName) {
    user.fullName = firstName;
  } else if (lastName && !firstName) {
    user.fullName = lastName;
  } else if (profile.displayName) {
    user.fullName = profile.displayName;
  } else if (profile.name) {
    user.fullName = profile.name;
  }

  user.email = (profile.emails && profile.emails.length > 0 && profile.emails[0].value) || '';
  user.about = profile.tagline ? profile.tagline : '';
  user.website = profile._json.urls && profile._json.urls.length > 0 ? profile._json.urls[0].value : '';
  user.image = (profile.photos && profile.photos.length > 0 && profile.photos[0].value) || '';

  return user;
};

export const getUserInfoFromGithub = (profile: any): SocialProfile => {
  const user = {
    githubId: profile.id,
    fullName: '',
    email: '',
    about: '',
    website: '',
    image: '',
    coverImage: '',
  };

  user.fullName = profile.displayName || profile.username || profile._json.name || '';
  user.email = (profile.emails && profile.emails.length > 0 && profile.emails[0].value) || '';
  user.about = profile._json.bio || '';
  user.website = profile._json.blog || '';
  user.image = (profile._json.avatar_url && profile._json.avatar_url) || '';

  return user;
};
