export const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
};

export const getChangeColor = (change: number) => {
  if (change > 0) return 'green.500';
  if (change < 0) return 'red.500';
  return 'gray.500';
};
