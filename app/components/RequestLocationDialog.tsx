import React, { useEffect, useState } from "react";

import { cn } from "../lib/utils";
import { Button } from "./ui/Button";

import Image from "next/image";
import { Branch } from "../types/business";
import { IconCircle, IconCircleCheck, IconPinned } from "@tabler/icons-react";
import Loader from "./Loader";
const RequestLocationDialog = ({
  view = "grantPermissions",
  branches = [],
  open = false,
  grantingPermissions = false,
  variant,
  getLocation,
  denyLocation,
  onConfirm,
}: {
  branches?: (Branch | undefined)[];
  open?: boolean;
  view?: string;
  variant?: "hooters" | "gus" | "delcampo";
  grantingPermissions?: boolean;
  getLocation: () => void;
  denyLocation: () => void;
  onConfirm: (branch: Branch | undefined) => void;
}) => {
  const [currentView, setCurrentView] = React.useState("grantPermissions");

  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  const goToSuggestedView = () => {
    setCurrentView("suggestedLocations");
  };

  const handleOnDeny = () => {
    denyLocation();
    goToSuggestedView();
  };

  const handleOnGrant = async () => {
    getLocation();
    goToSuggestedView();
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 h-[0px] w-screen flex flex-col justify-between items-center gap-10 bg-white transition-all ease-in-out duration-100  overflow-hidden",
        { "h-screen": open },
        { "p-10": open }
      )}
    >
      {currentView == "grantPermissions" && (
        <>
          <div className="grow"></div>

          <Image
            src={variant ? `/location-${variant}.svg` : "/location.svg"}
            alt={"Permisos de ubicación"}
            className="animate-bounce delay-100"
            width={120}
            height={120}
          />

          <div className="flex flex-col items-center gap-3">
            <h2
              className={`font-bold text-[1.5rem] text-center text-${
                variant ?? "qik"
              }`}
            >
              Mejora tu experiencia
            </h2>
            <p className="text-center text-sky-900">
              Cuéntanos en qué sucursales te encuentras
            </p>
          </div>
          <div className="grow"></div>
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={handleOnGrant}
              className="w-full"
              type="button"
              variant={variant ? `${variant}Primary` : "default"}
            >
              Compartir ubicación
            </Button>
            <Button
              onClick={handleOnDeny}
              className="w-full"
              type="button"
              variant={variant ? `${variant}Secondary` : "secondary"}
            >
              Ver sucursales
            </Button>
          </div>
        </>
      )}
      {currentView == "suggestedLocations" && (
        <SuggestedLocations
          branches={branches}
          onConfirm={onConfirm}
          handleOnDeny={handleOnDeny}
          grantingPermissions={grantingPermissions}
          variant={variant}
        />
      )}
    </div>
  );
};

const SuggestedLocations = ({
  branches,
  onConfirm,
  handleOnDeny,
  grantingPermissions,
  variant,
}: {
  onConfirm: (branch: Branch | undefined) => void;
  handleOnDeny: () => void;
  branches: (Branch | undefined)[];
  grantingPermissions: boolean;
  variant?: "hooters" | "gus" | "delcampo";
}) => {
  const getNormalizedBusinessName = (name: string | undefined) => {
    if (!name) {
      return "";
    }
    return name.toLocaleLowerCase().split(" ").join("-");
  };

  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    if (branches.length == 0) return;
    setSelected(getNormalizedBusinessName(branches[0]?.Name));
  }, [branches]);

  const handleClickSelected = (branchName: string | undefined) => {
    setSelected(getNormalizedBusinessName(branchName));
  };
  return (
    <div className="flex flex-col w-full h-full justify-between items-center ">
      <div className="grow"></div>
      <div className="flex flex-col items-center gap-3">
        <Image
          src={variant ? `/location-${variant}.svg` : "/location.svg"}
          alt={"Permisos de ubicación"}
          className="animate-bounce delay-100"
          width={120}
          height={120}
        />
        {grantingPermissions ? (
          <>
            <h2
              className={`font-bold text-[1.5rem] text-center text-${
                variant ?? "qik"
              }`}
            >
              Para mejorar tu experiencia
            </h2>
            <p className="text-center text-sky-900 mb-3">
              Comparte tu ubicación
            </p>
          </>
        ) : (
          <>
            <h2
              className={`font-bold text-[1.5rem] text-center text-${
                variant ?? "qik"
              }`}
            >
              ¿Dónde te encuentras?
            </h2>
            <p className="text-center text-sky-900 mb-3">
              Selecciona en qué sucursal estás
            </p>
          </>
        )}
      </div>
      <div className="grow"></div>

      <div className="flex flex-col gap-3 w-full overflow-y-auto">
        {grantingPermissions && (
          <div className="grid place-items-center h-[50vh]">
            <Image
              src="/qik.svg"
              className="w-40 sm:w-44 animate-pulse"
              alt="QikStarts"
              width={155}
              height={62}
              priority={true}
            />
          </div>
        )}
        {!grantingPermissions &&
          (branches.length == 0 || branches[0] == undefined ? (
            <div>
              <h3
                className={`text-[1.5rem] text-center text-${variant ?? "qik"}`}
              >
                No tienes sucursales cerca
              </h3>
              <Button
                onClick={handleOnDeny}
                className="w-full"
                type="button"
                variant={variant ? `${variant}Primary` : "default"}
              >
                Ver todas las sucursales
              </Button>
            </div>
          ) : (
            <>
              {branches.map((branch, idx) => {
                return (
                  <div
                    onClick={() => handleClickSelected(branch?.Name)}
                    className="flex items-center gap-4 border py-2 px-3 rounded-lg cursor-pointer focus:ring"
                    key={idx}
                  >
                    {selected ==
                    getNormalizedBusinessName(branch?.Name ?? "") ? (
                      <span>
                        <IconCircleCheck
                          size={18}
                          strokeWidth={3}
                          className={variant ? `text-${variant}` : ""}
                        />
                      </span>
                    ) : (
                      <span>
                        <IconCircle
                          size={18}
                          className={variant ? `text-${variant}` : ""}
                        />
                      </span>
                    )}
                    <div className="flex flex-col">
                      <h4
                        className={`text-[1rem] font-bold text-${
                          variant ?? "qik"
                        }`}
                      >
                        {branch?.Name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span>
                          <IconPinned size={10} />
                        </span>
                        <p className="text-sky-900 text-[0.7rem] font-light">
                          {branch?.Address}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ))}
      </div>
      {!grantingPermissions &&
        !(branches.length == 0 || branches[0] == undefined) && (
          <div className="flex flex-col gap-3 w-full mt-10">
            <Button
              onClick={() =>
                onConfirm(
                  branches.find(
                    (branch) =>
                      getNormalizedBusinessName(branch?.Name) === selected
                  )
                )
              }
              className="w-full"
              disabled={grantingPermissions}
              type="button"
              variant={variant ? `${variant}Primary` : "default"}
            >
              {grantingPermissions ? "Esperando permisos..." : "¡Aquí estoy!"}
            </Button>
          </div>
        )}
    </div>
  );
};

export default RequestLocationDialog;
