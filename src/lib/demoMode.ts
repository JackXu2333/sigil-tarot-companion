let isDemoMode = false;

export const setDemoMode = (value: boolean) => {
  isDemoMode = value;
};

export const getDemoMode = () => {
  return isDemoMode;
};