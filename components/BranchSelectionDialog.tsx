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
import { useLocation } from "@/hooks/useLocation";
import LocationIcon from "./ui/LocationIcon";

interface BranchSelectionDialogProps {
  branches: Branch[];
  open: boolean;
  onBranchSelect: (branch: Branch) => void;
  brandColor?: string;
  brandName?: string;
}

export const BranchSelectionDialog: React.FC<BranchSelectionDialogProps> = ({
  branches,
  open,
  onBranchSelect,
  brandColor = "var(--qik)",
  brandName = "Restaurante",
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [currentView, setCurrentView] = useState<
    "grantPermissions" | "suggestedLocations"
  >("grantPermissions");
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const {
    userLocation,
    isLoadingLocation,
    locationError,
    hasLocationPermission,
    getCurrentLocation,
    findNearestBranch,
    requestLocationPermission,
    clearLocation,
    closestDestination,
  } = useLocation();

  // Initialize nearest branch when branches change
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      // For demo purposes, we'll consider the first branch as the nearest initially
      // This will be updated when we get real location data
      const initialNearest = branches[0];
      setNearestBranch(initialNearest);
      setSelectedBranchId(initialNearest.id);
    }
  }, [branches, selectedBranchId]);

  // Update nearest branch when we get real location data
  useEffect(() => {
    if (closestDestination && branches.length > 0) {
      setNearestBranch(closestDestination);
      if (!selectedBranchId) {
        setSelectedBranchId(closestDestination.id);
      }
    }
  }, [closestDestination, branches, selectedBranchId]);

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  const handleConfirm = () => {
    const selectedBranch = branches.find(
      (branch) => branch.id === selectedBranchId
    );
    if (selectedBranch) {
      onBranchSelect(selectedBranch);
    }
  };

  const handleShowAllBranches = () => {
    setShowAllBranches(true);
  };

  const handleBackToNearest = () => {
    setShowAllBranches(false);
    if (nearestBranch) {
      setSelectedBranchId(nearestBranch.id);
    }
  };

  const handleGrantLocation = async () => {
    setIsCalculatingDistance(true);
    const hasPermission = await requestLocationPermission();

    if (hasPermission) {
      // Find the nearest branch based on real location
      const nearest = await findNearestBranch(branches);
      if (nearest) {
        setNearestBranch(nearest);
        setSelectedBranchId(nearest.id);
      }
      setCurrentView("suggestedLocations");
    } else {
      // If permission denied, show all branches
      setCurrentView("suggestedLocations");
    }
    setIsCalculatingDistance(false);
  };

  const handleDenyLocation = () => {
    clearLocation();
    setCurrentView("suggestedLocations");
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
              {currentView === "grantPermissions"
                ? "Mejora tu experiencia"
                : showAllBranches
                ? "Todas las sucursales disponibles"
                : "Sucursal más cercana"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {currentView === "grantPermissions" ? (
              // Location permission request view
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <h2
                    className="font-bold text-[1.5rem]"
                    style={{ color: `hsl(${brandColor})` }}
                  >
                    Mejora tu experiencia
                  </h2>
                  <p className="text-sky-900">
                    Cuéntanos en qué sucursales te encuentras
                  </p>
                </div>
              </div>
            ) : !showAllBranches && nearestBranch ? (
              // Show nearest branch view
              <div className="space-y-4">
                <div className="space-y-2">
                  <div
                    onClick={() => handleBranchSelect(nearestBranch.id)}
                    className={cn(
                      "flex items-center gap-4 border py-4 px-4 rounded-lg cursor-pointer transition-colors",
                      selectedBranchId === nearestBranch.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {selectedBranchId === nearestBranch.id ? (
                      <IconCircleCheck
                        size={24}
                        strokeWidth={3}
                        style={{ color: `hsl(${brandColor})` }}
                      />
                    ) : (
                      <IconCircle
                        size={24}
                        style={{ color: `hsl(${brandColor})` }}
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <IconMapPin
                          size={16}
                          style={{ color: `hsl(${brandColor})` }}
                        />
                        <h4
                          className="font-semibold text-base"
                          style={{ color: `hsl(${brandColor})` }}
                        >
                          {nearestBranch.payload.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconPinned size={12} className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {nearestBranch.payload.location.address}
                        </p>
                      </div>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ⭐ Sucursal más cercana
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Show all branches view
              <div className="space-y-4">
                <div className="space-y-2">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      onClick={() => handleBranchSelect(branch.id)}
                      className={cn(
                        "flex items-center gap-4 border py-3 px-4 rounded-lg cursor-pointer transition-colors",
                        selectedBranchId === branch.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {selectedBranchId === branch.id ? (
                        <IconCircleCheck
                          size={20}
                          strokeWidth={3}
                          style={{ color: `hsl(${brandColor})` }}
                        />
                      ) : (
                        <IconCircle
                          size={20}
                          style={{ color: `hsl(${brandColor})` }}
                        />
                      )}

                      <div className="flex-1">
                        <h4
                          className="font-semibold text-sm"
                          style={{ color: `hsl(${brandColor})` }}
                        >
                          {branch.payload.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <IconPinned size={12} className="text-gray-400" />
                          <p className="text-xs text-gray-600">
                            {branch.payload.location.address}
                          </p>
                        </div>
                        {branch.id === nearestBranch?.id && (
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
            {currentView === "grantPermissions" ? (
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={handleGrantLocation}
                  className="w-full"
                  disabled={isLoadingLocation || isCalculatingDistance}
                >
                  {isLoadingLocation || isCalculatingDistance
                    ? "Obteniendo ubicación..."
                    : "Compartir ubicación"}
                </Button>
                <Button
                  onClick={handleDenyLocation}
                  className="w-full"
                  variant="secondary"
                >
                  Ver sucursales
                </Button>
              </div>
            ) : (
              currentView === "suggestedLocations" && (
                <>
                  {!showAllBranches ? (
                    <div className="flex flex-col gap-2">
                      {branches.length > 1 && (
                        <Button
                          onClick={handleShowAllBranches}
                          variant="outline"
                          className="w-full"
                          style={{
                            borderColor: `hsl(${brandColor})`,
                            color: `hsl(${brandColor})`,
                          }}
                        >
                          Ver todas las sucursales ({branches.length})
                        </Button>
                      )}
                      <Button
                        onClick={handleConfirm}
                        className="w-full"
                        disabled={!selectedBranchId}
                      >
                        Continuar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleBackToNearest}
                        variant="outline"
                        className="flex-1"
                        style={{
                          borderColor: `hsl(${brandColor})`,
                          color: `hsl(${brandColor})`,
                        }}
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        className="flex-1"
                        disabled={!selectedBranchId}
                      >
                        Continuar
                      </Button>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
