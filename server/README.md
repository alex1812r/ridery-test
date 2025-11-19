# Ridery Backend

Backend API para el sistema Ridery, construido con **Node.js**, **Express** y **MongoDB** siguiendo **Clean Architecture**.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture**, separando las responsabilidades en capas:

- **Routes**: Definición de endpoints y middlewares de autenticación
- **Controllers**: Manejo de peticiones HTTP y respuestas
- **Services**: Lógica de negocio y reglas de dominio
- **Models**: Esquemas de base de datos (Mongoose)
- **Middleware**: Funciones intermedias (autenticación, validación)
- **Config**: Configuraciones (DB, Swagger, etc.)

## 📁 Estructura del Proyecto

```
server/
├── src/
│   ├── config/              # Configuraciones del sistema
│   │   ├── db.js            # Conexión a MongoDB
│   │   └── swagger.js       # Configuración de Swagger/OpenAPI
│   │
│   ├── controllers/         # Controladores HTTP (Capa de Presentación)
│   │   ├── authController.js      # Autenticación y usuarios
│   │   ├── dashboardController.js # Indicadores del dashboard
│   │   └── vehicleController.js   # Gestión de vehículos
│   │
│   ├── services/            # Lógica de Negocio (Capa de Dominio)
│   │   ├── authService.js         # Servicios de autenticación
│   │   ├── dashboardService.js    # Agregaciones y métricas
│   │   ├── emailService.js        # Envío de correos (Nodemailer)
│   │   └── vehicleService.js      # Lógica de vehículos
│   │
│   ├── models/              # Modelos de Base de Datos
│   │   ├── User.js          # Modelo de Usuario (email, password, reset tokens)
│   │   └── Vehicle.js       # Modelo de Vehículo (mark, model, year, status)
│   │
│   ├── routes/              # Definición de Rutas
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── dashboardRoutes.js     # /api/dashboard/*
│   │   └── vehicleRoutes.js       # /api/vehicles/*
│   │
│   ├── middleware/          # Middlewares personalizados
│   │   └── authMiddleware.js      # Validación de JWT
│   │
│   ├── docs/                # Documentación
│   │   └── swagger/
│   │       └── swagger.yaml        # Documentación OpenAPI 3.0
│   │
│   ├── utils/               # Utilidades y helpers
│   │
│   ├── app.js               # Configuración de Express
│   ├── server.js            # Punto de entrada del servidor
│   └── seed.js              # Script para poblar la BD con datos de prueba
│
├── .dockerignore            # Archivos excluidos del build de Docker
├── Dockerfile                # Imagen Docker del backend
├── package.json
├── .env                      # Variables de entorno (no versionado)
└── ENV_VARIABLES.md         # Documentación de variables de entorno
```

## 🔑 Módulos y Funcionalidades

### 1. Módulo de Autenticación (`/api/auth`)

**Rutas:**
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Login y obtención de token JWT
- `PUT /api/auth/profile` - Actualizar email del usuario (requiere auth)
- `PUT /api/auth/change-password` - Cambiar contraseña (requiere auth)
- `POST /api/auth/forgot-password` - Solicitar recuperación de contraseña
- `POST /api/auth/recovery-password` - Restablecer contraseña con token

**Archivos:**
- `controllers/authController.js` - Maneja las peticiones HTTP
- `services/authService.js` - Lógica de negocio (registro, login, JWT, recuperación)
- `services/emailService.js` - Envío de correos de recuperación (Nodemailer + Mailtrap)
- `routes/authRoutes.js` - Definición de rutas y protección con middleware

**Características:**
- Hash de contraseñas con bcryptjs
- Tokens JWT con expiración configurable
- Recuperación de contraseña con tokens temporales (1 hora)
- Envío de correos con enlaces de recuperación

### 2. Módulo de Vehículos (`/api/vehicles`)

**Rutas:**
- `GET /api/vehicles` - Listar vehículos con paginación (requiere auth)
- `POST /api/vehicles` - Crear nuevo vehículo (requiere auth)
- `PATCH /api/vehicles/:id/status` - Actualizar estado de vehículo (requiere auth)

**Archivos:**
- `controllers/vehicleController.js` - Maneja las peticiones HTTP
- `services/vehicleService.js` - Lógica de negocio (CRUD, paginación, validaciones)
- `models/Vehicle.js` - Esquema de vehículo (mark, model, year, status, timestamps)
- `routes/vehicleRoutes.js` - Definición de rutas protegidas

**Características:**
- Paginación con `page` y `limit`
- Ordenamiento por fecha de creación descendente
- Estados: `available`, `maintenance`, `service`
- Tracking de usuario que crea/actualiza (createdBy, updatedBy)

### 3. Módulo de Dashboard (`/api/dashboard`)

**Rutas:**
- `GET /api/dashboard/metrics` - Indicadores del dashboard (requiere auth)

**Archivos:**
- `controllers/dashboardController.js` - Maneja las peticiones HTTP
- `services/dashboardService.js` - Agregaciones de MongoDB para métricas
- `routes/dashboardRoutes.js` - Definición de rutas protegidas

**Características:**
- Métricas usando agregaciones de Mongoose:
  - Total de usuarios
  - Total de vehículos registrados
  - Vehículos activos (status: available)
- Consultas optimizadas con `Promise.all`

## 🔐 Seguridad

- **JWT**: Autenticación basada en tokens
- **bcryptjs**: Hash de contraseñas (salt rounds: 10)
- **Middleware de autenticación**: Valida token en cada petición protegida
- **Validación de datos**: Validaciones en servicios antes de persistir
- **Tokens de recuperación**: Tokens aleatorios de 32 bytes con expiración de 1 hora

## 📧 Envío de Correos

El sistema utiliza **Nodemailer** con **Mailtrap** para envío de correos:

- **Servicio**: `services/emailService.js`
- **Configuración**: Variables de entorno (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- **Uso actual**: Envío de correos de recuperación de contraseña
- **Formato**: HTML con diseño responsive y versión texto plano

### 📬 Ver Correos Enviados en Mailtrap

El proyecto está configurado para usar **Mailtrap** como servicio de prueba de correos. Los correos enviados (como los de recuperación de contraseña) **NO se envían a direcciones reales**, sino que se capturan en la bandeja de entrada de Mailtrap.

**Para ver los correos enviados:**

1. Accede a [https://mailtrap.io/](https://mailtrap.io/)
2. Inicia sesión con las siguientes credenciales:
   - **Email**: `alex1812r+2025@gmail.com`
   - **Password**: `Alexander123456.`
3. Una vez dentro, ve a la sección **"Email Sandbox"** o **"Inboxes"**
4. Los correos enviados aparecerán en la bandeja de entrada de prueba
5. Puedes hacer clic en cualquier correo para ver su contenido completo, incluyendo el enlace de recuperación de contraseña

**Nota**: Los correos enviados desde la aplicación (como los de recuperación de contraseña) se capturan automáticamente en Mailtrap y no se envían a direcciones de correo reales. Esto es ideal para desarrollo y pruebas sin enviar correos reales.

## 📚 Documentación API (Swagger)

Documentación interactiva disponible en: **http://localhost:3000/api-docs**

- **Formato**: OpenAPI 3.0 (YAML)
- **Ubicación**: `src/docs/swagger/swagger.yaml`
- **Configuración**: `src/config/swagger.js`
- **Características**:
  - Interfaz visual para explorar endpoints
  - Probar endpoints directamente desde el navegador
  - Autenticación JWT integrada
  - Ejemplos de request/response
  - Esquemas de datos documentados

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto `server/` con las variables necesarias. Ver `ENV_VARIABLES.md` para la lista completa.

**Mínimo requerido:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ridery
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRES_IN=7d
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=87dd3400f35e72
SMTP_PASS=tu-contraseña-de-mailtrap
FRONTEND_URL=http://localhost:4173
```

3. **Asegurarse de que MongoDB esté corriendo**

## 💻 Uso

### Desarrollo:
```bash
npm run dev
```

### Producción:
```bash
npm start
```

### Poblar base de datos con datos de prueba:
```bash
npm run seed
```

Esto creará:
- 1 usuario administrador (email: `admin@ridery.com`, password: `admin123`)
- 25 vehículos de prueba con diferentes marcas, modelos y estados

## 🐳 Docker

El proyecto incluye configuración Docker:

```bash
# Construir y levantar todos los servicios
docker compose up --build

# Levantar en segundo plano
docker compose up -d

# Ver logs
docker compose logs -f backend
```

**Nota**: Las variables de entorno se cargan desde `./server/.env` automáticamente.

## 📦 Tecnologías

- **Express**: Framework web para Node.js
- **Mongoose**: ODM para MongoDB
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **nodemailer**: Envío de correos
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno
- **swagger-jsdoc**: Generación de documentación Swagger
- **swagger-ui-express**: Interfaz UI para Swagger
- **js-yaml**: Parser para archivos YAML

## 🧹 Linting y Formateo

```bash
# Verificar errores de linting
npm run lint

# Corregir errores automáticamente
npm run lint:fix

# Formatear código
npm run format

# Verificar formato
npm run format:check
```

## 📝 Convenciones de Código

- **Código limpio**: Variables en inglés, comentarios en español
- **Clean Architecture**: Separación de responsabilidades por capas
- **ES Modules**: Uso de `import/export`
- **Async/Await**: Manejo asíncrono moderno
- **Validaciones robustas**: Validación de datos en servicios
- **Manejo de errores**: Try/catch con códigos de estado apropiados
