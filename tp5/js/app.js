import { solicitud, reiniciarSolicitud } from './estado.js';
import { validar, validarCampos } from './validaciones.js';
import { configurarRender, render, setErrores, getErrores, setProcesando, mostrarErrorCampo } from './render.js';
import { simularPago, generarPoliza } from './pago.js';

const camposEquipo = ['marca', 'modelo', 'valor', 'antiguedad'];
const camposTitular = ['nombre', 'apellido', 'dni', 'nacimiento', 'email', 'celular', 'terminos'];
const camposPago = ['tarjeta', 'vencimiento', 'cvv', 'titularPago'];

async function cargarPlanes() {
  try {
    const respuesta = await fetch('./data/planes.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar el archivo de planes');
    return await respuesta.json();
  } catch (error) {
    document.querySelector('#app').innerHTML = '<p class="notice error-notice" role="alert">No se pudieron cargar los planes. Abrí el sitio con Live Server o con <code>npx serve .</code>.</p>';
    throw error;
  }
}

function valorDeCampo(clave) {
  if (clave === 'titularPago') return solicitud.pago.titular;
  if (clave in solicitud.equipo) return solicitud.equipo[clave];
  if (clave in solicitud.pago) return solicitud.pago[clave];
  return solicitud.titular[clave];
}

function actualizarDesdeCampo(campo) {
  const { name, value, checked, type } = campo;
  if (name in solicitud.equipo) solicitud.equipo[name] = name === 'valor' ? Number(value.replace(/\D/g, '')) : value;
  if (name in solicitud.titular) solicitud.titular[name] = type === 'checkbox' ? checked : value;
  if (name === 'metodo') solicitud.pago.metodo = value;
  if (['tarjeta', 'vencimiento', 'cvv'].includes(name)) solicitud.pago[name] = value;
  if (name === 'titularPago') solicitud.pago.titular = value;
  if (name === 'plan') solicitud.plan = value;
}

function erroresDePaso(paso) {
  if (paso === 1) return validarCampos(solicitud.equipo, camposEquipo);
  if (paso === 3) return validarCampos(solicitud.titular, camposTitular);
  if (paso === 4) {
    const datos = { ...solicitud.pago, titularPago: solicitud.pago.titular };
    return validarCampos(datos, camposPago);
  }
  return {};
}

function actualizarBoton(formulario) {
  const paso = solicitud.paso;
  if (![1, 3, 4].includes(paso)) return;
  const boton = formulario.querySelector('[type="submit"]');
  if (boton) boton.disabled = Object.keys(erroresDePaso(paso)).length > 0;
}

function mostrarErroresDelPaso(paso) {
  setErrores(erroresDePaso(paso));
  render();
  const primerError = Object.keys(getErrores())[0];
  document.querySelector(`#${primerError}`)?.focus();
}

document.addEventListener('input', (event) => {
  const campo = event.target;
  if (!campo.matches('input, select')) return;
  actualizarDesdeCampo(campo);
  const formulario = campo.closest('form');
  if (formulario) actualizarBoton(formulario);
});

document.addEventListener('change', (event) => {
  const campo = event.target;
  if (!campo.matches('input, select')) return;
  actualizarDesdeCampo(campo);
  if (campo.name === 'plan') render();
  else actualizarBoton(campo.closest('form'));
});

document.addEventListener('focusout', (event) => {
  const campo = event.target;
  if (!campo.matches('input, select') || !campo.name) return;
  actualizarDesdeCampo(campo);
  const clave = campo.name;
  if (!validar[clave]) return;
  const mensaje = validar[clave](valorDeCampo(clave));
  const nuevos = { ...getErrores() };
  if (mensaje) nuevos[clave] = mensaje; else delete nuevos[clave];
  setErrores(nuevos);
  mostrarErrorCampo(clave, mensaje);
});

document.addEventListener('submit', async (event) => {
  const formulario = event.target;
  if (!formulario.matches('form')) return;
  event.preventDefault();
  new FormData(formulario).forEach((valor, clave) => actualizarDesdeCampo({ name: clave, value: valor, type: 'text' }));
  if (formulario.querySelector('[name="terminos"]')) solicitud.titular.terminos = formulario.querySelector('[name="terminos"]').checked;
  const paso = solicitud.paso;
  const errores = erroresDePaso(paso);
  if (Object.keys(errores).length) return mostrarErroresDelPaso(paso);
  setErrores({});
  if (paso === 1) solicitud.paso = 2;
  if (paso === 3) {
    solicitud.paso = 4;
    if (!solicitud.pago.titular) solicitud.pago.titular = `${solicitud.titular.nombre} ${solicitud.titular.apellido}`.trim();
  }
  if (paso === 4) {
    setProcesando(true); render();
    const resultado = await simularPago(solicitud.pago.tarjeta);
    setProcesando(false);
    if (resultado.ok) { solicitud.poliza = generarPoliza(); solicitud.paso = 5; }
    else solicitud.paso = 6;
  }
  render();
});

document.addEventListener('click', (event) => {
  const boton = event.target.closest('[data-action]');
  if (!boton) return;
  const accion = boton.dataset.action;
  if (accion === 'empezar') { solicitud.paso = 1; setErrores({}); }
  if (accion === 'inicio') { reiniciarSolicitud(); setErrores({}); }
  if (accion === 'volver' || accion === 'avanzar') { solicitud.paso = Number(boton.dataset.paso); setErrores({}); }
  if (accion === 'reintentar') { solicitud.paso = 4; setErrores({}); }
  render();
});

const planes = await cargarPlanes();
configurarRender(planes);
render();
