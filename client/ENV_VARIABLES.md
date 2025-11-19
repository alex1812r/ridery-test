# Variables de Entorno del Frontend

Agrega las siguientes variables a tu archivo `.env` en la carpeta `client/`:

## Configuración de la API
```
VITE_API_URL=http://localhost:5000/api
```

## Notas
- Las variables de Vite deben comenzar con `VITE_` para estar disponibles en el código
- Esta variable se usa en tiempo de build, no en runtime
- En producción, actualiza con la URL real de tu backend

