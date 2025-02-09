export const getDateRange = (start: Date, end: Date) => {
  let dates = [];
  let current = start;
  current.setHours(23, 59, 59, 999);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};
