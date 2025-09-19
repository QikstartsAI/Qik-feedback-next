"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import Image from "next/image";

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
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Refs para control de debounce y prevención de doble click
  const lastClickTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [hasRequestedLocation, branches, locationPermission, closestDestination, selectedBranchId]);

  // Reset isConfirming when dialog closes
  useEffect(() => {
    if (!open && isConfirming) {
      console.log("Dialog closed, resetting isConfirming");
      setIsConfirming(false);
      isProcessingRef.current = false;
    }
  }, [open, isConfirming]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  const handleBranchDoubleClick = (branch: Branch) => {
    onBranchSelect(branch);
  };

  const handleConfirm = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    // Logging adicional para debugging
    console.log("🔍 [Debug] handleConfirm called", { 
      selectedBranchId, 
      branches: branches.length,
      isConfirming,
      isProcessing: isProcessingRef.current,
      timeSinceLastClick,
      now
    });
    
    // Prevenir múltiples clicks - múltiples capas de protección
    if (isConfirming || isProcessingRef.current) {
      console.log("🚫 [Debug] Click bloqueado - ya procesando");
      return;
    }
    
    // Debounce: prevenir clicks muy rápidos (menos de 500ms)
    if (timeSinceLastClick < 500) {
      console.log("🚫 [Debug] Click bloqueado por debounce");
      return;
    }
    
    // Limpiar timeout anterior si existe
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Establecer flags de protección inmediatamente
    lastClickTimeRef.current = now;
    isProcessingRef.current = true;
    setIsConfirming(true);
    
    try {
      // If no branch is selected, try to select the first one
      let branchToSelect = selectedBranchId;
      if (!branchToSelect && branches.length > 0) {
        branchToSelect = branches[0].id;
        setSelectedBranchId(branchToSelect);
        console.log("🔧 [Debug] Auto-selected first branch:", branchToSelect);
      }
      
      const selectedBranch = branches.find(
        (branch) => branch.id === branchToSelect
      );
      
      console.log("✅ [Debug] selectedBranch found", selectedBranch);
      
      if (selectedBranch) {
        console.log("🚀 [Debug] calling onBranchSelect", selectedBranch);
        if (typeof onBranchSelect === "function") {
          console.log("✅ [Debug] onBranchSelect tiene una acción asociada.");
        } else {
          console.log("❌ [Debug] onBranchSelect NO tiene una acción asociada.");
        }
        
        // Ejecutar la selección
        onBranchSelect(selectedBranch);
        console.log("✅ [Debug] onBranchSelect called successfully", selectedBranch);
        
        // Resetear flags después de un pequeño delay para permitir que la navegación se complete
        debounceTimeoutRef.current = setTimeout(() => {
          console.log("🔄 [Debug] Resetting processing flags after navigation");
          isProcessingRef.current = false;
          // No resetear isConfirming aquí - se maneja cuando el diálogo se cierra
        }, 100);
        
      } else {
        console.error("❌ [Debug] No selected branch found", { selectedBranchId: branchToSelect, branches });
        // Resetear flags en caso de error
        isProcessingRef.current = false;
        setIsConfirming(false);
      }
    } catch (error) {
      console.error("❌ [Debug] Error selecting branch:", error);
      // Resetear flags en caso de error
      isProcessingRef.current = false;
      setIsConfirming(false);
    }
  }, [selectedBranchId, branches, onBranchSelect, isConfirming]);

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

  // Debug logging para entender el problema de renderizado
  console.log("🔍 [Dialog Render] BranchSelectionDialog render check", { 
    open, 
    branches: branches.length,
    selectedBranchId,
    currentView,
    isConfirming,
    isProcessing: isProcessingRef.current
  });

  if (!open) {
    console.log("🚫 [Dialog Render] Dialog not open, returning null");
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-white z-50 transition-all ease-in-out duration-100 ${open ? 'h-screen' : 'h-[0px]'}`}>
      <div className="h-full flex flex-col">
        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
          <div className="max-w-md w-full">
            {currentView === "permissions" ? (
              // PANTALLA 1: Solicitar permisos de ubicación
              <div className="space-y-6 flex flex-col justify-center h-full">
                <div className="text-center">
                  <div className="mb-6 animate-bounce delay-100 w-[150px] h-[150px] mx-auto">
                    <Image
                      src="/location-blue.svg"
                      alt="Location pin"
                      width={150}
                      height={150}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-gray-600 mb-8 text-lg">
                    Para brindarte la mejor experiencia, nos gustaría conocer tu ubicación y mostrarte la sucursal más cercana.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleGrantLocation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={grantingPermissions}
                  >
                    {grantingPermissions ? (
                      <>
                        <span className="animate-pulse">QikStarts</span>
                        <span className="ml-2">Obteniendo ubicación...</span>
                      </>
                    ) : (
                      "Compartir ubicación"
                    )}
                  </Button>
                  <Button
                    onClick={handleDenyLocation}
                    variant="outline"
                    className="w-full"
                  >
                    Ver todas las sucursales
                  </Button>
                </div>
              </div>
            ) : (
              // PANTALLA 2: Selección de sucursales
              <div className="space-y-3 w-full">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-500">
                    Selecciona una sucursal o haz doble click para continuar
                  </p>
                </div>
                
                {/* Mostrar sucursal más cercana primero si hay geolocalización */}
                {locationPermission && closestDestination && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-800 mb-2">
                      🌟 Sucursal más cercana
                    </h3>
                    <div
                      onClick={() => handleBranchSelect(closestDestination.id)}
                      onDoubleClick={() => handleBranchDoubleClick(closestDestination)}
                      className={cn(
                        "flex items-center gap-3 border-2 py-3 px-3 rounded-lg cursor-pointer transition-colors bg-white",
                        selectedBranchId === closestDestination.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      )}
                    >
                      {selectedBranchId === closestDestination.id ? (
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
                        <div className="flex items-center gap-2 mb-1">
                          <IconMapPin
                            size={14}
                            className="text-gray-600"
                          />
                          <h4 className="font-semibold text-sm text-gray-800">
                            {closestDestination.payload.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconPinned size={10} className="text-gray-500" />
                          <p className="text-xs text-gray-700 font-medium">
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
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-800 mb-2">
                    📍 Todas las sucursales
                  </h3>
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      onClick={() => handleBranchSelect(branch.id)}
                      onDoubleClick={() => handleBranchDoubleClick(branch)}
                      className={cn(
                        "flex items-center gap-3 border-2 py-2 px-3 rounded-lg cursor-pointer transition-colors bg-white",
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
                        <h4 className="font-semibold text-xs text-gray-800">
                          {branch.payload.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <IconPinned size={10} className="text-gray-500" />
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

        {/* Fixed Bottom Buttons - Solo para selección de sucursales */}
        {currentView === "selection" && (
          <div className="border-t bg-white p-4 flex items-center justify-center">
            <div className="max-w-md w-full">
              <Button
                onClick={handleConfirm}
                className="w-full"
                disabled={branches.length === 0 || isConfirming || isProcessingRef.current}
              >
                {isConfirming || isProcessingRef.current ? "Continuando..." : "Continuar"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
