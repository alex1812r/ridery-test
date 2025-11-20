# Ridery Frontend

Frontend del sistema Ridery, construido con **Vue 3**, **Vite**, **Vuetify** y **Pinia** siguiendo **Screaming Architecture**.

## 🏗️ Arquitectura

El proyecto sigue **Screaming Architecture**, organizando el código por funcionalidad (módulos) en lugar de por tipo de archivo:

- **Módulos**: Cada funcionalidad tiene su propio módulo (auth, vehicles, profile)
- **Core**: Configuraciones centrales compartidas (API, Router, Stores globales)
- **Shared**: Componentes, composables y utilidades reutilizables
- **Plugins**: Configuración de plugins de Vue (Vuetify)

## 📁 Estructura del Proyecto

```
client/
├── src/
│   ├── core/                    # Configuraciones centrales
│   │   ├── api/
│   │   │   └── axios.js         # Cliente HTTP con interceptores
│   │   ├── router/
│   │   │   └── index.js        # Configuración de rutas y guards
│   │   └── stores/
│   │       └── authStore.js    # Store global de autenticación
│   │
│   ├── modules/                 # Módulos por funcionalidad (Screaming Architecture)
│   │   ├── auth/                # Módulo de Autenticación
│   │   │   ├── schemas/         # Schemas de validación (Zod)
│   │   │   │   ├── loginSchema.js
│   │   │   │   ├── registerSchema.js
│   │   │   │   ├── forgotPasswordSchema.js
│   │   │   │   └── recoveryPasswordSchema.js
│   │   │   └── views/           # Vistas del módulo
│   │   │       ├── LoginView.vue
│   │   │       ├── RegisterView.vue
│   │   │       ├── ForgotPasswordView.vue
│   │   │       └── RecoveryPasswordView.vue
│   │   │
│   │   ├── vehicles/            # Módulo de Vehículos
│   │   │   ├── components/      # Componentes específicos del módulo
│   │   │   │   ├── VehicleDialog.vue    # Dialog crear/editar vehículo
│   │   │   │   ├── StatusDialog.vue      # Dialog cambiar estado
│   │   │   │   └── ConfirmDialog.vue     # Dialog de confirmación reutilizable
│   │   │   ├── schemas/
│   │   │   │   └── vehicleSchema.js     # Validación de vehículos
│   │   │   ├── stores/
│   │   │   │   ├── vehicleStore.js      # Store de vehículos (Pinia)
│   │   │   │   └── vehicleMarkStore.js  # Store de marcas y modelos (Pinia)
│   │   │   └── views/
│   │   │       ├── DashboardView.vue    # Dashboard con indicadores
│   │   │       └── VehiclesView.vue     # Lista de vehículos con paginación
│   │   │
│   │   └── profile/             # Módulo de Perfil
│   │       ├── schemas/
│   │       │   └── profileSchema.js     # Validación de perfil y contraseña
│   │       └── views/
│   │           └── ProfileView.vue     # Editar perfil y cambiar contraseña
│   │
│   ├── components/               # Componentes globales
│   │   └── DashboardLayout.vue  # Layout principal con sidebar y navegación
│   │
│   ├── plugins/                  # Plugins de Vue
│   │   └── vuetify.js            # Configuración de Vuetify
│   │
│   ├── shared/                   # Recursos compartidos
│   │   ├── components/           # Componentes reutilizables
│   │   ├── composables/          # Composables de Vue
│   │   └── utils/                # Utilidades y helpers
│   │
│   ├── App.vue                   # Componente raíz
│   ├── main.js                   # Punto de entrada
│   └── style.css                 # Estilos globales
│
├── public/                       # Archivos estáticos
├── .dockerignore
├── Dockerfile                    # Imagen Docker del frontend
├── nginx.conf                    # Configuración de Nginx para producción
├── package.json
├── vite.config.js                # Configuración de Vite
└── .env                          # Variables de entorno (no versionado)
```

## 🔑 Módulos y Funcionalidades

### 1. Módulo de Autenticación (`/modules/auth`)

**Vistas:**
- `LoginView.vue` - Inicio de sesión
- `RegisterView.vue` - Registro de nuevos usuarios
- `ForgotPasswordView.vue` - Solicitar recuperación de contraseña
- `RecoveryPasswordView.vue` - Restablecer contraseña con token

**Schemas de Validación:**
- `loginSchema.js` - Validación de email y contraseña
- `registerSchema.js` - Validación de registro (email, contraseña, confirmación)
- `forgotPasswordSchema.js` - Validación de email
- `recoveryPasswordSchema.js` - Validación de token, nueva contraseña y confirmación

**Características:**
- Validación con VeeValidate + Zod
- Integración con `authStore` para llamadas API
- Manejo de errores y mensajes de éxito
- Redirección automática después de acciones exitosas
- Protección de rutas con guards del router

### 2. Módulo de Vehículos (`/modules/vehicles`)

**Vistas:**
- `DashboardView.vue` - Dashboard principal con indicadores (usuarios, vehículos, activos)
- `VehiclesView.vue` - Lista de vehículos con paginación server-side, ordenamiento y filtros

**Componentes:**
- `VehicleDialog.vue` - Dialog para crear/editar vehículos con formulario en cascada
- `StatusDialog.vue` - Dialog para cambiar estado de vehículo
- `ConfirmDialog.vue` - Componente reutilizable para confirmación de acciones

**Stores:**
- `vehicleStore.js` - Gestión de estado de vehículos (fetch, create, update, delete)
- `vehicleMarkStore.js` - Gestión de marcas y modelos desde el backend

**Características:**
- **Paginación server-side** con `v-data-table-server`
- **Ordenamiento** por múltiples campos (vehicleId, mark, model, year, status)
- **Filtros avanzados**:
  - Búsqueda unificada en marca, modelo e ID único (con debounce de 500ms)
  - Filtro por rango de años (yearFrom, yearTo) con selects
- **Formulario en cascada**: Marca → Modelo (se alimenta dinámicamente del backend)
- **Atributos cerrados**: Todos los campos son selects con opciones predefinidas
- **CRUD completo**: Crear, leer, actualizar y eliminar vehículos
- **Confirmación de eliminación**: Modal reutilizable con estado de carga
- **Indicadores del dashboard** con llamadas a API
- **Validación de formularios** con VeeValidate
- **Estados visuales** con chips de colores
- **Manejo de loading y errores**
- **Snackbars** para feedback de acciones (éxito/error)

### 3. Módulo de Perfil (`/modules/profile`)

**Vista:**
- `ProfileView.vue` - Editar perfil y cambiar contraseña

**Schemas:**
- `profileSchema.js` - Validación de email y cambio de contraseña

**Características:**
- Actualización de email del usuario
- Cambio de contraseña con validación de contraseña actual
- Confirmación de nueva contraseña
- Actualización automática del store después de cambios

## 🔐 Core - Configuraciones Centrales

### API (`core/api/axios.js`)
- Cliente Axios configurado con base URL desde variables de entorno
- **Interceptor de Request**: Agrega token Bearer automáticamente
- **Interceptor de Response**: Maneja errores 401 y limpia sesión

### Router (`core/router/index.js`)
- Configuración de rutas con Vue Router
- **Guards de navegación**:
  - Rutas protegidas (`requiresAuth`): Verifican token y redirigen a login
  - Rutas de invitados (`requiresGuest`): Redirigen a dashboard si hay sesión
  - Validación especial para `RecoveryPassword`: Requiere token en query params

### Stores (`core/stores/authStore.js`)
- Store global de autenticación con Pinia
- **Estado**: user, token, isAuthenticated
- **Acciones**: login, register, logout, updateProfile, changePassword, forgotPassword, recoveryPassword

## 🎨 Componentes Globales

### DashboardLayout (`components/DashboardLayout.vue`)
- Layout principal con sidebar y navegación
- Menú lateral con rutas del sistema
- Header con información del usuario y logout
- Responsive design con Vuetify

## 🛣️ Rutas

### Públicas (requierenGuest):
- `/login` - Inicio de sesión
- `/register` - Registro
- `/forgot-password` - Recuperación de contraseña
- `/recovery-password?token=xxx` - Restablecer contraseña

### Protegidas (requiresAuth):
- `/` - Dashboard con indicadores
- `/vehicles` - Lista de vehículos
- `/profile` - Perfil de usuario

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

**Notas sobre variables de entorno:**
- Las variables de Vite deben comenzar con `VITE_` para estar disponibles en el código
- Esta variable se usa en tiempo de build, no en runtime
- En producción, actualiza con la URL real de tu backend
- Con Docker: usa `http://localhost:5000/api`
- Desarrollo local: usa `http://localhost:5000/api`

## 💻 Uso

### Desarrollo:
```bash
npm run dev
```
El frontend estará disponible en: `http://localhost:5173` (puerto por defecto de Vite)

### Compilar para producción:
```bash
npm run build
```

### Previsualizar build:
```bash
npm run preview
```

## 🐳 Docker

El proyecto incluye configuración Docker con Nginx:

```bash
# Construir y levantar
docker compose up --build

# Las variables de entorno se pasan durante el build
```

**Nota**: Las variables de Vite deben estar disponibles en tiempo de build, por lo que se pasan como `build.args` en docker-compose.

## 📦 Tecnologías

- **Vue 3**: Framework progresivo con Composition API y `<script setup>`
- **Vite**: Build tool rápido y moderno
- **Vuetify 3**: Framework de componentes Material Design
- **Pinia**: Gestión de estado (alternativa moderna a Vuex)
- **Vue Router 4**: Enrutamiento con guards
- **Axios**: Cliente HTTP con interceptores
- **VeeValidate**: Validación de formularios
- **Zod**: Schemas de validación tipados

## 🎯 Características Implementadas

- ✅ **Autenticación completa**: Login, registro, recuperación de contraseña
- ✅ **Protección de rutas**: Guards de navegación con verificación de token
- ✅ **Gestión de estado**: Pinia stores por módulo
- ✅ **Validación de formularios**: VeeValidate + Zod
- ✅ **Paginación server-side**: Tabla de vehículos con paginación del backend
- ✅ **Ordenamiento server-side**: Por múltiples campos
- ✅ **Filtros avanzados**: Búsqueda unificada y filtro por rango de años
- ✅ **Formulario en cascada**: Marca → Modelo (alimentado desde backend)
- ✅ **Atributos cerrados**: Todos los campos son selects con opciones predefinidas
- ✅ **CRUD completo**: Crear, leer, actualizar y eliminar vehículos
- ✅ **Dashboard con métricas**: Indicadores en tiempo real
- ✅ **UI moderna**: Vuetify con Material Design
- ✅ **Manejo de errores**: Interceptores de Axios para errores 401
- ✅ **Feedback visual**: Snackbars para acciones exitosas/errores
- ✅ **Componentes reutilizables**: ConfirmDialog para confirmaciones
- ✅ **Responsive design**: Adaptable a móviles y tablets

## 🔄 Cómo Funciona la Aplicación

### Flujo de Autenticación

1. **Login/Registro**: Usuario ingresa credenciales
2. **API Call**: Frontend envía petición al backend
3. **Token Storage**: Si es exitoso, guarda token en `localStorage`
4. **Router Guard**: Verifica token antes de permitir acceso a rutas protegidas
5. **Interceptor**: Axios agrega automáticamente `Authorization: Bearer <token>` en cada petición
6. **Logout**: Limpia token y redirige a login

### Flujo de Gestión de Vehículos

1. **Carga Inicial**:
   - `VehiclesView` carga vehículos con `vehicleStore.fetchVehicles()`
   - Backend retorna vehículos con objetos poblados (`mark.name`, `model.name`)
   - Tabla muestra datos usando slots personalizados

2. **Crear Vehículo**:
   - Usuario hace clic en "Nuevo Vehículo"
   - `VehicleDialog` se abre y carga marcas desde `vehicleMarkStore.fetchMarks()`
   - Usuario selecciona marca → Se cargan modelos con `vehicleMarkStore.fetchModelsByMark(markId)`
   - Usuario completa formulario (marca, modelo, año, estado)
   - Al enviar, se envían ObjectIds de marca y modelo al backend
   - Backend valida y crea vehículo
   - Tabla se recarga automáticamente

3. **Editar Vehículo**:
   - Usuario hace clic en "Editar" desde el menú de acciones
   - `VehicleDialog` se abre con datos del vehículo
   - Carga marca y modelos correspondientes
   - Usuario modifica y guarda
   - Backend actualiza y tabla se recarga

4. **Eliminar Vehículo**:
   - Usuario hace clic en "Eliminar"
   - Se muestra `ConfirmDialog` con mensaje personalizado
   - Al confirmar, se envía petición DELETE al backend
   - Tabla se recarga y se muestra snackbar de éxito

### Flujo de Formulario en Cascada

1. **Carga de Marcas**: Al abrir el dialog, se cargan todas las marcas desde el backend
2. **Selección de Marca**: Usuario selecciona una marca del select
3. **Carga de Modelos**: Automáticamente se cargan los modelos de esa marca desde `GET /api/vehicle-marks/:markId/models`
4. **Habilitación de Modelo**: El select de modelo se habilita y muestra opciones
5. **Limpieza**: Si cambia la marca, se limpia el modelo seleccionado

### Flujo de Filtros y Búsqueda

1. **Búsqueda Unificada**:
   - Usuario escribe en el input de búsqueda
   - Debounce de 500ms previene múltiples peticiones
   - Backend busca en `mark.name`, `model.name` y `vehicleId`
   - Resultados se actualizan en la tabla

2. **Filtro por Años**:
   - Usuario selecciona "Año Desde" y/o "Año Hasta"
   - Se envía petición inmediatamente (sin debounce)
   - Backend filtra con operadores `$gte` y `$lte`
   - Tabla muestra resultados filtrados

3. **Limpiar Filtros**:
   - Botón "Limpiar Filtros" resetea todos los filtros
   - Recarga la lista completa

### Gestión de Estado (Pinia)

- **authStore**: Estado global de autenticación (user, token, isAuthenticated)
- **vehicleStore**: Estado de vehículos (vehicles, total, loading, error)
- **vehicleMarkStore**: Estado de marcas y modelos (marks, marksWithModels, loading)

### Interceptores de Axios

- **Request Interceptor**: Agrega token Bearer automáticamente si existe
- **Response Interceptor**: 
  - Si recibe 401, limpia sesión y redirige a login
  - Maneja errores de red y muestra mensajes apropiados

## 📝 Convenciones de Código

- **Screaming Architecture**: Organización por módulos funcionales
- **Composition API**: Uso de `<script setup>` y Composition API
- **Código limpio**: Variables en inglés, comentarios en español
- **Validaciones robustas**: Schemas de Zod para validación de formularios
- **Separación de responsabilidades**: Stores, componentes, vistas separados
