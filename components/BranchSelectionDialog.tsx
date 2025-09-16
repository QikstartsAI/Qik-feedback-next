"use client";

import React, { useState, useEffect } from "react";
import { Branch } from "@/lib/domain/entities";
import { Button } from "@/components/ui/button";
import {
  IconCircle,
  IconCircleCheck,
  IconPinned,
  IconMapPin,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
// import { useLocation } from "@/hooks/useLocation"; // Removed - using props instead
import LocationIcon from "./ui/LocationIcon";

interface BranchSelectionDialogProps {
  branches: Branch[];
  open: boolean;
  onBranchSelect: (branch: Branch) => void;
  brandColor?: string;
  brandName?: string;
  // Geolocation props
  locationPermission?: boolean;
  originPosition?: { latitude: number | null; longitude: number | null };
  closestDestination?: Branch | null;
  onGetLocation?: () => void;
  onDenyLocation?: () => void;
  grantingPermissions?: boolean;
}

export const BranchSelectionDialog: React.FC<BranchSelectionDialogProps> = ({
  branches,
  open,
  onBranchSelect,
  brandColor = "var(--qik)",
  brandName = "Restaurante",
  // Geolocation props
  locationPermission = false,
  originPosition = { latitude: null, longitude: null },
  closestDestination = null,
  onGetLocation,
  onDenyLocation,
  grantingPermissions = false,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"permissions" | "selection">("permissions");
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  // Initialize selected branch when branches change
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      // If we have geolocation and closest destination, select it first
      if (locationPermission && closestDestination) {
        setSelectedBranchId(closestDestination.id);
      } else {
        // Otherwise, select the first branch
        setSelectedBranchId(branches[0].id);
      }
    }
  }, [branches, selectedBranchId, locationPermission, closestDestination]);

  // Ensure a branch is always selected when in selection view
  useEffect(() => {
    if (currentView === "selection" && branches.length > 0 && !selectedBranchId) {
      if (locationPermission && closestDestination) {
        setSelectedBranchId(closestDestination.id);
      } else {
        setSelectedBranchId(branches[0].id);
      }
    }
  }, [currentView, branches, selectedBranchId, locationPermission, closestDestination]);

  // Move to selection view when location permission is granted or denied
  useEffect(() => {
    if (hasRequestedLocation) {
      setCurrentView("selection");
      // Ensure we have a selected branch when moving to selection view
      if (branches.length > 0 && !selectedBranchId) {
        if (locationPermission && closestDestination) {
          setSelectedBranchId(closestDestination.id);
        } else {
          setSelectedBranchId(branches[0].id);
        }
      }
    }
  }, [hasRequestedLocation, branches, selectedBranchId, locationPermission, closestDestination]);

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  const handleBranchDoubleClick = (branch: Branch) => {
    onBranchSelect(branch);
  };

  const handleConfirm = () => {
    const selectedBranch = branches.find(
      (branch) => branch.id === selectedBranchId
    );
    if (selectedBranch) {
      onBranchSelect(selectedBranch);
    }
  };

  const handleGrantLocation = async () => {
    setHasRequestedLocation(true);
    if (onGetLocation) {
      onGetLocation();
    }
  };

  const handleDenyLocation = () => {
    setHasRequestedLocation(true);
    if (onDenyLocation) {
      onDenyLocation();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: `hsl(${brandColor})` }}
            >
              {brandName}
            </h1>
            <p className="text-sm text-gray-600">
              {currentView === "permissions"
                ? "Mejora tu experiencia"
                : "Selecciona tu sucursal"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {currentView === "permissions" ? (
              // PANTALLA 1: Solicitar permisos de ubicación
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">📍</div>
                  <h2
                    className="font-bold text-[1.5rem]"
                    style={{ color: `hsl(${brandColor})` }}
                  >
                    Mejora tu experiencia
                  </h2>
                  <p className="text-gray-600 text-base">
                    Para brindarte la mejor experiencia, nos gustaría conocer tu ubicación y mostrarte la sucursal más cercana.
                  </p>
                </div>
              </div>
            ) : (
              // PANTALLA 2: Selección de sucursales
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">
                    Selecciona una sucursal o haz doble click para continuar
                  </p>
                </div>
                
                {/* Mostrar sucursal más cercana primero si hay geolocalización */}
                {locationPermission && closestDestination && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">
                      🌟 Sucursal más cercana
                    </h3>
                    <div
                      onClick={() => handleBranchSelect(closestDestination.id)}
                      onDoubleClick={() => handleBranchDoubleClick(closestDestination)}
                      className={cn(
                        "flex items-center gap-4 border-2 py-4 px-4 rounded-lg cursor-pointer transition-colors bg-white",
                        selectedBranchId === closestDestination.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      )}
                    >
                      {selectedBranchId === closestDestination.id ? (
                        <IconCircleCheck
                          size={24}
                          strokeWidth={3}
                          className="text-blue-600"
                        />
                      ) : (
                        <IconCircle
                          size={24}
                          className="text-gray-600"
                        />
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <IconMapPin
                            size={16}
                            className="text-gray-600"
                          />
                          <h4 className="font-semibold text-base text-gray-800">
                            {closestDestination.payload.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconPinned size={12} className="text-gray-500" />
                          <p className="text-sm text-gray-700 font-medium">
                            {closestDestination.payload.location.address}
                          </p>
                        </div>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          ⭐ Sucursal más cercana
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mostrar todas las sucursales */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">
                    📍 Todas las sucursales
                  </h3>
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      onClick={() => handleBranchSelect(branch.id)}
                      onDoubleClick={() => handleBranchDoubleClick(branch)}
                      className={cn(
                        "flex items-center gap-4 border-2 py-3 px-4 rounded-lg cursor-pointer transition-colors bg-white",
                        selectedBranchId === branch.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      )}
                    >
                      {selectedBranchId === branch.id ? (
                        <IconCircleCheck
                          size={20}
                          strokeWidth={3}
                          className="text-blue-600"
                        />
                      ) : (
                        <IconCircle
                          size={20}
                          className="text-gray-600"
                        />
                      )}

                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800">
                          {branch.payload.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <IconPinned size={12} className="text-gray-500" />
                          <p className="text-xs text-gray-700 font-medium">
                            {branch.payload.location.address}
                          </p>
                        </div>
                        {branch.id === closestDestination?.id && (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            ⭐ Más cercana
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="border-t bg-white p-4">
          <div className="max-w-md mx-auto">
            {currentView === "permissions" ? (
              // PANTALLA 1: Botones para permisos
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={handleGrantLocation}
                  className="w-full"
                  disabled={grantingPermissions}
                >
                  {grantingPermissions
                    ? "Obteniendo ubicación..."
                    : "Compartir ubicación"}
                </Button>
                <Button
                  onClick={handleDenyLocation}
                  className="w-full"
                  variant="secondary"
                >
                  Ver todas las sucursales
                </Button>
              </div>
            ) : (
              // PANTALLA 2: Botón para confirmar selección
              <Button
                onClick={handleConfirm}
                className="w-full"
                disabled={!selectedBranchId}
              >
                Continuar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
