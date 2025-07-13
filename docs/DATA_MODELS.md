# Qik Data Models Documentation

This document describes the complete data model structure for the Qik feedback system, including all entities, their relationships, and implementation details.

## Overview

The Qik system follows a clean architecture pattern with clear separation between domain entities, repositories, use cases, and presentation layers. All entities follow a consistent structure with `id`, `createdAt`, `updatedAt`, and `payload` fields.

## Entity Structure

### Base Interface

All entities extend the `ModelResponseBase<T>` interface:

```typescript
interface ModelResponseBase<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: T;
}
```

## Core Entities

### 1. User

**Purpose**: Represents system users (typically business owners or administrators)

**Structure**:

```typescript
type UserPayload = {
  name: string;
  lastName: string;
  phoneNumber: string;
};

interface User extends ModelResponseBase<UserPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: UserPayload;
}
```

**Repository**: `UserRepository`

- `getUserById(id: string): Promise<User>`
- `getUserByPhoneNumber(phoneNumber: string): Promise<User | null>`
- `createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>`
- `updateUser(id: string, user: Partial<User>): Promise<User>`
- `deleteUser(id: string): Promise<void>`

**Use Case**: `GetUserByIdUseCase`
**Hook**: `useUser`

### 2. Brand

**Purpose**: Represents business brands that can have multiple branches

**Structure**:

```typescript
type BrandPayload = {
  logoImgURL: string;
  coverImgURL: string;
  name: string;
  category: string;
  location: {
    address: string;
    countryCode: string;
    geopoint: { lat: number; lon: number };
    googleMapURL: string;
  };
};

interface Brand extends ModelResponseBase<BrandPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: BrandPayload;
}
```

**Repository**: `BrandRepository`

- `getBrandById(id: string): Promise<Brand>`
- `getBrandByOwner(owner: string): Promise<Brand[]>`
- `createBrand(brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand>`
- `updateBrand(id: string, brand: Partial<Brand>): Promise<Brand>`
- `deleteBrand(id: string): Promise<void>`

**Use Case**: `GetBrandByIdUseCase`
**Hook**: `useBrand`

### 3. Branch

**Purpose**: Represents physical locations of a brand

**Structure**:

```typescript
type BranchPayload = {
  logoImgURL: string;
  coverImgURL: string;
  name: string;
  category: string;
  location: {
    address: string;
    countryCode: string;
    geopoint: { lat: number; lon: number };
    googleMapURL: string;
  };
};

interface Branch extends ModelResponseBase<BranchPayload> {
  id: string;
  brandId: string; // Reference to parent brand
  createdAt: Date;
  updatedAt: Date;
  payload: BranchPayload;
}
```

**Repository**: `BranchRepository`

- `getBranchById(id: string): Promise<Branch>`
- `getBranchesByBrandId(brandId: string): Promise<Branch[]>`
- `createBranch(branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch>`
- `updateBranch(id: string, branch: Partial<Branch>): Promise<Branch>`
- `deleteBranch(id: string): Promise<void>`

**Use Case**: `GetBranchByIdUseCase`
**Hook**: `useBranch`

### 4. Waiter

**Purpose**: Represents staff members who can receive feedback

**Structure**:

```typescript
type WaiterPayload = {
  name: string;
  lastName: string;
  gender: "male" | "female";
  birthDate: Date;
  rate: number;
};

interface Waiter extends ModelResponseBase<WaiterPayload> {
  id: string;
  branchId: string; // Reference to parent branch
  createdAt: Date;
  updatedAt: Date;
  payload: WaiterPayload;
}
```

**Repository**: `WaiterRepository`

- `getWaiterById(id: string): Promise<Waiter>`
- `getWaitersByBranchId(branchId: string): Promise<Waiter[]>`
- `createWaiter(waiter: Omit<Waiter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Waiter>`
- `updateWaiter(id: string, waiter: Partial<Waiter>): Promise<Waiter>`
- `deleteWaiter(id: string): Promise<void>`

**Use Case**: `GetWaiterByIdUseCase`
**Hook**: `useWaiter`

### 5. Customer

**Purpose**: Represents customers who provide feedback

**Structure**:

```typescript
type CustomerPayload = {
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  birthDate?: Date;
  businesses: Array<{
    branchId: string;
    acceptPromotions: boolean;
  }>;
};

interface Customer extends ModelResponseBase<CustomerPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: CustomerPayload;
}
```

**Repository**: `CustomerRepository`

- `getCustomerById(id: string): Promise<Customer>`
- `getCustomerByPhoneNumber(phone: string): Promise<Customer | null>`
- `getCustomerByEmail(email: string): Promise<Customer | null>`
- `createCustomer(customerData: CustomerPayload): Promise<Customer>`
- `updateCustomer(id: string, customerData: Partial<CustomerPayload>): Promise<Customer>`
- `deleteCustomer(id: string): Promise<void>`

**Use Cases**: `GetCustomerByIdUseCase`, `GetCustomerByPhoneNumberUseCase`, `CreateCustomerUseCase`, `UpdateCustomerUseCase`
**Hook**: `useCustomer`

### 6. Feedback

**Purpose**: Represents customer feedback about their experience

**Structure**:

```typescript
interface FeedbackDataPayload {
  averageTicket: string;
  origin: string;
  feedback?: string;
  rate: number;
  experienceText?: string;
  improve?: string[];
}

interface FeedbackPayload {
  branchId: string;
  waiterId?: string;
  customerId: string;
  acceptTerms: boolean;
  acceptPromotions: boolean;
  payload: FeedbackDataPayload;
}

interface Feedback extends ModelResponseBase<FeedbackPayload> {
  id: string;
  branchId: string;
  waiterId?: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
  payload: FeedbackPayload;
}
```

**Repository**: `FeedbackRepository`

- `getFeedbackById(id: string): Promise<Feedback>`
- `getFeedbacksByBranchId(branchId: string): Promise<Feedback[]>`
- `getFeedbacksByCustomerId(customerId: string): Promise<Feedback[]>`
- `getFeedbacksByWaiterId(waiterId: string): Promise<Feedback[]>`
- `sendFeedback(feedbackData: FeedbackPayload): Promise<Feedback>`
- `updateFeedback(id: string, feedbackData: Partial<FeedbackPayload>): Promise<Feedback>`
- `deleteFeedback(id: string): Promise<void>`

**Use Case**: `SendFeedbackUseCase`
**Hook**: `useFeedback`

## Entity Relationships

```
User (owner)
  ↓
Brand (owned by User)
  ↓
Branch (belongs to Brand)
  ↓
Waiter (works at Branch)
  ↓
Feedback (about Waiter/Branch)
  ↑
Customer (provides Feedback)
```

### Relationship Details

1. **User → Brand**: One-to-many (a user can own multiple brands)
2. **Brand → Branch**: One-to-many (a brand can have multiple branches)
3. **Branch → Waiter**: One-to-many (a branch can have multiple waiters)
4. **Customer → Feedback**: One-to-many (a customer can provide multiple feedbacks)
5. **Branch → Feedback**: One-to-many (a branch can receive multiple feedbacks)
6. **Waiter → Feedback**: One-to-many (a waiter can receive multiple feedbacks)

## Implementation Architecture

### Domain Layer

- **Entities**: Define the core business objects
- **Repositories**: Define interfaces for data access
- **Use Cases**: Define business logic and operations

### Data Layer

- **Repository Implementations**: Concrete implementations of repository interfaces
- **HTTP Client**: Handles API communication

### Presentation Layer

- **Hooks**: React hooks for state management and API calls
- **Components**: UI components that use hooks

## Usage Examples

### Getting a Branch with its Brand

```typescript
const { getBranchById } = useBranch();
const { getBrandById } = useBrand();

const branch = await getBranchById(branchId);
const brand = await getBrandById(branch.brandId);
```

### Getting Waiters for a Branch

```typescript
const { getWaitersByBranchId } = useWaiter();
const waiters = await getWaitersByBranchId(branchId);
```

### Getting Feedback for a Waiter

```typescript
const { getFeedbacksByWaiterId } = useFeedback();
const feedbacks = await getFeedbacksByWaiterId(waiterId);
```

## Migration Notes

The data models have been updated to:

1. **Consistent Structure**: All entities now follow the same base structure
2. **Clear Relationships**: Foreign keys are explicitly defined
3. **Type Safety**: Strong typing throughout the system
4. **Separation of Concerns**: Clear separation between domain, data, and presentation layers
5. **Dependency Injection**: Centralized service management

## Future Enhancements

1. **Caching**: Implement caching for frequently accessed data
2. **Real-time Updates**: WebSocket integration for live data updates
3. **Analytics**: Enhanced reporting and analytics capabilities
4. **Multi-tenancy**: Support for multiple business accounts
5. **Audit Trail**: Comprehensive logging of all data changes
