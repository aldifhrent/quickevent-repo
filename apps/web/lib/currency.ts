export function price(price: number) {
  return Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
    minimumFractionDigits: 0,
  }).format(price);
}
