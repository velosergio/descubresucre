const formatters = new Map<number, Intl.NumberFormat>();

/** Formatea con separadores colombianos (13.300, 42,9). */
export function formatNumber(value: number, decimals = 0): string {
  let nf = formatters.get(decimals);
  if (!nf) {
    nf = new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    formatters.set(decimals, nf);
  }
  return nf.format(value);
}
