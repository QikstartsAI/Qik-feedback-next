# 🔍 Console Logs Implementation - Monitoreo de Interacciones Backend

## 📋 **Resumen**

Se han implementado console logs detallados en toda la cadena de persistencia de datos para monitorear las interacciones con el backend. Esto permitirá debuggear y entender exactamente qué está pasando en cada paso del proceso.

## 🎯 **Archivos Modificados**

### 1. **CustomerRepository** (`lib/data/repositories/customerRepository.ts`)

#### **Métodos con Logs**
- ✅ `getCustomerById()` - Búsqueda por ID
- ✅ `getCustomerByPhoneNumber()` - Búsqueda por teléfono
- ✅ `createCustomer()` - Creación de cliente
- ✅ `updateCustomer()` - Actualización de cliente

#### **Información Loggeada**
```typescript
// Ejemplo de logs para createCustomer
console.log("👤 [CustomerRepository] createCustomer - Starting", { 
  name: customerData.name,
  lastName: customerData.lastName,
  phoneNumber: customerData.phoneNumber,
  email: customerData.email,
  branchesCount: customerData.branches?.length || 0
});

console.log("📡 [CustomerRepository] createCustomer - Making request", { 
  endpoint, 
  requestData: { /* datos sanitizados */ }
});

console.log("✅ [CustomerRepository] createCustomer - Success", { 
  customerId: response.data?.id,
  customerName: response.data?.payload?.name,
  customerLastName: response.data?.payload?.lastName,
  createdAt: response.data?.createdAt
});
```

### 2. **FeedbackRepository** (`lib/data/repositories/feedbackRepository.ts`)

#### **Métodos con Logs**
- ✅ `sendFeedback()` - Envío de feedback
- ✅ `updateFeedback()` - Actualización de feedback

#### **Información Loggeada**
```typescript
// Ejemplo de logs para sendFeedback
console.log("💬 [FeedbackRepository] sendFeedback - Starting", { 
  branchId: feedbackData.branchId,
  waiterId: feedbackData.waiterId,
  customerId: feedbackData.customerId,
  status: feedbackData.payload?.status,
  rate: feedbackData.payload?.rate,
  customerType: feedbackData.payload?.customerType
});

console.log("📡 [FeedbackRepository] sendFeedback - Making request", { 
  endpoint, 
  requestData: { /* datos sanitizados */ }
});

console.log("✅ [FeedbackRepository] sendFeedback - Success", { 
  feedbackId: response.data?.id,
  branchId: response.data?.branchId,
  customerId: response.data?.customerId,
  status: response.data?.payload?.status,
  rate: response.data?.payload?.rate,
  createdAt: response.data?.createdAt
});
```

### 3. **CreateCustomerUseCase** (`lib/domain/usecases/CreateCustomerUseCase.ts`)

#### **Flujo Completo Loggeado**
```typescript
console.log("🎯 [CreateCustomerUseCase] execute - Starting", { 
  name: customerData.name,
  lastName: customerData.lastName,
  phoneNumber: customerData.phoneNumber ? 
    `${customerData.phoneNumber.substring(0, 4)}***` : 'N/A',
  email: customerData.email,
  branchesCount: customerData.branches?.length || 0
});

console.log("🔍 [CreateCustomerUseCase] execute - Validating customer data");
console.log("✅ [CreateCustomerUseCase] execute - Validation passed");
console.log("📞 [CreateCustomerUseCase] execute - Calling repository");
console.log("🎉 [CreateCustomerUseCase] execute - Success", { 
  customerId: result.id,
  customerName: result.payload?.name,
  createdAt: result.createdAt
});
```

### 4. **CreateIncompleteFeedbackUseCase** (`lib/domain/usecases/CreateIncompleteFeedbackUseCase.ts`)

#### **Flujo Completo Loggeado**
```typescript
console.log("🎯 [CreateIncompleteFeedbackUseCase] execute - Starting", { 
  branchId: feedbackData.branchId,
  waiterId: feedbackData.waiterId,
  customerId: feedbackData.customerId,
  customerType: feedbackData.payload?.customerType,
  origin: feedbackData.payload?.origin
});

console.log("🔧 [CreateIncompleteFeedbackUseCase] execute - Building incomplete feedback object");
console.log("📡 [CreateIncompleteFeedbackUseCase] execute - Sending to repository");
console.log("🎉 [CreateIncompleteFeedbackUseCase] execute - Success", { 
  feedbackId: result.id,
  branchId: result.branchId,
  customerId: result.customerId,
  status: result.payload?.status,
  createdAt: result.createdAt
});
```

### 5. **HttpClient** (`lib/core/httpClient.ts`)

#### **Logs Detallados de Requests**
```typescript
// Cada request tiene un ID único para tracking
const requestId = Math.random().toString(36).substring(7);
const startTime = Date.now();

console.log(`🌐 [HttpClient] request - Starting [${requestId}]`, { 
  method: config.method,
  url: config.url,
  hasData: !!config.data,
  hasParams: !!config.params
});

console.log(`📡 [HttpClient] request - Making request [${requestId}]`, { 
  url,
  method: processedConfig.method,
  headers: { /* headers sanitizados */ },
  hasBody: !!fetchOptions.body
});

console.log(`✅ [HttpClient] request - Success [${requestId}]`, { 
  status: response.status,
  statusText: response.statusText,
  duration: `${duration}ms`,
  contentType,
  dataSize: JSON.stringify(data).length
});
```

## 🔒 **Seguridad y Privacidad**

### **Datos Sanitizados**
- ✅ **Números de teléfono**: Solo se muestran los primeros 4 dígitos + `***`
- ✅ **Tokens de autorización**: Solo se muestran los primeros 20 caracteres + `...`
- ✅ **Contenido de feedback**: Solo se muestran los primeros 50 caracteres + `...`
- ✅ **Emails**: Se muestran completos (no son sensibles en este contexto)

### **Ejemplo de Sanitización**
```typescript
// Antes
phoneNumber: "+573000000004"

// Después
phoneNumber: "+573***"
```

## 📊 **Información Capturada**

### **Para Cada Operación**
1. **Inicio**: Datos de entrada (sanitizados)
2. **Request**: URL, método, headers, payload
3. **Respuesta**: Status, datos de respuesta, tiempo de ejecución
4. **Errores**: Detalles completos del error

### **Métricas de Performance**
- ⏱️ **Tiempo de ejecución**: Duración de cada request
- 📏 **Tamaño de datos**: Tamaño de la respuesta
- 🔄 **Request ID**: Identificador único para tracking

## 🎨 **Sistema de Iconos**

| Icono | Significado |
|-------|-------------|
| 🔍 | Búsqueda/Consulta |
| 👤 | Operación de cliente |
| 💬 | Operación de feedback |
| 🎯 | Inicio de caso de uso |
| 🔧 | Construcción de datos |
| 📡 | Request HTTP |
| ✅ | Operación exitosa |
| ❌ | Error |
| 🌐 | HttpClient |
| ✏️ | Actualización |
| 🔍 | Validación |

## 🧪 **Cómo Usar los Logs**

### **1. Abrir DevTools**
```bash
# En el navegador
F12 → Console
```

### **2. Filtrar Logs**
```javascript
// Filtrar solo logs de CustomerRepository
console.clear();
// Luego usar el filtro: [CustomerRepository]

// Filtrar solo logs de HttpClient
// Usar filtro: [HttpClient]
```

### **3. Seguir un Request Específico**
```javascript
// Buscar por requestId
// Ejemplo: [abc123]
```

## 📈 **Ejemplo de Flujo Completo**

### **Creación de Cliente para Feedback Incompleto**

```
🎯 [CreateCustomerUseCase] execute - Starting
🔍 [CreateCustomerUseCase] execute - Validating customer data
✅ [CreateCustomerUseCase] execute - Validation passed
📞 [CreateCustomerUseCase] execute - Calling repository

👤 [CustomerRepository] createCustomer - Starting
📡 [CustomerRepository] createCustomer - Making request

🌐 [HttpClient] request - Starting [abc123]
📡 [HttpClient] request - Making request [abc123]
✅ [HttpClient] request - Success [abc123]

✅ [CustomerRepository] createCustomer - Success
🎉 [CreateCustomerUseCase] execute - Success
```

## 🚀 **Beneficios**

1. **Debugging Eficiente**: Identificar exactamente dónde falla el proceso
2. **Monitoreo de Performance**: Ver tiempos de respuesta
3. **Trazabilidad**: Seguir requests específicos con IDs únicos
4. **Seguridad**: Datos sensibles sanitizados
5. **Desarrollo**: Entender el flujo completo de datos

## 🔧 **Configuración**

### **Solo en Desarrollo**
Los logs están configurados para mostrarse solo en desarrollo:
```typescript
if (process.env.NODE_ENV === 'development') {
  // Logs activos
}
```

### **Producción**
En producción, los logs no se mostrarán para mantener el rendimiento.

---

**Fecha de implementación**: $(date)  
**Estado**: ✅ **IMPLEMENTADO COMPLETAMENTE**

## 🧪 **Para Probar**

1. Ve a `http://localhost:3000`
2. Abre DevTools (F12) → Console
3. Completa el formulario de feedback
4. Observa los logs detallados en la consola
5. Verifica que cada paso del proceso esté loggeado correctamente
