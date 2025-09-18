# Configuración de Variables de Entorno

Para que la aplicación funcione correctamente con el backend, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

## Variables Requeridas

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://ec2-54-172-125-136.compute-1.amazonaws.com/api/v1
NEXT_PUBLIC_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZmQ3ZWEzZS03N2U1LTQ3MGUtODE2Mi1kNmVmZjI3YTFhMzgiLCJicmFuZElkIjpudWxsLCJpYXQiOjE3NTgxNTIxNDAsImV4cCI6MTc1ODIzODU0MH0.FKI8LG4FQLX46nPrizuPzDLPoXfyDBkv6Ve-wf5N3QM
```

## Variables Opcionales

```env
# Mapbox Configuration (for geolocation)
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key_here

# Google Maps Configuration
NEXT_PUBLIC_VITE_APP_GOOGLE_API_KEY=your_google_maps_api_key_here
```

## Cómo Configurar

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia las variables de arriba al archivo
3. Reemplaza `your_mapbox_api_key_here` y `your_google_maps_api_key_here` con tus API keys reales
4. Reinicia el servidor de desarrollo (`npm run dev`)

## Notas Importantes

- **NEXT_PUBLIC_API_KEY**: Este es el JWT token que se usa para autenticar todas las peticiones al backend (se envía como `Authorization: Bearer`)
- **NEXT_PUBLIC_API_BASE_URL**: La URL base de la API backend
- Las variables que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente (browser)
- El archivo `.env.local` no debe ser committeado al repositorio (ya está en .gitignore)
- **IMPORTANTE**: El backend espera el JWT como `Authorization: Bearer` token

## Verificación

Para verificar que la configuración funciona:

1. Ve a `http://localhost:3000/test-api`
2. Haz clic en los botones de prueba
3. Deberías ver datos reales de la API en lugar de errores de autenticación
