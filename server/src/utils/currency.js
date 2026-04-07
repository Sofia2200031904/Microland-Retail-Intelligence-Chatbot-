const USD_TO_INR_RATE = 92.96;

function convertUsdToInr(value) {
  return Math.round(Number(value || 0) * USD_TO_INR_RATE * 100) / 100;
}

function formatCurrencyInr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(convertUsdToInr(value));
}

module.exports = {
  USD_TO_INR_RATE,
  convertUsdToInr,
  formatCurrencyInr
};
