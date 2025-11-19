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
│   │   │   │   └── StatusDialog.vue      # Dialog cambiar estado
│   │   │   ├── schemas/
│   │   │   │   └── vehicleSchema.js     # Validación de vehículos
│   │   │   ├── stores/
│   │   │   │   └── vehicleStore.js      # Store de vehículos (Pinia)
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
│   │   ├── DashboardLayout.vue  # Layout principal con sidebar y navegación
│   │   └── HelloWorld.vue
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
├── .env                          # Variables de entorno (no versionado)
└── ENV_VARIABLES.md              # Documentación de variables de entorno
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
- `VehiclesView.vue` - Lista de vehículos con paginación server-side

**Componentes:**
- `VehicleDialog.vue` - Dialog para crear/editar vehículos
- `StatusDialog.vue` - Dialog para cambiar estado de vehículo

**Store:**
- `vehicleStore.js` - Gestión de estado de vehículos (fetch, create, update status)

**Características:**
- Paginación server-side con `v-data-table-server`
- Indicadores del dashboard con llamadas a API
- Validación de formularios con VeeValidate
- Estados visuales con chips de colores
- Manejo de loading y errores

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

## 💻 Uso

### Desarrollo:
```bash
npm run dev
```

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
- ✅ **Dashboard con métricas**: Indicadores en tiempo real
- ✅ **UI moderna**: Vuetify con Material Design
- ✅ **Manejo de errores**: Interceptores de Axios para errores 401
- ✅ **Responsive design**: Adaptable a móviles y tablets

## 📝 Convenciones de Código

- **Screaming Architecture**: Organización por módulos funcionales
- **Composition API**: Uso de `<script setup>` y Composition API
- **Código limpio**: Variables en inglés, comentarios en español
- **Validaciones robustas**: Schemas de Zod para validación de formularios
- **Separación de responsabilidades**: Stores, componentes, vistas separados
