// Converte escala numérica 1-5 em rótulos semânticos usados pelo backend
export function escalaParaRotulo(valor: number): 'PESSIMO' | 'RUIM' | 'REGULAR' | 'BOM' | 'OTIMO' {
  if (valor <= 1) return 'PESSIMO';
  if (valor === 2) return 'RUIM';
  if (valor === 3) return 'REGULAR';
  if (valor === 4) return 'BOM';
  return 'OTIMO';
}

