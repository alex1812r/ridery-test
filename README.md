# Ridery - Sistema de Gestión de Vehículos

Sistema completo de gestión de vehículos construido con **Node.js + Express** (Backend) y **Vue.js 3 + Vite** (Frontend), siguiendo Clean Architecture y Screaming Architecture respectivamente.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Configuración Inicial](#configuración-inicial)
- [Ejecución con Docker](#ejecución-con-docker-recomendado)
- [Ejecución en Desarrollo Local](#ejecución-en-desarrollo-local)
- [Poblar Base de Datos](#poblar-base-de-datos)
- [Acceso a los Servicios](#acceso-a-los-servicios)
- [Documentación](#documentación)

## 📁 Estructura del Proyecto

```
ridery/
├── server/                 # Backend (Node.js + Express)
│   ├── src/                # Código fuente
│   ├── .env                # Variables de entorno (crear)
│   ├── Dockerfile          # Imagen Docker del backend
│   ├── README.md           # Documentación del backend
│   └── ENV_VARIABLES.md    # Variables de entorno requeridas
│
├── client/                 # Frontend (Vue 3 + Vite)
│   ├── src/                # Código fuente
│   ├── .env                # Variables de entorno (crear)
│   ├── Dockerfile          # Imagen Docker del frontend
│   ├── nginx.conf          # Configuración Nginx
│   ├── README.md           # Documentación del frontend
│   └── ENV_VARIABLES.md    # Variables de entorno requeridas
│
├── docker-compose.yml      # Orquestación de servicios
└── README.md               # Este archivo
```

## 🔧 Requisitos Previos

### Para Docker (Recomendado):
- **Docker** y **Docker Compose** instalados
- Verificar instalación:
  ```bash
  docker --version
  docker compose version
  ```

### Para Desarrollo Local:
- **Node.js** 20 o superior
- **MongoDB** 7 o superior (o usar Docker solo para MongoDB)
- **npm** o **yarn**

## ⚙️ Configuración Inicial

### 1. Variables de Entorno - Backend

Crea el archivo `server/.env` con las siguientes variables:

```env
# MongoDB (será sobrescrito por Docker, pero necesario para desarrollo local)
MONGODB_URI=mongodb://localhost:27017/ridery

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=tu-secret-key-super-segura-aqui
JWT_EXPIRES_IN=7d

# SMTP (Mailtrap para desarrollo)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=87dd3400f35e72
SMTP_PASS=tu-contraseña-de-mailtrap-aquí
SMTP_FROM=noreply@ridery.com

# Frontend URL (para enlaces en correos)
FRONTEND_URL=http://localhost:4173
```

**Notas:**
- `MONGODB_URI`: Con Docker, será sobrescrito automáticamente para usar el servicio interno
- `SMTP_PASS`: Reemplaza con tu contraseña real de Mailtrap
- `JWT_SECRET`: Usa una clave segura y aleatoria en producción
- `FRONTEND_URL`: Actualiza con la URL real de tu frontend en producción

### 2. Variables de Entorno - Frontend

Crea el archivo `client/.env` con:

```env
VITE_API_URL=http://localhost:5000/api
```

**Notas:**
- Las variables de Vite deben comenzar con `VITE_` para estar disponibles en el código
- Esta variable se usa en tiempo de build, no en runtime
- En producción, actualiza con la URL real de tu backend

## 🐳 Ejecución con Docker (Recomendado)

Esta es la forma más sencilla de ejecutar todo el proyecto, incluyendo MongoDB.

### 1. Construir y levantar todos los servicios:

```bash
docker compose up --build
```

Este comando:
- Descarga la imagen de MongoDB
- Construye las imágenes del backend y frontend
- Levanta los tres servicios (mongodb, backend, frontend)
- Carga las variables de entorno desde los archivos `.env`

### 2. Ejecutar en segundo plano:

```bash
docker compose up -d
```

### 3. Ver logs:

```bash
# Todos los servicios
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo frontend
docker compose logs -f frontend

# Solo MongoDB
docker compose logs -f mongodb
```

### 4. Detener servicios:

```bash
docker compose down
```

### 5. Detener y eliminar volúmenes (⚠️ elimina datos):

```bash
docker compose down -v
```

### 6. Reconstruir después de cambios:

```bash
docker compose up --build
```

## 💻 Ejecución en Desarrollo Local

Si prefieres ejecutar los servicios localmente (útil para desarrollo con hot-reload):

### Opción 1: MongoDB con Docker, Backend y Frontend locales

1. **Levantar solo MongoDB:**
   ```bash
   docker compose up mongodb -d
   ```

2. **Instalar dependencias del backend:**
   ```bash
   cd server
   npm install
   ```

3. **Iniciar backend en modo desarrollo:**
   ```bash
   cd server
   npm run dev
   ```
   El backend estará disponible en: `http://localhost:5000`

4. **Instalar dependencias del frontend:**
   ```bash
   cd client
   npm install
   ```

5. **Iniciar frontend en modo desarrollo:**
   ```bash
   cd client
   npm run dev
   ```
   El frontend estará disponible en: `http://localhost:5173` (puerto por defecto de Vite)

### Opción 2: Todo local (requiere MongoDB instalado)

1. **Iniciar MongoDB localmente:**
   ```bash
   # En Windows (si MongoDB está instalado como servicio, se inicia automáticamente)
   # En Linux/Mac:
   mongod
   ```

2. **Seguir pasos 2-5 de la Opción 1**

## 🌱 Poblar Base de Datos

Para crear datos de prueba (usuario admin y 25 vehículos):

### Con Docker:

```bash
docker compose exec backend npm run seed
```

### Desarrollo Local:

```bash
cd server
npm run seed
```

Esto creará:
- **Usuario administrador**: 
  - Email: `admin@ridery.com`
  - Password: `admin123`
- **15 marcas de vehículos** (Toyota, Honda, Ford, Chevrolet, Nissan, etc.)
- **~150 modelos de vehículos** distribuidos entre las marcas
- **25 vehículos** con diferentes marcas, modelos, años y estados

## 🌐 Acceso a los Servicios

Una vez que todo esté corriendo:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:4173 | Interfaz de usuario |
| **Backend API** | http://localhost:5000 | API REST |
| **Swagger Docs** | http://localhost:5000/api-docs | Documentación interactiva |
| **Health Check** | http://localhost:5000/api/health | Estado del servidor |
| **MongoDB** | mongodb://localhost:27017 | Base de datos (desde host) |
| **Mailtrap** | https://mailtrap.io/ | Ver correos enviados (recuperación de contraseña) |

## 📬 Ver Correos Enviados (Mailtrap)

El proyecto utiliza **Mailtrap** para probar el envío de correos en desarrollo. Los correos enviados (como los de recuperación de contraseña) **NO se envían a direcciones reales**, sino que se capturan en la bandeja de entrada de Mailtrap.

### Cómo ver los correos:

1. **Accede a Mailtrap**: [https://mailtrap.io/](https://mailtrap.io/)
2. **Inicia sesión** con las siguientes credenciales:
   - **Email**: `alex1812r+2025@gmail.com`
   - **Password**: `Alexander123456.`
3. **Navega a "Email Sandbox"** o **"Inboxes"** en el panel
4. **Los correos enviados** aparecerán en la bandeja de entrada de prueba
5. **Haz clic en cualquier correo** para ver:
   - Contenido HTML completo
   - Enlace de recuperación de contraseña
   - Versión texto plano
   - Headers y metadatos

### Cuándo se envían correos:

- Cuando un usuario solicita recuperación de contraseña (`POST /api/auth/forgot-password`)
- El correo contiene un enlace con el token para restablecer la contraseña
- El enlace apunta a: `http://localhost:4173/recovery-password?token=xxx`

**Nota importante**: Los correos se capturan automáticamente en Mailtrap y no se envían a direcciones de correo reales. Esto es ideal para desarrollo y pruebas sin enviar correos reales a usuarios.

### Con Docker:
- Frontend: http://localhost:4173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017 (desde el host)

### Desarrollo Local:
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## 📚 Documentación

- **Backend**: Ver `server/README.md` para detalles de arquitectura, módulos y endpoints
- **Frontend**: Ver `client/README.md` para detalles de estructura, módulos y componentes
- **API Swagger**: http://localhost:5000/api-docs (interactiva)

## 🔍 Troubleshooting

### Error: "Cannot connect to MongoDB"
- **Con Docker**: Verifica que el servicio `mongodb` esté corriendo: `docker compose ps`
- **Local**: Verifica que MongoDB esté instalado y corriendo

### Error: "Port already in use"
- Verifica que los puertos 5000, 4173 y 27017 no estén en uso
- Cambia los puertos en `docker-compose.yml` si es necesario

### Error: "env_file not found"
- Asegúrate de crear los archivos `.env` en `server/` y `client/`
- Verifica que las rutas en `docker-compose.yml` sean correctas

### Frontend no se conecta al backend
- Verifica que `VITE_API_URL` en `client/.env` apunte al puerto correcto del backend
- Con Docker: usa `http://localhost:5000/api`
- Desarrollo local: usa `http://localhost:5000/api`

### Reconstruir después de cambios en dependencias
```bash
docker compose down
docker compose build --no-cache
docker compose up
```

## 🚀 Comandos Útiles

```bash
# Ver estado de los servicios
docker compose ps

# Reiniciar un servicio específico
docker compose restart backend

# Ver logs en tiempo real
docker compose logs -f backend

# Ejecutar comando en un contenedor
docker compose exec backend npm run seed

# Limpiar todo (contenedores, imágenes, volúmenes)
docker compose down -v --rmi all
```

## 📝 Notas

- **Docker**: Las variables de entorno se cargan automáticamente desde los archivos `.env`
- **Desarrollo Local**: Necesitas tener MongoDB corriendo o usar Docker solo para MongoDB
- **Hot Reload**: En desarrollo local, los cambios se reflejan automáticamente
- **Producción**: Los builds de Docker están optimizados para producción

## 🏗️ Arquitectura

- **Backend**: Clean Architecture (Routes → Controllers → Services → Models)
- **Frontend**: Screaming Architecture (módulos por funcionalidad)
- **Base de Datos**: MongoDB con Mongoose ODM y relaciones entre colecciones
- **Autenticación**: JWT con tokens Bearer
- **Validación**: Zod (frontend) y validaciones en servicios (backend)

## 🔄 Funcionalidades Principales

### Gestión de Vehículos
- **CRUD completo**: Crear, leer, actualizar y eliminar vehículos
- **Formulario en cascada**: Selección de marca → carga dinámica de modelos
- **Atributos cerrados**: Todos los campos son selects con opciones predefinidas del backend
- **Paginación server-side**: Manejo eficiente de grandes volúmenes de datos
- **Ordenamiento**: Por múltiples campos (ID, marca, modelo, año, estado, fecha)
- **Filtros avanzados**: 
  - Búsqueda unificada en marca, modelo e ID único
  - Filtro por rango de años
- **Relaciones**: Vehículos relacionados con marcas y modelos (estructura relacional)

### Autenticación y Seguridad
- **Registro y login** con JWT
- **Recuperación de contraseña** con tokens temporales y envío de correos
- **Protección de rutas** con guards en frontend y middleware en backend
- **Hash de contraseñas** con bcryptjs

### Dashboard
- **Indicadores en tiempo real**: Total de usuarios, vehículos registrados, vehículos activos
- **Agregaciones optimizadas** con Mongoose

### Gestión de Marcas y Modelos
- **Entidades separadas**: VehicleMark y VehicleModel con relación
- **Endpoints dedicados**: Para obtener marcas y modelos desde el frontend
- **Validación de relaciones**: El backend valida que el modelo pertenezca a la marca

## 📦 Stack Tecnológico

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Nodemailer para correos
- Swagger para documentación

### Frontend:
- Vue 3 + Composition API
- Vite como build tool
- Vuetify 3 para UI
- Pinia para estado
- VeeValidate + Zod para validación
- Axios para peticiones HTTP

---

Para más detalles sobre cada proyecto, consulta los README específicos:
- [Backend README](server/README.md)
- [Frontend README](client/README.md)

