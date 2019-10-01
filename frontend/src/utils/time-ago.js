/**
 * Converts date into a time ago string like 2 hours ago
 *
 * @param {obj} date
 */
export const timeAgo = date => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + ' years';
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' months';
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' days';
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' hours';
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + ' mins';
  }

  return Math.floor(seconds) + ' seconds';
};
