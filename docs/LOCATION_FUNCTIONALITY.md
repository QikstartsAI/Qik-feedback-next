# Location Functionality in BranchSelectionDialog

This document describes the location-based branch selection functionality that has been integrated into the `BranchSelectionDialog` component, based on the location logic from `RequestLocationDialog`.

## Overview

The `BranchSelectionDialog` now includes real location detection and distance calculation to determine the actual nearest branch based on the user's current location, rather than just showing the first branch as the "nearest".

## Key Components

### 1. useLocation Hook (`hooks/useLocation.ts`)

A custom hook that combines geolocation functionality with distance matrix calculation:

**Features:**

- Requests user location permission using `navigator.geolocation`
- Handles location permission states (granted, denied, unavailable)
- Integrates with `useDistanceMatrix` for real distance calculations
- Provides fallback behavior when location is unavailable

**Key Methods:**

- `getCurrentLocation()`: Requests and retrieves user's current position
- `findNearestBranch(branches)`: Calculates the nearest branch using Mapbox API
- `requestLocationPermission()`: Handles the permission request flow
- `clearLocation()`: Resets location data

### 2. useDistanceMatrix Hook (`hooks/useDistanceMatrix.tsx`)

Uses Mapbox Matrix API to calculate real driving distances between user location and branch locations.

**Features:**

- Calculates driving distances (not just straight-line distance)
- Handles multiple destinations efficiently
- Returns the closest branch based on actual travel distance
- Uses Mapbox API with proper error handling

### 3. Updated BranchSelectionDialog

The dialog now has two main views:

#### Grant Permissions View

- Requests location permission from the user
- Shows location icon and explanatory text
- Two options: "Compartir ubicación" (Share Location) or "Ver sucursales" (View Branches)

#### Suggested Locations View

- Shows the nearest branch (calculated based on real location)
- Option to view all branches
- Displays distance information when available

## Implementation Details

### Location Permission Flow

1. **Initial State**: Dialog opens in "grantPermissions" view
2. **User Action**: User clicks "Compartir ubicación"
3. **Permission Request**: Browser requests location permission
4. **Success**: Location obtained, distance calculation triggered
5. **Fallback**: If permission denied, shows all branches

### Distance Calculation Process

1. **User Location**: Obtained via `navigator.geolocation.getCurrentPosition()`
2. **Branch Coordinates**: Extracted from branch `payload.location.geopoint`
3. **Mapbox API Call**: Matrix service calculates driving distances
4. **Nearest Branch**: Branch with minimum distance is selected
5. **UI Update**: Dialog shows the actual nearest branch

### Error Handling

- **Geolocation Unsupported**: Shows all branches
- **Permission Denied**: Shows all branches with option to retry
- **Location Unavailable**: Shows all branches
- **API Errors**: Falls back to first branch
- **Network Issues**: Graceful degradation

## Usage Example

```tsx
import { BranchSelectionDialog } from "@/components/BranchSelectionDialog";
import { useLocation } from "@/hooks/useLocation";

const MyComponent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setShowDialog(false);
  };

  return (
    <BranchSelectionDialog
      branches={branches}
      open={showDialog}
      onBranchSelect={handleBranchSelect}
      brandColor="220, 100%, 50%"
      brandName="My Restaurant"
    />
  );
};
```

## Configuration

### Environment Variables

The distance calculation requires a Mapbox API key:

```env
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key_here
```

### Branch Data Structure

Branches must have proper location data:

```typescript
interface Branch {
  id: string;
  payload: {
    name: string;
    location: {
      address: string;
      countryCode: string;
      geopoint: {
        lat: number;
        lon: number;
      };
      googleMapURL: string;
    };
  };
}
```

## Benefits

1. **Real Accuracy**: Shows actual nearest branch based on driving distance
2. **Better UX**: Users see the most relevant branch first
3. **Fallback Support**: Works even when location is unavailable
4. **Permission Respect**: Handles location permission gracefully
5. **Performance**: Efficient distance calculation using Mapbox API

## Testing

### Test Cases

1. **Location Permission Granted**: Should show nearest branch
2. **Location Permission Denied**: Should show all branches
3. **No Geolocation Support**: Should show all branches
4. **Network Issues**: Should fallback gracefully
5. **Multiple Branches**: Should calculate distances correctly

### Example Component

See `components/examples/UseLocationHookExample.tsx` for a working example.

## Migration from RequestLocationDialog

The location logic has been successfully integrated from `RequestLocationDialog` into `BranchSelectionDialog`:

- **Location Permission Flow**: Maintained the same user experience
- **Distance Calculation**: Uses the same Mapbox integration
- **Error Handling**: Preserved all error states and fallbacks
- **UI Consistency**: Maintains the same visual design patterns

## Future Enhancements

1. **Caching**: Cache location data to avoid repeated API calls
2. **Offline Support**: Store last known location for offline use
3. **Distance Display**: Show actual distance in kilometers/miles
4. **Travel Time**: Include travel time estimates
5. **Multiple Transport Modes**: Support walking, cycling, public transport
