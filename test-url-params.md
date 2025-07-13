# URL Parameter Handling Test

This document demonstrates the new URL parameter handling logic implemented in the application.

## URL Parameters

The application now supports the following URL parameters:

- `id`: brandId (required)
- `branch`: branchId (optional)
- `waiter`: waiterId (optional)

## Test Cases

### 1. Waiter Parameter

**URL**: `/?id=brand1&waiter=waiter1`

**Expected Behavior**:

1. Fetch waiter with ID "waiter1"
2. Get waiter's branchId from waiter data
3. Fetch branch using waiter's branchId
4. Return branch data with waiter info
5. If brand has 'GEOLOCATION' power, show RequestLocationDialog

### 2. Branch Parameter

**URL**: `/?id=brand1&branch=branch1`

**Expected Behavior**:

1. Fetch branch with ID "branch1" directly
2. Return branch data
3. If brand has 'GEOLOCATION' power, show RequestLocationDialog

### 3. Brand Only Parameter

**URL**: `/?id=brand1`

**Expected Behavior**:

1. Fetch brand with ID "brand1"
2. Return brand data with all its branches
3. If brand has 'GEOLOCATION' power, show RequestLocationDialog

## Geolocation Logic

The application checks if the brand has geolocation power using the `hasGeolocationPower()` function. If the brand has the 'GEOLOCATION' power (HasGeolocation: true), the RequestLocationDialog logic is triggered.

## Implementation Files

1. **app/services/business.ts**: Contains the `findBrand()` function and `hasGeolocationPower()` helper
2. **hooks/useGetBusinessData.ts**: Updated to use new URL parameter names and renamed to `useGetBrandData`
3. **components/FeedbackFormRoot.tsx**: Updated to use `hasGeolocationPower()` function
4. **app/page.tsx**: Updated to handle new URL parameter structure

## Mock Data

The implementation includes mock data for testing:

- **Brand**: "brand1" with HasGeolocation: true
- **Branch**: "branch1"
- **Waiter**: "waiter1" with branchId: "branch1"

## Testing

To test the implementation:

1. Navigate to `/?id=brand1&waiter=waiter1` - should fetch waiter, then branch
2. Navigate to `/?id=brand1&branch=branch1` - should fetch branch directly
3. Navigate to `/?id=brand1` - should fetch brand with branches
4. All cases should show RequestLocationDialog since brand1 has HasGeolocation: true
