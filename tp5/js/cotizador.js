const factores = { nueva: 1, unoDos: 1.1, masDos: 1.25 };
export function calcularCuota(valor, tasaAnual, antiguedad) {
  return Math.round(Number(valor) * tasaAnual / 12 * (factores[antiguedad] || 1));
}
