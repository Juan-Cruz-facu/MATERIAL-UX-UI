export const solicitud = {
  paso: 0,
  equipo: { marca: '', modelo: '', valor: 0, antiguedad: '' },
  plan: 'plus',
  titular: { nombre: '', apellido: '', dni: '', nacimiento: '', email: '', celular: '', terminos: false },
  pago: { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' },
  poliza: null,
};

export function reiniciarSolicitud() {
  solicitud.paso = 0;
  solicitud.equipo = { marca: '', modelo: '', valor: 0, antiguedad: '' };
  solicitud.plan = 'plus';
  solicitud.titular = { nombre: '', apellido: '', dni: '', nacimiento: '', email: '', celular: '', terminos: false };
  solicitud.pago = { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' };
  solicitud.poliza = null;
}
