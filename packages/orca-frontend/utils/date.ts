const currentDate = (timeStamp) => {
  if (!timeStamp) {
    return false;
  }

  const date = new Date(timeStamp);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return `${month} ${day}, ${year} ${time}`;
};

export default currentDate;
