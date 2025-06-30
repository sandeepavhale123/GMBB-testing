export const isSubscriptionExpired = (planExpDate: string | null): boolean => {
  if (!planExpDate) return true;

  const expirationDate = new Date(planExpDate);
  const currentDate = new Date();

  // Reset time to compare only dates
  expirationDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  return expirationDate < currentDate;
};

export const formatExpirationDate = (planExpDate: string): string => {
  return new Date(planExpDate).toLocaleDateString();
};
