"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeolocationNew } from "@/hooks/useGeolocationNew";
import { Business } from "@/lib/domain/entities";

// Mock business data for testing
const mockBusiness: Business = {
  HasGeolocation: true,
  sucursales: [
    {
      id: "branch-1",
      brandId: "brand-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      payload: {
        logoImgURL: "/placeholder-logo.png",
        coverImgURL: "/restaurant-bg.jpg",
        name: "Restaurante Test",
        category: "Restaurante",
        location: {
          address: "Calle Test #123",
          countryCode: "CO",
          geopoint: { lat: 2.9273, lon: -75.2819 },
          googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
        },
      },
    },
  ],
};

export default function TestSimplePage() {
  const [businessId, setBusinessId] = useState("hooters");
  const [isClient, setIsClient] = useState(false);
  
  const {
    locationPermission,
    originPosition,
    closestDestination,
    requestLocation,
    grantingPermissions,
    distanceLoading,
    enableGeolocation,
    availableBranches,
    getLocation,
    setRequestLocation,
  } = useGeolocationNew(businessId, mockBusiness);

  // Ensure client-side rendering for geolocation
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Cargando...</div>
          <div className="text-gray-600">Inicializando geolocalización</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test de Geolocalización Simple</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Business ID:
              </label>
              <select 
                value={businessId} 
                onChange={(e) => setBusinessId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="hooters">Hooters (habilitado)</option>
                <option value="yogurt-amazonas">Yogurt Amazonas (habilitado)</option>
                <option value="other">Otro (no habilitado)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Estado:</h3>
                <ul className="text-sm space-y-1">
                  <li>Geolocalización habilitada: {enableGeolocation ? "Sí" : "No"}</li>
                  <li>Permiso de ubicación: {locationPermission ? "Sí" : "No"}</li>
                  <li>Solicitando ubicación: {requestLocation ? "Sí" : "No"}</li>
                  <li>Otorgando permisos: {grantingPermissions ? "Sí" : "No"}</li>
                  <li>Cargando distancias: {distanceLoading ? "Sí" : "No"}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Ubicación:</h3>
                <ul className="text-sm space-y-1">
                  <li>Latitud: {originPosition.latitude || "No disponible"}</li>
                  <li>Longitud: {originPosition.longitude || "No disponible"}</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Sucursales Disponibles:</h3>
              <div className="space-y-2">
                {availableBranches.filter(branch => branch && branch.payload).map((branch) => (
                  <div key={branch.id} className="p-2 bg-gray-100 rounded">
                    <div className="font-medium">{branch.payload.name}</div>
                    <div className="text-sm text-gray-600">{branch.payload.location.address}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Sucursal Más Cercana:</h3>
              {closestDestination && closestDestination.payload ? (
                <div className="p-2 bg-green-100 rounded">
                  <div className="font-medium">{closestDestination.payload.name}</div>
                  <div className="text-sm text-gray-600">{closestDestination.payload.location.address}</div>
                </div>
              ) : (
                <div className="text-gray-500">No disponible</div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={getLocation} disabled={grantingPermissions}>
                {grantingPermissions ? "Obteniendo ubicación..." : "Obtener Ubicación"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRequestLocation(!requestLocation)}
              >
                Toggle Request Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
