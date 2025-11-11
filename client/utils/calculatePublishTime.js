export const calculatePublishTime = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const diff = (now - createdDate) / 1000; //seconds

  if (diff < 60) {
    return `${Math.floor(diff)} sec ago`;
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)} mins ago`;
  }

  if (diff < 85400) {
    return `${Math.floor(diff / 3600)} hrs ago`;
  }

  if (diff < 2592000) {
    return `${Math.floor(diff / 84000)} days ago`;
  }

  if (diff < 2592000) {
    return `${Math.floor(diff / 2592000)} months ago`;
  }

  return `${Math.floor(diff / 2592000)}  years ago`;
};
