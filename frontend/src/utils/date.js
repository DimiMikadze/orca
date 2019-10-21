/**
 * Converts unix timestamp into a time ago string like 2 hours ago
 *
 * @param {string} date unix timestamp
 */
export const timeAgo = unixTimestamp => {
  const date = new Date(parseInt(unixTimestamp));

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

/**
 * Converts unix timestamp to current date
 *
 * @param {string} date unix timestamp
 */
export const currentDate = unixTimestamp => {
  const date = new Date(parseInt(unixTimestamp));
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const month = months[date.getMonth() + 1];
  const day = date.getDay();
  const year = date.getFullYear();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return `${month} ${day}, ${year} ${time}`;
};
