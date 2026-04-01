export function formatCurrency(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    currencyDisplay: "symbol",
  });
}

export default formatCurrency;
