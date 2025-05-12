import React, { useEffect, useState } from "react";

import { Branch } from "@/lib/types/business";
import { IconCircle, IconCircleCheck, IconPinned } from "@tabler/icons-react";
import { useLocation } from "@/lib/layers/hooks/useLocation";
import { useTranslation } from "react-i18next";

import useGetBusinessData from "@/lib/hooks/useGetBusinessData";
import LocationIcon from "@/lib/components/ui/LocationIcon";
import { cn } from "../lib/utils";

export default function RequestLocationDialog({
  isHootersForm = false,
}: {
  isHootersForm?: boolean;
}) {
  const { t } = useTranslation("common");
  const { business, setSucursalId } = useGetBusinessData();

  const brandColor = business?.BrandColor;

  const {
    requestLocation: open,
    denyLocation,
    getLocation,
    onLocationSelect,
    branches,
    loading,
  } = useLocation(business, setSucursalId);

  const [currentView, setCurrentView] = React.useState("grantPermissions");

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
        "fixed bottom-0 top-0 h-[0px] w-screen flex flex-col justify-between items-center gap-10 bg-white transition-all ease-in-out duration-100  overflow-hidden",
        { "h-screen": open },
        { "p-10": open }
      )}
    >
      {currentView == "grantPermissions" && (
        <>
          <div className="grow"></div>

          <LocationIcon color={brandColor} />

          <div className="flex flex-col items-center gap-3">
            <h2
              className={cn("font-bold text-[1.5rem] text-center")}
              style={{
                color: brandColor ? brandColor : "#058FFF",
              }}
            >
              {t("locationDialog.improveExperience")}
            </h2>
            <p className="text-center text-sky-900">
              {t("locationDialog.tellUsLocation")}
            </p>
          </div>
          <div className="grow"></div>
          <div className="flex flex-col gap-3 w-full">
            <button
              className="h-12 px-5 py-2 focus:ring focus:ring-blue-200 text-white rounded-full"
              style={{
                backgroundColor: business?.BrandColor
                  ? business?.BrandColor
                  : "#058FFF",
              }}
              onClick={handleOnGrant}
            >
              {t("locationDialog.shareLocation")}
            </button>

            <button
              className="h-12 border border-gray-300 px-5 py-2 text-gray-900 hover:bg-gray-300 focus:ring focus:ring-blue-200 rounded-full bg-gray-100"
              onClick={handleOnDeny}
            >
              {t("locationDialog.seeBranches")}
            </button>
          </div>
        </>
      )}
      {currentView == "suggestedLocations" && (
        <SuggestedLocations
          branches={branches}
          onConfirm={onLocationSelect}
          handleOnDeny={handleOnDeny}
          grantingPermissions={loading}
          isHootersForm={isHootersForm}
          brandColor={brandColor}
        />
      )}
    </div>
  );
}

const SuggestedLocations = ({
  branches,
  onConfirm,
  handleOnDeny,
  grantingPermissions,
  isHootersForm,
  brandColor,
}: {
  onConfirm: (branch: Branch | undefined) => void;
  handleOnDeny: () => void;
  branches: (Branch | undefined)[];
  grantingPermissions: boolean;
  isHootersForm: boolean;
  brandColor?: string;
}) => {
  const { t } = useTranslation("common");

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

  console.log("brandColor:::", brandColor);

  return (
    <div className="flex flex-col w-full h-full justify-between items-center ">
      <div className="grow"></div>
      <div className="flex flex-col items-center gap-3">
        <LocationIcon color={brandColor} />
        {grantingPermissions ? (
          <>
            <h2
              className={cn("font-bold text-[1.5rem] text-center")}
              style={{
                color: brandColor ? brandColor : "#058FFF",
              }}
            >
              {t("locationDialog.improveExperience")}
            </h2>
            <p className="text-center text-sky-900 mb-3">
              {t("locationDialog.shareLocation")}
            </p>
          </>
        ) : (
          <>
            <h2
              className={cn("font-bold text-[1.5rem] text-center")}
              style={{
                color: brandColor ? brandColor : "#058FFF",
              }}
            >
              {t("locationDialog.whereAreYou")}
            </h2>
            <p className="text-center text-sky-900 mb-3">
              {t("locationDialog.selectBranch")}
            </p>
          </>
        )}
      </div>
      <div className="grow"></div>

      <div className="flex flex-col gap-3 w-full overflow-y-auto">
        {grantingPermissions && <LocationIcon color={brandColor} />}
        {!grantingPermissions &&
          (branches.length == 0 || branches[0] == undefined ? (
            <div>
              <h3
                className={cn("text-[1.5rem] text-center")}
                style={{
                  color: brandColor ? brandColor : "#058FFF",
                }}
              >
                {t("locationDialog.noBranchesNearby")}
              </h3>
              <button
                className="w-full h-12 px-5 py-2 mt-5 focus:ring focus:ring-blue-200 text-white rounded-full"
                disabled={grantingPermissions}
                style={{
                  backgroundColor: brandColor ? brandColor : "#058FFF",
                }}
                onClick={handleOnDeny}
              >
                {t("locationDialog.seeAllBranches")}
              </button>
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
                          style={{
                            color: brandColor ? brandColor : "#058FFF",
                          }}
                        />
                      </span>
                    ) : (
                      <span>
                        <IconCircle
                          size={18}
                          style={{
                            color: brandColor ? brandColor : "#058FFF",
                          }}
                        />
                      </span>
                    )}
                    <div className="flex flex-col">
                      <h4
                        className={cn("text-[1rem] font-bold")}
                        style={{
                          color: brandColor ? brandColor : "#058FFF",
                        }}
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
          <button
            className="w-full h-12 px-5 py-2 mt-5 focus:ring focus:ring-blue-200 text-white rounded-full"
            disabled={grantingPermissions}
            style={{
              backgroundColor: brandColor ? brandColor : "#058FFF",
            }}
            onClick={() =>
              onConfirm(
                branches.find(
                  (branch) =>
                    getNormalizedBusinessName(branch?.Name) === selected
                )
              )
            }
          >
            {grantingPermissions
              ? t("locationDialog.waitingPermissions")
              : t("locationDialog.imHere")}
          </button>
        )}
    </div>
  );
};
