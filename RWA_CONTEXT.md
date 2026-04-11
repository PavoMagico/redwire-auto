# 🚗 RED WIRE AUTO — ARCHIVO DE CONTEXTO DEL PROYECTO
> Última actualización: 10 abril 2026
> Autor: Santiago de Pablo de Castro | 2º DAW CESUR Málaga

---

## 1. DESCRIPCIÓN GENERAL

**Red Wire Auto** es una aplicación web SPA (Single Page Application) que actúa como "Garaje Digital" inteligente.
Su núcleo es un **algoritmo de recomendación de vehículos** basado en un cuestionario interactivo (Wizard) sobre hábitos de conducción, situación familiar y presupuesto.

**Objetivo:** Democratizar el asesoramiento automotriz — imparcial, fácil de usar, sin tecnicismos.

---

## 2. ROLES / ACTORES

| Rol | Descripción |
|---|---|
| **Invitado** | Acceso a Landing Page + test limitado (sin guardar resultados) |
| **Usuario Registrado** | Perfil "Mi Garaje", test completo, favoritos, comparativas, notificaciones |
| **Administrador** | CRUD catálogo de vehículos, gestión de usuarios, ajuste del algoritmo |

---

## 3. IDENTIDAD VISUAL

| Color | HEX | Uso |
|---|---|---|
| Rojo Principal | `#BE3D3D` | Botones de acción, logotipo, destacados |
| Negro de Contraste | `#010001` | Texto principal, iconos, silueta de marca |
| Gris Técnico | `#525252` | Cuerpo de texto, leyendas secundarias |
| Gris Fondo | `#A39796` | Tarjetas, divisores de sección |
| Blanco Base | `#FCFCFA` | Fondo general de la SPA |

**Tipografía:** Sans Serif (palo seco) en todo el sitio.

**Logo:** Silueta de coche en negro + cable rojo en forma de nudo de corazón + texto "RED WIRE AUTO".

---

## 4. STACK TECNOLÓGICO

| Capa | Tecnología elegida |
|---|---|
| Frontend | React (SPA) |
| Backend | Node.js con Express |
| Base de datos | MySQL (relacional) |
| Autenticación | JWT (JSON Web Tokens) |
| Control de versiones | Git + GitHub |

---

## 5. ARQUITECTURA

**Patrón:** Cliente-Servidor con MVC desacoplado vía API REST.

```
Frontend (React SPA)
      ↕ HTTP (JSON)
Backend (Node.js / Express)
      ↕ SQL
Base de Datos (MySQL)
```

**3 capas:**
- Presentación (React) → captura eventos, renderiza componentes reactivos
- Negocio (Node.js) → controladores de rutas API + algoritmo de recomendación
- Datos (MySQL) → persistencia de usuarios, vehículos, tests, favoritos

---

## 6. BASE DE DATOS — ENTIDADES

### Usuarios
```
id_usuario INT (PK)
nombre VARCHAR(100)
email VARCHAR(100) UNIQUE
password VARCHAR(255)
rol ENUM('admin', 'user')
```

### Vehículos
```
id_vehiculo INT (PK)
marca VARCHAR(50)
modelo VARCHAR(50)
precio DECIMAL(10,2)
motor VARCHAR(50)
etiqueta VARCHAR(10)
plazas INT
detalles TEXT
```

### Tests
```
id_test INT (PK)
id_usuario INT (FK)
id_vehiculo INT (FK)
fecha DATETIME
afinidad DECIMAL(5,2)
```

### Favoritos (tabla intermedia N:M)
```
id_usuario INT (PK, FK)
id_vehiculo INT (PK, FK)
```

---

## 7. API REST — RUTAS BACKEND

| Método | Endpoint | Acción | Actor |
|---|---|---|---|
| POST | `/api/auth/login` | Autenticación + JWT | Todos |
| POST | `/api/auth/register` | Crear usuario + email bienvenida | Invitado |
| GET | `/api/vehicles` | Catálogo con filtros precio/motor | Todos |
| POST | `/api/test/process` | Procesar respuestas + calcular afinidad | Todos |
| GET | `/api/user/garage` | Obtener favoritos guardados | Registrado |
| POST | `/api/user/garage` | Añadir vehículo a favoritos | Registrado |
| CRUD | `/api/admin/catalog` | Gestión total del catálogo | Administrador |

---

## 8. MAPA DE NAVEGACIÓN (ESTADOS)

```
Landing Page (Inicio)
    ├── Login / Registro ──→ Perfil (Garaje) ──→ Ficha de Detalle
    │        └──→ Panel de Administración
    └── Wizard Test() ──→ Dashboard (Resultados) ──→ Ficha de Detalle
                                                   └──→ Perfil (Garaje)
```

---

## 9. CASOS DE USO PRINCIPALES

- **CU-01: Realizar Test de Preferencias** (núcleo de la app)
  - <<include>> → Consultar Resultados
- **Gestionar Garaje Virtual** (solo registrado)
  - <<include>> → Autenticación
- **Visualizar Ficha Técnica**
  - <<extend>> → Comparar Vehículos
- **Gestión Catálogo / Usuarios** (solo admin)

---

## 10. REQUISITOS CLAVE

**Funcionales:**
- Calcular % de afinidad (0-100%) entre perfil usuario y vehículos
- Filtrado por rango de precios y tipo de combustible
- Email de bienvenida al registrarse
- Historial de recomendaciones por usuario

**No funcionales:**
- Carga de resultados < 2 segundos
- Contraseñas cifradas (bcrypt u similar)
- Arquitectura escalable (añadir vehículos/filtros sin reescribir código)
- Interfaz sin tecnicismos, usable sin conocimientos mecánicos

---

## 11. COMPONENTES FRONTEND (wireframes)

### Landing Page
- `Navbar` (persistente)
- `HeroSection` — propuesta de valor + CTA principal
- `UserSegmentCard` × 3 — "Dominguero", "Familia numerosa", "Aficionado"
- Sección de features: Concesionario, Test Personal, Garaje

### Wizard (Test)
- `TestWizardManager` — controla estado reactivo del proceso
- `ProgressBar` — Categoría X/3, Pregunta X/10
- `QuestionBlock` — pregunta actual
- `AnswerOption` × N — botones de respuesta (sin recarga de página)

### Garaje / Concesionario (estructura reutilizable)
- `FilterSidebar` — filtros reactivos (Marca, Modelo, Motor, Plazas, Precio)
- `VehicleGrid` — cuadrícula de resultados
- `VehicleCard` — tarjeta individual de vehículo

---

## 12. ESTADO ACTUAL DEL PROYECTO

**Entrega 1 y 2 completadas:**
- ✅ Documento de proyecto completo (PDF + DOCX)
- ✅ Identidad visual (logo, paleta de colores)
- ✅ Diagrama de casos de uso (UML)
- ✅ Diagrama de estados / mapa de navegación
- ✅ Diagrama Entidad-Relación (BD)
- ✅ Wireframes de las 3 vistas principales (Inicio, Test, Garaje)
- ✅ Diseño de la arquitectura por capas
- ✅ Diseño de la API REST
- ✅ Definición de requisitos funcionales y no funcionales
- ✅ Stack tecnológico definido

**Pendiente (3ª Entrega):**
- ⏳ Ver sección 13

---

## 13. HOJA DE RUTA — 3ª ENTREGA

> Basado en la documentación actual, la 3ª entrega probablemente requiere pasar de la planificación a la **implementación real** del proyecto. Los pasos lógicos a seguir son:

### FASE A — Setup del Proyecto
1. Inicializar repositorio GitHub con estructura de carpetas (`/client`, `/server`, `/db`)
2. Configurar proyecto React (Vite + React Router) para el frontend
3. Inicializar servidor Node.js + Express con estructura MVC
4. Crear base de datos MySQL con el schema del ERD

### FASE B — Backend (API REST)
5. Implementar modelo de `Usuarios` + bcrypt para contraseñas
6. Crear endpoint `POST /api/auth/register` con envío de email (Nodemailer)
7. Crear endpoint `POST /api/auth/login` con generación de JWT
8. Middleware de autenticación (verificación de token JWT)
9. Implementar modelo de `Vehículos` + endpoint `GET /api/vehicles`
10. **Algoritmo de afinidad:** `POST /api/test/process` — lógica de puntuación
11. Endpoints del Garaje: `GET/POST /api/user/garage`
12. Endpoints admin: `CRUD /api/admin/catalog`

### FASE C — Frontend (React)
13. Configurar React Router con las rutas del mapa de navegación
14. Crear componente `Navbar` persistente
15. Maquetar `Landing Page` con `HeroSection` + 3 `UserSegmentCard`
16. Desarrollar `TestWizard` — formulario multi-paso con `ProgressBar`
17. Desarrollar `Dashboard de Resultados` con tarjetas de afinidad
18. Desarrollar vista `Garaje / Concesionario` con `FilterSidebar` + `VehicleGrid`
19. Página de `Ficha de Detalle` del vehículo
20. Formularios de `Login` y `Registro`
21. Panel de `Administración` (CRUD vehículos)

### FASE D — Integración y Pruebas
22. Conectar frontend con la API REST (Axios / Fetch)
23. Implementar Context/Zustand para estado de autenticación global
24. Pruebas de la API con Postman/Thunder Client
25. Testing de flujo completo: Registro → Test → Resultados → Guardar favorito

### FASE E — Presentación
26. Despliegue en entorno de pruebas (Railway / Vercel / localhost)
27. Documentación final (README, comentarios en código)
28. Preparar demo para la presentación

---

## 14. NOTAS Y DECISIONES TÉCNICAS PENDIENTES

- **React vs Angular:** El documento menciona ambos. Se asume **React** (más probable para DAW en 2026).
- **Node.js vs Java:** Se asume **Node.js + Express** (más coherente con el stack JS del frontend).
- **ORM:** No definido aún. Opciones: Sequelize, Prisma, o queries SQL directas con mysql2.
- **Email:** Nodemailer con cuenta SMTP para el email de bienvenida.
- **Estado global en React:** Pendiente definir si Context API, Zustand o Redux.
- **Despliegue:** No definido. Opciones: Railway (backend+BD), Vercel (frontend), o todo en local para entrega.

---

## 15. GLOSARIO

| Término | Descripción |
|---|---|
| SPA | Single Page Application — la app no recarga la página completa al navegar |
| JWT | JSON Web Token — token de autenticación seguro |
| Wizard | Formulario multi-paso — el test de preferencias |
| Afinidad | Porcentaje (0-100%) de compatibilidad usuario-vehículo |
| Garaje | Sección donde el usuario guarda sus vehículos favoritos |
| Concesionario | Catálogo completo de vehículos disponibles |
| CRUD | Create, Read, Update, Delete — operaciones básicas de BD |
| ERD | Entity Relationship Diagram — diagrama Entidad-Relación |
| MVC | Model-View-Controller — patrón de arquitectura |
| API REST | Interfaz de comunicación entre frontend y backend vía HTTP/JSON |

---
*Este archivo debe actualizarse a medida que avanza el desarrollo.*
