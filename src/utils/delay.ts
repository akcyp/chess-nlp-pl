export const delay = (ts: number) => {
  return new Promise(resolve => setTimeout(resolve, ts));
};
