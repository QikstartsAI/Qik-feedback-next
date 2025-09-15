# Consumption Ranges Data

Este directorio contiene los datos de rangos de consumo por país en formato JSON.

## Archivo: `consumption-ranges.json`

Este archivo contiene los rangos de consumo para cada país soportado. Cada país tiene:

- `currency`: La moneda utilizada en el país
- `ranges`: Array de rangos de consumo disponibles

### Estructura:

```json
{
  "PAIS_CODE": {
    "currency": "MONEDA",
    "ranges": ["rango1", "rango2", "rango3", ...]
  }
}
```

### Ejemplo:

```json
{
  "MX": {
    "currency": "MXN",
    "ranges": ["1-100 $", "100-200 $", "300-400 $", "400-500 $", "+500 $"]
  }
}
```

## Cómo agregar un nuevo país:

1. Abre el archivo `consumption-ranges.json`
2. Agrega una nueva entrada con el código del país (ISO 3166-1 alpha-2)
3. Define la moneda y los rangos de consumo
4. Guarda el archivo

### Ejemplo para agregar Brasil:

```json
{
  "BR": {
    "currency": "BRL",
    "ranges": ["R$ 10-30", "R$ 30-50", "R$ 50-80", "R$ 80-120", "+R$ 120"]
  }
}
```

## Ventajas de este sistema:

- ✅ **Sin recompilación**: Los cambios se reflejan inmediatamente
- ✅ **Fácil mantenimiento**: Solo editar un archivo JSON
- ✅ **Escalable**: Agregar países sin tocar código
- ✅ **Fallback**: Si el JSON falla, usa datos por defecto
- ✅ **Carga asíncrona**: No bloquea la aplicación

## Códigos de país soportados:

- `EC` - Ecuador
- `CO` - Colombia  
- `MX` - México
- `US` - Estados Unidos
- `DO` - República Dominicana
- `AR` - Argentina
- `CA` - Canadá
- `HN` - Honduras
- `GT` - Guatemala
- `ES` - España
- `FR` - Francia
- `IT` - Italia
- `HK` - Hong Kong

## Notas técnicas:

- El archivo se carga automáticamente al inicializar la aplicación
- Si hay un error de carga, se usa México como fallback
- Los datos se cachean en memoria para mejor rendimiento
- El hook `useConsumptionRanges` maneja toda la lógica de carga
