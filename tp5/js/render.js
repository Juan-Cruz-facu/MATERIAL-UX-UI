import { solicitud } from './estado.js';
import { calcularCuota } from './cotizador.js';
import { validarCampos } from './validaciones.js';

let planes = [];
let errores = {};
let procesando = false;
let ultimoPaso = null;

export function configurarRender(nuevosPlanes) { planes = nuevosPlanes; }
export function setErrores(nuevosErrores) { errores = nuevosErrores; }
export function setProcesando(valor) { procesando = valor; }
export const getErrores = () => errores;

// Actualiza el error de UN campo sin volver a pintar toda la pantalla (no pierde foco ni scroll).
export function mostrarErrorCampo(nombre, mensaje) {
  const input = document.querySelector(`[name="${nombre}"]`);
  const campo = input?.closest('.field');
  if (!campo) return;
  campo.toggleAttribute('data-invalid', Boolean(mensaje));
  campo.querySelector('.error')?.remove();
  document.querySelectorAll(`[name="${nombre}"]`).forEach((i) => i.setAttribute('aria-invalid', String(Boolean(mensaje))));
  if (mensaje) {
    const p = document.createElement('p');
    p.className = 'error'; p.id = `${nombre}-error`; p.setAttribute('role', 'alert'); p.textContent = mensaje;
    campo.append(p);
    input.setAttribute('aria-describedby', p.id);
  } else input.removeAttribute('aria-describedby');
}

const dinero = (valor) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor || 0);
const esc = (valor = '') => String(valor).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
const error = (campo) => errores[campo] ? `<p class="error" id="${campo}-error" role="alert">${errores[campo]}</p>` : '';
const invalid = (campo) => errores[campo] ? 'data-invalid' : '';
const stepper = () => `<nav class="stepper" aria-label="Progreso">${['Cotizar', 'Plan', 'Datos', 'Pago'].map((nombre, index) => {
  const paso = index + 1; const clase = solicitud.paso > paso ? 'done' : solicitud.paso === paso ? 'active' : '';
  return `<span class="step ${clase}" data-number="${paso}">${nombre}</span>`;
}).join('')}</nav>`;
const cuotaActual = () => {
  const plan = planes.find((p) => p.id === solicitud.plan);
  return plan ? calcularCuota(solicitud.equipo.valor, plan.tasaAnual, solicitud.equipo.antiguedad) : 0;
};
const pasoValido = (paso) => {
  if (paso === 1) return Object.keys(validarCampos(solicitud.equipo, ['marca', 'modelo', 'valor', 'antiguedad'])).length === 0;
  if (paso === 3) return Object.keys(validarCampos(solicitud.titular, ['nombre', 'apellido', 'dni', 'nacimiento', 'email', 'celular', 'terminos'])).length === 0;
  if (paso === 4) return Object.keys(validarCampos({ ...solicitud.pago, titularPago: solicitud.pago.titular }, ['tarjeta', 'vencimiento', 'cvv', 'titularPago'])).length === 0;
  return true;
};
const resumen = () => `<aside class="card summary"><h3>Tu seguro</h3><dl class="hidden lg:grid">
  <dt>Equipo</dt><dd>${esc([solicitud.equipo.marca, solicitud.equipo.modelo].filter(Boolean).join(' ') || 'A definir')}</dd>
  <dt>Plan</dt><dd>${esc(planes.find((p) => p.id === solicitud.plan)?.nombre || 'Plus')}</dd>
  ${solicitud.paso >= 4 && solicitud.titular.nombre ? `<dt>Titular</dt><dd>${esc(`${solicitud.titular.nombre} ${solicitud.titular.apellido}`.trim())}</dd>` : ''}
  <dt>Antigüedad</dt><dd>${({ nueva: 'Menos de 1 año', unoDos: '1 a 2 años', masDos: 'Más de 2 años' })[solicitud.equipo.antiguedad] || 'A definir'}</dd>
  </dl><dl class="summary-total grid"><dt>Por mes</dt><dd>${dinero(cuotaActual())}</dd></dl></aside>`;

function inicio() { return `<div class="grid items-center gap-6 py-5 lg:grid-cols-[1.1fr_.9fr]"><div><span class="badge">Seguro de celular</span><h1>Protegé lo que más usás.</h1><p class="lead">Cotizá tu seguro de celular en minutos. Sin papeles, con cobertura desde el primer día.</p><button class="btn" data-action="empezar">Cotizar mi celular</button></div><div class="grid grid-cols-2 gap-3.5">
  ${[['📱', 'Celular', 'Protección para tu equipo', true], ['🏠', 'Hogar', 'Próximamente'], ['🚲', 'Bicicleta', 'Próximamente'], ['✈️', 'Viaje', 'Próximamente']].map(([icono, nombre, texto, activo]) => `<article class="card product"><div><div class="product-icon">${icono}</div><h3>${nombre}</h3><p class="muted">${texto}</p></div>${activo ? '<span class="badge">Disponible</span>' : '<span class="badge muted">Próximamente</span>'}</article>`).join('')}
  </div></div>`; }
function cotizar() { const e = solicitud.equipo; return `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"> <div class="card form-card">${stepper()}<h2>Contanos sobre tu celular</h2><p class="muted">Usamos estos datos para calcular tu cuota.</p><form data-form="equipo" novalidate><div class="fields">
  <div class="field" ${invalid('marca')}><label for="marca">Marca</label><select id="marca" name="marca" aria-invalid="${Boolean(errores.marca)}"><option value="">Elegí una marca</option>${['Samsung','Apple','Motorola','Xiaomi','Otra'].map((marca) => `<option ${e.marca === marca ? 'selected' : ''}>${marca}</option>`).join('')}</select>${error('marca')}</div>
  <div class="field" ${invalid('modelo')}><label for="modelo">Modelo</label><input id="modelo" name="modelo" value="${esc(e.modelo)}" placeholder="Ej. Galaxy A55" aria-invalid="${Boolean(errores.modelo)}">${error('modelo')}</div>
  <div class="field" ${invalid('valor')}><label for="valor">Valor del equipo</label><input id="valor" name="valor" inputmode="numeric" value="${e.valor || ''}" placeholder="Ej. 600000" aria-invalid="${Boolean(errores.valor)}"><span class="help">Entre $100.000 y $2.500.000</span>${error('valor')}</div>
  <fieldset class="field" ${invalid('antiguedad')}><legend>Antigüedad</legend><div class="choices">${[['nueva','Menos de 1 año'],['unoDos','1 a 2 años'],['masDos','Más de 2 años']].map(([v, l]) => `<span class="choice"><input id="ant-${v}" type="radio" name="antiguedad" value="${v}" ${e.antiguedad === v ? 'checked' : ''}><label for="ant-${v}">${l}</label></span>`).join('')}</div>${error('antiguedad')}</fieldset>
  </div><div class="actions"><button type="button" class="btn" data-variant="ghost" data-action="inicio">Cancelar</button><button class="btn" type="submit" ${pasoValido(1) ? '' : 'disabled'}>Ver planes</button></div></form></div>${resumen()}</div>`; }
function planesVista() { return `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"><div class="card form-card">${stepper()}<h2>Elegí el plan ideal</h2><p class="muted">Podés cambiarlo antes de confirmar el pago.</p><div class="grid gap-3.5 lg:grid-cols-3">${planes.map((plan) => { const elegido = plan.id === solicitud.plan; return `<label class="card plan ${elegido ? 'selected' : ''}"><input type="radio" name="plan" value="${plan.id}" ${elegido ? 'checked' : ''}><span class="badge" ${plan.recomendado ? '' : 'hidden'}>Recomendado</span><h3>${plan.nombre}</h3><p class="plan-price">${dinero(calcularCuota(solicitud.equipo.valor, plan.tasaAnual, solicitud.equipo.antiguedad))}<small>/mes</small></p><ul>${plan.coberturas.map((c) => `<li>${c}</li>`).join('')}</ul></label>`; }).join('')}</div><div class="actions"><button class="btn" data-variant="outline" data-action="volver" data-paso="1">Volver</button><button class="btn" data-action="avanzar" data-paso="3">Continuar</button></div></div>${resumen()}</div>`; }
function datos() { const t = solicitud.titular; return `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"><div class="card form-card">${stepper()}<h2>Datos del titular</h2><p class="muted">Necesitamos estos datos para emitir la póliza.</p><form data-form="titular" novalidate><div class="fields lg:grid-cols-2">${[['nombre','Nombre'],['apellido','Apellido'],['dni','DNI'],['nacimiento','Fecha de nacimiento','date'],['email','Email','email'],['celular','Celular','tel']].map(([campo,label,tipo='text']) => `<div class="field" ${invalid(campo)}><label for="${campo}">${label}</label><input id="${campo}" name="${campo}" type="${tipo}" value="${esc(t[campo])}" aria-invalid="${Boolean(errores[campo])}">${error(campo)}</div>`).join('')}</div><div class="field" ${invalid('terminos')}><label class="check-field"><input id="terminos" name="terminos" type="checkbox" ${t.terminos ? 'checked' : ''}> <span>Acepto los términos y condiciones del seguro.</span></label>${error('terminos')}</div><div class="actions"><button type="button" class="btn" data-variant="outline" data-action="volver" data-paso="2">Volver</button><button class="btn" type="submit" ${pasoValido(3) ? '' : 'disabled'}>Continuar al pago</button></div></form></div>${resumen()}</div>`; }
function pago() { const p = solicitud.pago; const nombre = `${solicitud.titular.nombre} ${solicitud.titular.apellido}`.trim(); return `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"><div class="card form-card">${stepper()}<h2>Pago seguro</h2><p class="muted">Esta operación es una simulación. No uses una tarjeta real.</p><form data-form="pago" novalidate><div class="fields"><fieldset class="field"><legend>Medio de pago</legend><div class="choices">${[['credito','Tarjeta de crédito'],['debito','Tarjeta de débito']].map(([v,l]) => `<span class="choice"><input id="metodo-${v}" type="radio" name="metodo" value="${v}" ${p.metodo === v ? 'checked' : ''}><label for="metodo-${v}">${l}</label></span>`).join('')}</div></fieldset><div class="field" ${invalid('tarjeta')}><label for="tarjeta">Número de tarjeta</label><input id="tarjeta" name="tarjeta" inputmode="numeric" autocomplete="cc-number" value="${esc(p.tarjeta)}" placeholder="4111 1111 1111 1111">${error('tarjeta')}</div><div class="fields lg:grid-cols-2"><div class="field" ${invalid('vencimiento')}><label for="vencimiento">Vencimiento</label><input id="vencimiento" name="vencimiento" value="${esc(p.vencimiento)}" placeholder="MM/AA" inputmode="numeric">${error('vencimiento')}</div><div class="field" ${invalid('cvv')}><label for="cvv">CVV</label><input id="cvv" name="cvv" type="password" value="${esc(p.cvv)}" inputmode="numeric" maxlength="3">${error('cvv')}</div></div><div class="field" ${invalid('titularPago')}><label for="titularPago">Titular de la tarjeta</label><input id="titularPago" name="titularPago" value="${esc(p.titular || nombre)}">${error('titularPago')}</div></div><div class="alert notice">Probá con <strong>4111 1111 1111 1111</strong> para aprobar o <strong>4000 0000 0000 0002</strong> para rechazar.</div><div class="actions"><button type="button" class="btn" data-variant="outline" data-action="volver" data-paso="3">Volver</button><button class="btn" type="submit" ${procesando || !pasoValido(4) ? 'disabled' : ''}>${procesando ? 'Procesando…' : `Pagar ${dinero(cuotaActual())}`}</button></div></form></div>${resumen()}</div>`; }
function exito() { return `<section class="card success"><div class="status-icon">✓</div><h2>¡Tu seguro está listo!</h2><p class="lead">Gracias, ${esc(solicitud.titular.nombre)}. Enviamos los detalles de tu póliza a ${esc(solicitud.titular.email)}.</p><p class="badge">${esc(solicitud.poliza)}</p><p class="muted">Plan ${esc(planes.find((p) => p.id === solicitud.plan)?.nombre)} · ${dinero(cuotaActual())} por mes</p><button class="btn" data-action="inicio">Volver al inicio</button></section>`; }
function fallo() { return `<section class="card success failure"><div class="status-icon">!</div><h2>No pudimos procesar el pago</h2><p class="lead">La tarjeta fue rechazada. Revisá los datos o probá con otro medio de pago.</p><div class="alert notice error-notice" data-variant="destructive">Tus datos de contratación se conservaron.</div><div class="actions"><button class="btn" data-variant="outline" data-action="volver" data-paso="4">Cambiar medio de pago</button><button class="btn" data-action="reintentar">Reintentar pago</button></div></section>`; }

export function render() {
  const app = document.querySelector('#app');
  const vistas = { 0: inicio, 1: cotizar, 2: planesVista, 3: datos, 4: pago, 5: exito, 6: fallo };
  document.querySelectorAll('[data-paso]').forEach((s) => {
    const activa = Number(s.dataset.paso) === solicitud.paso;
    s.hidden = !activa;
    if (activa) s.innerHTML = vistas[solicitud.paso]();
  });
  app.querySelectorAll('div.field').forEach((f) => f.setAttribute('role', 'group'));
  app.querySelectorAll('.field[data-invalid] .error').forEach((p) => p.closest('.field').querySelector('input, select')?.setAttribute('aria-describedby', p.id));
  if (ultimoPaso !== solicitud.paso) { window.scrollTo({ top: 0, behavior: 'smooth' }); ultimoPaso = solicitud.paso; }
}
