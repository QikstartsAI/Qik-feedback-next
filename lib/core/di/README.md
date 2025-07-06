# Dependency Injection System

This directory contains a comprehensive dependency injection system for the application, following clean architecture principles.

## Overview

The DI system provides:

- **Container**: Manages service registration and resolution
- **ServiceLocator**: Global access to the container
- **ServiceRegistry**: Centralized service configuration
- **ServiceIdentifiers**: Type-safe service identification
- **React Integration**: Hooks and providers for React components

## Architecture

```
lib/core/di/
├── Container.ts           # Core DI container
├── ServiceLocator.ts      # Global service locator
├── ServiceRegistry.ts     # Service registration
├── ServiceIdentifiers.ts  # Service identifiers
├── index.ts              # Public exports
└── README.md             # This file
```

## Usage

### 1. Basic Container Usage

```typescript
import { Container } from "@/lib/core/di";

const container = new Container();

// Register a singleton service
container.registerSingleton("MyService", () => new MyService());

// Register a transient service
container.registerTransient("MyService", () => new MyService());

// Resolve a service
const myService = await container.resolve("MyService");
```

### 2. Using Service Registry

```typescript
import { ServiceRegistry } from "@/lib/core/di";

// Initialize all services
ServiceRegistry.initialize();

// Get a service
const customerUseCase = await ServiceRegistry.getService(
  GET_CUSTOMER_BY_ID_USE_CASE
);
```

### 3. React Integration

```typescript
// Wrap your app with the provider
import { DependencyInjectionProvider } from "@/components/providers/DependencyInjectionProvider";

function App() {
  return (
    <DependencyInjectionProvider>
      <YourApp />
    </DependencyInjectionProvider>
  );
}

// Use in components
import { useDependencyInjection } from "@/components/providers/DependencyInjectionProvider";

function MyComponent() {
  const { getService, isInitialized } = useDependencyInjection();

  const handleAction = async () => {
    const useCase = await getService<IGetCustomerByIdUseCase>(
      GET_CUSTOMER_BY_ID_USE_CASE
    );
    const result = await useCase.execute("customer-id");
  };
}
```

## Service Registration

Services are registered in `ServiceRegistry.ts`:

```typescript
// Core services
container
  .registerInstance(
    API_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL || "/api"
  )
  .registerSingleton(HTTP_CLIENT, () => HttpClient.createWithEnv());

// Repositories
container.registerSingleton(CUSTOMER_REPOSITORY, async () => {
  const httpClient = await container.resolve<IHttpClient>(HTTP_CLIENT);
  const baseUrl = await container.resolve<string>(API_BASE_URL);
  return createCustomerRepository(httpClient, baseUrl);
});

// Use cases
container.registerSingleton(GET_CUSTOMER_BY_ID_USE_CASE, async () => {
  const customerRepository = await container.resolve<CustomerRepository>(
    CUSTOMER_REPOSITORY
  );
  return new GetCustomerByIdUseCase(customerRepository);
});
```

## Service Identifiers

Use symbols for type-safe service identification:

```typescript
// In ServiceIdentifiers.ts
export const CUSTOMER_REPOSITORY = Symbol("CustomerRepository");
export const GET_CUSTOMER_BY_ID_USE_CASE = Symbol("GetCustomerByIdUseCase");

// Usage
const customerRepo = await container.resolve<CustomerRepository>(
  CUSTOMER_REPOSITORY
);
```

## Best Practices

1. **Use Interfaces**: Always define interfaces for your services
2. **Type Safety**: Use TypeScript generics for type-safe resolution
3. **Singleton vs Transient**: Choose appropriate lifecycle for your services
4. **Dependency Order**: Register dependencies before dependents
5. **Error Handling**: Handle resolution errors gracefully

## Testing

For testing, you can replace the container:

```typescript
import { Container } from "@/lib/core/di";

const testContainer = new Container();
testContainer.registerInstance(CUSTOMER_REPOSITORY, mockCustomerRepository);

const serviceLocator = ServiceLocator.getInstance();
serviceLocator.setContainer(testContainer);
```

## Migration Guide

### From Direct Instantiation

**Before:**

```typescript
const httpClient = new HttpClient();
const customerRepo = new CustomerRepositoryImpl(httpClient);
const useCase = new GetCustomerByIdUseCase(customerRepo);
```

**After:**

```typescript
const useCase = await ServiceRegistry.getService<IGetCustomerByIdUseCase>(
  GET_CUSTOMER_BY_ID_USE_CASE
);
```

### From Factory Functions

**Before:**

```typescript
const customerRepo = createCustomerRepository();
```

**After:**

```typescript
const customerRepo = await ServiceRegistry.getService<CustomerRepository>(
  CUSTOMER_REPOSITORY
);
```
