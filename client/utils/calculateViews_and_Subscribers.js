export const calculateSubscribers = (totalSubscribers = 0) => {
  if (totalSubscribers < 1000) return `${totalSubscribers} subscribers`;
  if (totalSubscribers < 1000000)
    return `${(totalSubscribers / 1000).toFixed(1)}K subscribers`;
  return `${(totalSubscribers / 1000000).toFixed(1)}M subscribers`;
};

export const calculateFollowing = (totalFollowing = 0) => {
  if (totalFollowing < 1000) return `${totalFollowing} following`;
  if (totalFollowing < 1000000)
    return `${(totalFollowing / 1000).toFixed(1)}K following`;
  return `${(totalFollowing / 1000000).toFixed(1)}M following`;
};

export const calculateViews = (totalViews = 0) => {
  if (totalViews < 1000) return `${totalViews} views`;
  if (totalViews < 1000000) return `${(totalViews / 1000).toFixed(1)}K views`;
  return `${(totalViews / 1000000).toFixed(1)}M views`;
};
