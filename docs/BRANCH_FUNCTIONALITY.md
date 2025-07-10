# Branch Functionality

This document describes the complete implementation for getting a branch by ID, including the repository, use case, context, and hook.

## Architecture Overview

The branch functionality follows the same clean architecture pattern as the existing customer functionality:

```
Domain Layer (Entities & Use Cases)
    ↓
Data Layer (Repositories & Context)
    ↓
Presentation Layer (Hooks & Components)
```

## Components

### 1. Domain Layer

#### Branch Entity (`lib/domain/entities.ts`)

```typescript
export type BranchPayload = {
  name: string;
  address: string;
  country: string;
  city: string;
  coverImgURL?: string;
  logo?: string;
  geopoint?: { _lat: number; _long: number };
  hasGeolocation?: boolean;
};

export interface Branch extends ModelResponseBase<BranchPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: BranchPayload;
}
```

#### Branch Repository Interface (`lib/domain/repositories/iBranchRepository.ts`)

```typescript
export interface BranchRepository {
  getBranchById(id: string): Promise<Branch>;
}
```

#### Get Branch By ID Use Case (`lib/domain/usecases/GetBranchByIdUseCase.ts`)

```typescript
export interface IGetBranchByIdUseCase {
  execute(id: string): Promise<Branch>;
}

export class GetBranchByIdUseCase implements IGetBranchByIdUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(id: string): Promise<Branch> {
    // Validation and business logic
    return await this.branchRepository.getBranchById(id);
  }
}
```

### 2. Data Layer

#### Branch Repository Implementation (`lib/data/repositories/branchRepository.ts`)

```typescript
export class BranchRepositoryImpl implements BranchRepository {
  constructor(private httpClient: IHttpClient, private baseUrl?: string) {}

  async getBranchById(id: string): Promise<Branch> {
    const response = await this.httpClient.get<Branch>(
      `${this.baseUrl}/branches/${id}`
    );
    return response.data;
  }
}
```

#### Branch Context (`lib/data/context/BranchContext.tsx`)

```typescript
export function BranchProvider({ children }: BranchProviderProps) {
  // State management and dependency injection
  const getBranchById = useCallback(async (id: string) => {
    // Implementation with error handling and loading states
  }, []);

  return (
    <BranchContext.Provider value={contextValue}>
      {children}
    </BranchContext.Provider>
  );
}
```

### 3. Presentation Layer

#### Branch Hook (`hooks/useBranch.ts`)

```typescript
export function useBranch(): UseBranchReturn {
  const context = useBranchContext();

  return {
    currentBranch: context.currentBranch,
    loading: context.loading,
    error: context.error,
    getBranchById: context.getBranchById,
    clearError: context.clearError,
    clearCurrentBranch: context.clearCurrentBranch,
  };
}

export function useBranchSearch() {
  const { getBranchById, loading, error, clearError } = useBranch();

  const searchById = useCallback(
    async (id: string) => {
      clearError();
      return await getBranchById(id);
    },
    [getBranchById, clearError]
  );

  return { searchById, loading, error, clearError };
}
```

## Usage Examples

### Basic Usage with Hook

```typescript
import { useBranch } from "@/hooks/useBranch";

function MyComponent() {
  const { currentBranch, loading, error, getBranchById } = useBranch();

  const handleGetBranch = async () => {
    const branch = await getBranchById("branch-id-123");
    if (branch) {
      console.log("Branch found:", branch.payload.name);
    }
  };

  return (
    <div>
      <button onClick={handleGetBranch} disabled={loading}>
        {loading ? "Loading..." : "Get Branch"}
      </button>

      {error && <p className="error">{error}</p>}

      {currentBranch && (
        <div>
          <h2>{currentBranch.payload.name}</h2>
          <p>{currentBranch.payload.address}</p>
        </div>
      )}
    </div>
  );
}
```

### Using the Search Hook

```typescript
import { useBranchSearch } from "@/hooks/useBranch";

function BranchSearchComponent() {
  const { searchById, loading, error } = useBranchSearch();

  const handleSearch = async (branchId: string) => {
    const branch = await searchById(branchId);
    if (branch) {
      // Handle successful search
    }
  };

  return <div>{/* Your search UI */}</div>;
}
```

### Direct Context Usage

```typescript
import { useBranchContext } from "@/lib/data/context";

function DirectContextComponent() {
  const { getBranchById, currentBranch, loading } = useBranchContext();

  // Direct access to context methods
  const handleGetBranch = () => getBranchById("branch-id");
}
```

## Setup Requirements

### 1. Dependency Injection

The branch services are automatically registered in the dependency injection container:

```typescript
// ServiceIdentifiers.ts
export const BRANCH_REPOSITORY = Symbol("BranchRepository");
export const GET_BRANCH_BY_ID_USE_CASE = Symbol("GetBranchByIdUseCase");

// ServiceRegistry.ts
container.registerSingleton(BRANCH_REPOSITORY, async () => {
  const httpClient = await container.resolve<IHttpClient>(HTTP_CLIENT);
  return createBranchRepository(httpClient);
});

container.registerSingleton(GET_BRANCH_BY_ID_USE_CASE, async () => {
  const branchRepository = await container.resolve<BranchRepository>(
    BRANCH_REPOSITORY
  );
  return new GetBranchByIdUseCase(branchRepository);
});
```

### 2. Context Provider

The `BranchProvider` is automatically included in the `MultiProvider`:

```typescript
// multiProvider.tsx
export const MultiProvider = ({ children }: MultiProviderProps) => {
  return (
    <APIProvider>
      <ThemeProvider>
        <CustomerProvider>
          <BranchProvider>{children}</BranchProvider>
        </CustomerProvider>
      </ThemeProvider>
    </APIProvider>
  );
};
```

## API Endpoint

The repository expects the following API endpoint:

```
GET /api/branches/{id}
```

Response format:

```json
{
  "id": "branch-id-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "payload": {
    "name": "Branch Name",
    "address": "123 Main St",
    "country": "US",
    "city": "New York",
    "coverImgURL": "https://example.com/cover.jpg",
    "logo": "https://example.com/logo.jpg",
    "geopoint": {
      "_lat": 40.7128,
      "_long": -74.006
    },
    "hasGeolocation": true
  }
}
```

## Error Handling

The implementation includes comprehensive error handling:

- **Validation Errors**: Invalid branch ID format
- **Network Errors**: HTTP request failures
- **Service Errors**: Dependency injection issues
- **Business Logic Errors**: Custom business rule violations

All errors are captured and exposed through the hook's `error` state.

## Testing

You can test the functionality using the provided example component:

```typescript
import { UseBranchHookExample } from "@/components/examples/UseBranchHookExample";

// In your page or component
<UseBranchHookExample />;
```

This component provides a complete UI for testing the branch functionality with error handling and loading states.
