import { convertUsdToInr } from "./currency";

export const formatInrAmount = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatCurrency = (value) => formatInrAmount(convertUsdToInr(value));

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value || 0));

export const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;
