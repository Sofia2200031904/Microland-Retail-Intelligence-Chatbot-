export const USD_TO_INR_RATE = 92.96;

export const convertUsdToInr = (value) =>
  Math.round(Number(value || 0) * USD_TO_INR_RATE * 100) / 100;
