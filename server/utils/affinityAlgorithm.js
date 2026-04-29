/**
 * Calcula la afinidad entre las respuestas del usuario y un vehículo.
 * @param {Object} respuestas - Respuestas del wizard
 * @param {Object} vehiculo - Vehículo del catálogo
 * @returns {number} Puntuación de 0 a 100
 */
function calcularAfinidad(respuestas, vehiculo) {
  let puntos = 0;

  // --- PRESUPUESTO (30 pts) ---
  const precio = parseFloat(vehiculo.precio);
  const presupuesto = parseFloat(respuestas.presupuesto);
  if (precio <= presupuesto) {
    puntos += 30;
  } else {
    const exceso = (precio - presupuesto) / presupuesto;
    if (exceso <= 0.10) puntos += 20;
    else if (exceso <= 0.20) puntos += 10;
    else if (exceso <= 0.30) puntos += 5;
  }

  // --- PLAZAS (20 pts) ---
  const plazasVehiculo = parseInt(vehiculo.plazas);
  const plazasRequeridas = parseInt(respuestas.plazas);
  if (plazasVehiculo >= plazasRequeridas) {
    puntos += 20;
  } else if (plazasVehiculo === plazasRequeridas - 1) {
    puntos += 10;
  }

  // --- TIPO DE MOTOR (20 pts) ---
  const motorVehiculo = vehiculo.motor?.toLowerCase();
  const motorUsuario = respuestas.motor?.toLowerCase();
  if (motorVehiculo === motorUsuario) {
    puntos += 20;
  } else if (
    (motorVehiculo === 'hibrid' && (motorUsuario === 'gasolina' || motorUsuario === 'electrico')) ||
    (motorVehiculo === 'gasolina' && motorUsuario === 'hibrid') ||
    (motorVehiculo === 'electrico' && motorUsuario === 'hibrid')
  ) {
    puntos += 10;
  }

  // --- USO DEL VEHÍCULO (15 pts) ---
  const usoVehiculo = vehiculo.uso?.toLowerCase();
  const usoUsuario = respuestas.uso?.toLowerCase();
  if (usoVehiculo === usoUsuario) {
    puntos += 15;
  } else if (usoVehiculo === 'mixto') {
    puntos += 10;
  }

  // --- SITUACIÓN FAMILIAR (10 pts) ---
  const familia = respuestas.familia?.toLowerCase();
  const plazas = parseInt(vehiculo.plazas);
  if (
    (familia === 'soltero' && plazas >= 2) ||
    (familia === 'pareja' && plazas >= 2) ||
    (familia === 'hijos' && plazas >= 4) ||
    (familia === 'familia_numerosa' && plazas >= 5)
  ) {
    puntos += 10;
  }

  // --- ETIQUETA AMBIENTAL (5 pts) ---
  const etiquetaVehiculo = vehiculo.etiqueta?.toUpperCase();
  const etiquetaUsuario = respuestas.etiqueta?.toUpperCase();
  if (etiquetaUsuario === 'CUALQUIERA' || etiquetaUsuario === 'cualquiera') {
    puntos += 5;
  } else if (etiquetaVehiculo === etiquetaUsuario) {
    puntos += 5;
  } else if (etiquetaUsuario === 'ECO' && etiquetaVehiculo === 'ZERO') {
    puntos += 3;
  }

  return puntos;
}

module.exports = { calcularAfinidad };
