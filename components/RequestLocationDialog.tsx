"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconMapPin, IconEye, IconLoader2 } from "@tabler/icons-react";
import { Branch } from "@/lib/domain/entities";
import Image from "next/image";

interface RequestLocationDialogProps {
  open: boolean;
  onClose: () => void;
  onShareLocation: () => void;
  onViewAllBranches: () => void;
  suggestedBranches?: Branch[];
  onConfirmLocation?: (branch: Branch) => void;
  grantingPermissions?: boolean;
  brandName?: string;
}

export function RequestLocationDialog({
  open,
  onClose,
  onShareLocation,
  onViewAllBranches,
  suggestedBranches = [],
  onConfirmLocation,
  grantingPermissions = false,
  brandName = "nuestro negocio"
}: RequestLocationDialogProps) {
  const [currentState, setCurrentState] = useState<'grantPermissions' | 'suggestedLocations'>('grantPermissions');

  const handleShareLocation = () => {
    setCurrentState('suggestedLocations');
    onShareLocation();
  };

  const handleViewAllBranches = () => {
    onViewAllBranches();
    onClose();
  };

  const handleConfirmLocation = (branch: Branch) => {
    if (onConfirmLocation) {
      onConfirmLocation(branch);
    }
    onClose();
  };

  const handleClose = () => {
    setCurrentState('grantPermissions');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md transition-all ease-in-out duration-100 ${open ? 'h-screen' : 'h-[0px]'}`}>
        <div className="space-y-6 flex flex-col justify-center h-full">
          {currentState === 'grantPermissions' && (
            <>
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
                  onClick={handleShareLocation}
                  disabled={grantingPermissions}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {grantingPermissions ? (
                    <>
                      <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="animate-pulse">QikStarts</span>
                      <span className="ml-2">Obteniendo ubicación...</span>
                    </>
                  ) : (
                    <>
                      <IconMapPin className="w-4 h-4 mr-2" />
                      Compartir ubicación
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleViewAllBranches}
                  variant="outline"
                  className="w-full"
                >
                  <IconEye className="w-4 h-4 mr-2" />
                  Ver todas las sucursales
                </Button>
              </div>
            </>
          )}

          {currentState === 'suggestedLocations' && suggestedBranches.length > 0 && (
            <>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-gray-600 mb-6">
                  Basado en tu ubicación, creemos que esta es la sucursal más cercana:
                </p>
              </div>

              <div className="space-y-3">
                {suggestedBranches.map((branch) => (
                  <Card key={branch.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{branch.payload.name}</h3>
                          <p className="text-sm text-gray-600">{branch.payload.location.address}</p>
                        </div>
                        <Button
                          onClick={() => handleConfirmLocation(branch)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Confirmar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={handleViewAllBranches}
                  variant="outline"
                  className="w-full mt-4"
                >
                  <IconEye className="w-4 h-4 mr-2" />
                  Ver todas las sucursales
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}