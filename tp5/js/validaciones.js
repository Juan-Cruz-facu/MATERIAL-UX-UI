const soloDigitos = (valor) => String(valor || '').replace(/[\s.-]/g, '');
const esMayorDeEdad = (fecha) => {
  if (!fecha) return false;
  const nacimiento = new Date(`${fecha}T00:00:00`);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const antesDelCumple = hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  return !Number.isNaN(nacimiento.getTime()) && edad - Number(antesDelCumple) >= 18;
};

export const validar = {
  marca: (v) => v ? null : 'Elegí una marca',
  modelo: (v) => String(v).trim().length >= 2 && String(v).trim().length <= 40 ? null : 'Ingresá el modelo del equipo',
  valor: (v) => Number(v) >= 100000 && Number(v) <= 2500000 ? null : 'El valor debe estar entre $100.000 y $2.500.000',
  antiguedad: (v) => v ? null : 'Indicá la antigüedad',
  nombre: (v) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]{2,}$/.test(String(v).trim()) ? null : 'Ingresá tu nombre',
  apellido: (v) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]{2,}$/.test(String(v).trim()) ? null : 'Ingresá tu apellido',
  dni: (v) => /^\d{7,8}$/.test(soloDigitos(v)) ? null : 'El DNI debe tener 7 u 8 números',
  nacimiento: (v) => esMayorDeEdad(v) ? null : 'Tenés que ser mayor de edad',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? null : 'Ingresá un email válido',
  celular: (v) => /^\d{10}$/.test(soloDigitos(v)) ? null : 'Ingresá un celular válido de 10 dígitos',
  terminos: (v) => v ? null : 'Tenés que aceptar los términos',
  tarjeta: (v) => /^\d{16}$/.test(soloDigitos(v)) ? null : 'Número de tarjeta inválido',
  vencimiento: (v) => {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(String(v));
    if (!match) return 'Vencimiento inválido';
    const year = 2000 + Number(match[2]); const month = Number(match[1]); const now = new Date();
    return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1) ? null : 'Vencimiento inválido';
  },
  cvv: (v) => /^\d{3}$/.test(String(v)) ? null : 'CVV inválido',
  titularPago: (v) => String(v).trim() ? null : 'Ingresá el nombre del titular',
};

export function validarCampos(objeto, campos) {
  return campos.reduce((errores, campo) => {
    const error = validar[campo](objeto[campo]);
    if (error) errores[campo] = error;
    return errores;
  }, {});
}
