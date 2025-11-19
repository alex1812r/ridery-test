# Variables de Entorno Requeridas - Backend

Agrega las siguientes variables a tu archivo `.env` en la carpeta `server/`:

## Configuración de MongoDB
```
MONGODB_URI=mongodb://localhost:27017/ridery
```

## Configuración del Servidor
```
PORT=3000
NODE_ENV=development
```

## Configuración de JWT
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

## Configuración de SMTP (Mailtrap)
```
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=87dd3400f35e72
SMTP_PASS=tu-contraseña-de-mailtrap-aquí
SMTP_FROM=noreply@ridery.com
```

## URL del Frontend (para enlaces en correos)
```
FRONTEND_URL=http://localhost:4173
```

## Notas
- Reemplaza `tu-contraseña-de-mailtrap-aquí` con tu contraseña real de Mailtrap
- En producción, actualiza `FRONTEND_URL` con la URL real de tu frontend
- El `SMTP_FROM` es el email que aparecerá como remitente en los correos
- El `PORT` puede ser sobrescrito por docker-compose si es necesario
- `MONGODB_URI` será sobrescrito automáticamente por docker-compose para usar el servicio de MongoDB interno

