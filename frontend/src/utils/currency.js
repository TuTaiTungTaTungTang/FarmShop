// Utility helpers to convert USD values to VND and format them for display.
// Keep the conversion rate configurable. Update EXCHANGE_RATE_USD_TO_VND when needed.
export const EXCHANGE_RATE_USD_TO_VND = 24000; // 1 USD = 24,000 VND (example rate)

export function convertUsdToVnd(usd) {
  if (usd == null || isNaN(Number(usd))) return 0;
  return Math.round(Number(usd) * EXCHANGE_RATE_USD_TO_VND);
}

export function formatVND(vnd) {
  try {
    return vnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' ₫';
  } catch (e) {
    return vnd + ' ₫';
  }
}

export function formatPriceFromUsd(usd) {
  const vnd = convertUsdToVnd(usd);
  return formatVND(vnd);
}

const currencyUtils = {
  EXCHANGE_RATE_USD_TO_VND,
  convertUsdToVnd,
  formatVND,
  formatPriceFromUsd,
};

export default currencyUtils;
