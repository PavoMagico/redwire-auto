const { calcularAfinidad } = require('../utils/affinityAlgorithm');

// Vehículo base para tests (perfil estándar)
const vehiculoBase = {
  precio: 20000,
  plazas: 5,
  motor: 'Gasolina',
  uso: 'ciudad',
  etiqueta: 'C'
};

// Respuestas base del usuario (perfil estándar)
const respuestasBase = {
  presupuesto: 20000,
  plazas: 5,
  motor: 'Gasolina',
  uso: 'ciudad',
  familia: 'hijos',
  etiqueta: 'C'
};

// ================================================================
// BLOQUE 1: PRESUPUESTO (30 pts)
// ================================================================
describe('Criterio: Presupuesto', () => {
  test('Precio igual al presupuesto → 30 pts', () => {
    const v = { ...vehiculoBase, precio: 20000 };
    const r = { ...respuestasBase, presupuesto: 20000 };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(30);
  });

  test('Precio menor al presupuesto → 30 pts', () => {
    const v = { ...vehiculoBase, precio: 15000 };
    const r = { ...respuestasBase, presupuesto: 20000 };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(30);
  });

  test('Precio excede presupuesto un 8% → 20 pts', () => {
    const v = { ...vehiculoBase, precio: 21600, plazas: 5, motor: 'Gasolina', uso: 'ciudad', etiqueta: 'C' };
    const r = { presupuesto: 20000, plazas: 5, motor: 'Gasolina', uso: 'ciudad', familia: 'hijos', etiqueta: 'C' };
    const resultado = calcularAfinidad(r, v);
    // Solo presupuesto cambia: debería sumar 20 en vez de 30 → diferencia de 10
    const baseline = calcularAfinidad({ ...r, presupuesto: 21600 }, v);
    expect(baseline - resultado).toBe(10);
  });

  test('Precio excede presupuesto un 15% → 10 pts', () => {
    const v = { ...vehiculoBase, precio: 23000 };
    const r = { ...respuestasBase, presupuesto: 20000 };
    const baseline = calcularAfinidad({ ...r, presupuesto: 23000 }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(20);
  });

  test('Precio excede presupuesto un 25% → 5 pts', () => {
    const v = { ...vehiculoBase, precio: 25000 };
    const r = { ...respuestasBase, presupuesto: 20000 };
    const baseline = calcularAfinidad({ ...r, presupuesto: 25000 }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(25);
  });

  test('Precio excede presupuesto más del 30% → 0 pts presupuesto', () => {
    const v = { ...vehiculoBase, precio: 30000 };
    const r = { ...respuestasBase, presupuesto: 20000 };
    const baseline = calcularAfinidad({ ...r, presupuesto: 30000 }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(30);
  });
});

// ================================================================
// BLOQUE 2: PLAZAS (20 pts)
// ================================================================
describe('Criterio: Plazas', () => {
  test('Plazas del vehículo ≥ plazas requeridas → 20 pts', () => {
    const v = { ...vehiculoBase, plazas: 7 };
    const r = { ...respuestasBase, plazas: 5 };
    const sinPlazas = calcularAfinidad({ ...r, plazas: 7 }, v);
    const conPlazas = calcularAfinidad(r, v);
    expect(conPlazas - sinPlazas).toBe(0); // ambos suman 20
  });

  test('Plazas exactas → 20 pts', () => {
    const v = { ...vehiculoBase, plazas: 5 };
    const r = { ...respuestasBase, plazas: 5 };
    const resultado = calcularAfinidad(r, v);
    expect(resultado).toBeGreaterThanOrEqual(20);
  });

  test('1 plaza menos de lo requerido → 10 pts', () => {
    const v = { ...vehiculoBase, plazas: 4 };
    const r = { ...respuestasBase, plazas: 5 };
    const baseline = calcularAfinidad({ ...r, plazas: 4 }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(10);
  });

  test('2 plazas menos de lo requerido → 0 pts plazas', () => {
    const v = { ...vehiculoBase, plazas: 3 };
    const r = { ...respuestasBase, plazas: 5 };
    const baseline = calcularAfinidad({ ...r, plazas: 3 }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(20);
  });
});

// ================================================================
// BLOQUE 3: MOTOR (20 pts)
// ================================================================
describe('Criterio: Tipo de motor', () => {
  test('Motor coincide exactamente → 20 pts', () => {
    const v = { ...vehiculoBase, motor: 'Diesel' };
    const r = { ...respuestasBase, motor: 'Diesel' };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(20);
  });

  test('Híbrido ↔ Gasolina → compatibilidad parcial 10 pts', () => {
    const v = { ...vehiculoBase, motor: 'Hibrid' };
    const r = { ...respuestasBase, motor: 'Gasolina' };
    const baseline = calcularAfinidad({ ...r, motor: 'Hibrid' }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(10);
  });

  test('Híbrido ↔ Eléctrico → compatibilidad parcial 10 pts', () => {
    const v = { ...vehiculoBase, motor: 'Hibrid' };
    const r = { ...respuestasBase, motor: 'Electrico' };
    const baseline = calcularAfinidad({ ...r, motor: 'Hibrid' }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(10);
  });

  test('Diesel ↔ Gasolina → sin compatibilidad 0 pts', () => {
    const v = { ...vehiculoBase, motor: 'Diesel' };
    const r = { ...respuestasBase, motor: 'Gasolina' };
    const baseline = calcularAfinidad({ ...r, motor: 'Diesel' }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(20);
  });
});

// ================================================================
// BLOQUE 4: USO (15 pts)
// ================================================================
describe('Criterio: Uso del vehículo', () => {
  test('Uso coincide exactamente → 15 pts', () => {
    const v = { ...vehiculoBase, uso: 'carretera' };
    const r = { ...respuestasBase, uso: 'carretera' };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(15);
  });

  test('Vehículo mixto → compatibilidad parcial 10 pts', () => {
    const v = { ...vehiculoBase, uso: 'mixto' };
    const r = { ...respuestasBase, uso: 'ciudad' };
    const baseline = calcularAfinidad({ ...r, uso: 'mixto' }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(5);
  });

  test('Uso incompatible → 0 pts uso', () => {
    const v = { ...vehiculoBase, uso: 'deportivo' };
    const r = { ...respuestasBase, uso: 'ciudad' };
    const baseline = calcularAfinidad({ ...r, uso: 'deportivo' }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(15);
  });
});

// ================================================================
// BLOQUE 5: FAMILIA (10 pts)
// ================================================================
describe('Criterio: Situación familiar', () => {
  test('Soltero con vehículo de 2 plazas → 10 pts', () => {
    const v = { ...vehiculoBase, plazas: 2 };
    const r = { ...respuestasBase, familia: 'soltero', plazas: 2 };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(10);
  });

  test('Familia numerosa con vehículo de 5 plazas → 10 pts', () => {
    const v = { ...vehiculoBase, plazas: 5 };
    const r = { ...respuestasBase, familia: 'familia_numerosa', plazas: 5 };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(10);
  });

  test('Familia numerosa con vehículo de 4 plazas → 0 pts familia', () => {
    const v = { ...vehiculoBase, plazas: 4 };
    const r = { ...respuestasBase, familia: 'familia_numerosa', plazas: 4 };
    const baseline = calcularAfinidad({ ...r, familia: 'familia_numerosa', plazas: 5 }, { ...v, plazas: 5 });
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(10);
  });
});

// ================================================================
// BLOQUE 6: ETIQUETA AMBIENTAL (5 pts)
// ================================================================
describe('Criterio: Etiqueta ambiental', () => {
  test('Etiqueta coincide exactamente → 5 pts', () => {
    const v = { ...vehiculoBase, etiqueta: 'ECO' };
    const r = { ...respuestasBase, etiqueta: 'ECO' };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(5);
  });

  test('Usuario pide ECO, vehículo tiene ZERO → 3 pts parciales', () => {
    const v = { ...vehiculoBase, etiqueta: 'ZERO' };
    const r = { ...respuestasBase, etiqueta: 'ECO' };
    const conZero = calcularAfinidad(r, v);
    const conEco = calcularAfinidad(r, { ...v, etiqueta: 'ECO' });
    expect(conEco - conZero).toBe(2); // 5 - 3 = 2 de diferencia
  });

  test('Etiqueta CUALQUIERA → siempre suma 5 pts', () => {
    const v = { ...vehiculoBase, etiqueta: 'B' };
    const r = { ...respuestasBase, etiqueta: 'CUALQUIERA' };
    expect(calcularAfinidad(r, v)).toBeGreaterThanOrEqual(5);
  });

  test('Etiqueta incompatible → 0 pts etiqueta', () => {
    const v = { ...vehiculoBase, etiqueta: 'B' };
    const r = { ...respuestasBase, etiqueta: 'ZERO' };
    const baseline = calcularAfinidad({ ...r, etiqueta: 'B' }, v);
    const resultado = calcularAfinidad(r, v);
    expect(baseline - resultado).toBe(5);
  });
});

// ================================================================
// BLOQUE 7: TESTS DE INTEGRACIÓN DEL ALGORITMO
// ================================================================
describe('Integración: puntuación total', () => {
  test('Perfil perfecto → 100 pts', () => {
    const vehiculo = {
      precio: 20000,
      plazas: 5,
      motor: 'Gasolina',
      uso: 'ciudad',
      etiqueta: 'C'
    };
    const respuestas = {
      presupuesto: 20000,
      plazas: 5,
      motor: 'Gasolina',
      uso: 'ciudad',
      familia: 'hijos',
      etiqueta: 'C'
    };
    expect(calcularAfinidad(respuestas, vehiculo)).toBe(100);
  });

  test('Perfil totalmente incompatible → 0 pts', () => {
    const vehiculo = {
      precio: 60000,
      plazas: 2,
      motor: 'Diesel',
      uso: 'deportivo',
      etiqueta: 'B'
    };
    const respuestas = {
      presupuesto: 15000,
      plazas: 7,
      motor: 'Electrico',
      uso: 'ciudad',
      familia: 'familia_numerosa',
      etiqueta: 'ZERO'
    };
    expect(calcularAfinidad(respuestas, vehiculo)).toBe(0);
  });

  test('Puntuación siempre entre 0 y 100', () => {
    const vehiculo = { precio: 25000, plazas: 4, motor: 'Hibrid', uso: 'mixto', etiqueta: 'ECO' };
    const respuestas = { presupuesto: 22000, plazas: 5, motor: 'Gasolina', uso: 'ciudad', familia: 'pareja', etiqueta: 'ECO' };
    const resultado = calcularAfinidad(respuestas, vehiculo);
    expect(resultado).toBeGreaterThanOrEqual(0);
    expect(resultado).toBeLessThanOrEqual(100);
  });
});
