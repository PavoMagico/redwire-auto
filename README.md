# 🚗 Red Wire Auto — Asesor Inteligente de Vehículos

> Proyecto Intermodular · 2º DAW · CESUR Málaga · Santiago de Pablo de Castro

## Descripción

Red Wire Auto es una SPA (Single Page Application) que actúa como Garaje Digital inteligente.  
Su núcleo es un **algoritmo de recomendación de vehículos** basado en un cuestionario interactivo sobre hábitos de conducción, situación familiar y presupuesto.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + React Router 6 |
| Backend | Node.js + Express |
| Base de datos | MySQL |
| Autenticación | JWT + bcryptjs |
| HTTP client | Axios |

---

## Estructura del proyecto

```
redwire/
├── db/
│   └── schema.sql          # Schema MySQL + datos de prueba
├── server/                 # Backend Node.js
│   ├── config/db.js        # Pool de conexión MySQL
│   ├── controllers/        # Lógica de negocio
│   │   ├── authController.js      # Registro y login
│   │   ├── vehicleController.js   # CRUD vehículos
│   │   ├── testController.js      # Algoritmo de afinidad
│   │   └── garageController.js    # Favoritos del usuario
│   ├── middleware/auth.js  # Verificación JWT
│   ├── routes/index.js     # Definición de rutas API
│   └── index.js            # Servidor Express
└── client/                 # Frontend React
    └── src/
        ├── context/AuthContext.jsx   # Estado global de auth
        ├── services/api.js           # Capa HTTP con Axios
        ├── components/               # Componentes reutilizables
        │   ├── Navbar.jsx
        │   ├── VehicleCard.jsx
        │   └── PrivateRoute.jsx
        └── pages/                    # Vistas de la app
            ├── Home.jsx
            ├── Test.jsx              # Wizard de 6 preguntas
            ├── Results.jsx           # Dashboard de resultados
            ├── Dealership.jsx        # Catálogo con filtros
            ├── VehicleDetail.jsx     # Ficha técnica
            ├── Garage.jsx            # Favoritos del usuario
            ├── Login.jsx
            ├── Register.jsx
            └── Admin.jsx             # Panel CRUD admin
```

---

## Instalación y arranque

### Requisitos previos
- Node.js 18+
- MySQL 8.0+

### 1. Base de datos
```bash
mysql -u root -p < db/schema.sql
```

### 2. Backend
```bash
cd server
cp .env.example .env
# Edita .env con tus credenciales MySQL
npm install
npm run dev
# Servidor en http://localhost:3001
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
# App en http://localhost:5173
```

---

## API REST — Endpoints implementados

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registro de usuario | — |
| POST | `/api/auth/login` | Login + JWT | — |
| GET | `/api/vehicles` | Catálogo (con filtros) | — |
| GET | `/api/vehicles/:id` | Ficha de vehículo | — |
| POST | `/api/test/process` | Calcular afinidad | — |
| GET | `/api/user/garage` | Mis favoritos | JWT |
| POST | `/api/user/garage` | Añadir favorito | JWT |
| DELETE | `/api/user/garage/:id` | Eliminar favorito | JWT |
| POST | `/api/admin/catalog` | Crear vehículo | JWT+Admin |
| PUT | `/api/admin/catalog/:id` | Editar vehículo | JWT+Admin |
| DELETE | `/api/admin/catalog/:id` | Eliminar vehículo | JWT+Admin |

---

## Credenciales de prueba

**Admin:**  
Email: `admin@redwire.auto`  
Password: `Admin123`

---

## Algoritmo de afinidad

El endpoint `POST /api/test/process` puntúa cada vehículo del catálogo sobre 100 puntos:

| Criterio | Puntos |
|---|---|
| Presupuesto | 30 |
| Plazas | 20 |
| Tipo de motor | 20 |
| Uso (ciudad/carretera/mixto/deportivo) | 15 |
| Situación familiar | 10 |
| Etiqueta ambiental | 5 |

Los vehículos con 0 puntos se filtran del resultado final.
