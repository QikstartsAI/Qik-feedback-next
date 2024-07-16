/* eslint-disable @next/next/no-img-element */
import { Business } from "@/app/types/business";
import { Button } from "./ui/Button";
import { IconChevronsDown, IconMapPin, IconMap } from "@tabler/icons-react";
import ImageRounded from "./ui/ImageRounded";
import Banner from "./Banner";
import Image from "next/image";
import { useGetCurrentBusinessByIdImmutable } from "@/app/hooks/services/businesses";
import { useGetWaiterByBusinessOrSucursalImmutable } from "@/app/hooks/services/waiters";
import { useTranslation } from "react-i18next";
import { useFormStore } from "@/app/stores/form";

function Hero() {
  const { t } = useTranslation("hero");
  const { business, showBusinessSelector, setShowBusinessSelector } =
    useFormStore();

  const { data: waiter } = useGetWaiterByBusinessOrSucursalImmutable();

  const handleScrollToForm = () => {
    const form = document.getElementById("form");
    form?.scrollIntoView({ behavior: "smooth" });
  };

  if (!business) return <></>;

  return (
    <div className="relative">
      <img
        src={business?.Cover || ""}
        className="absolute inset-0 object-cover w-full h-full animate-in"
        alt="cover del negocio"
        width={1914}
        height={548}
      />
      <div className="relative h-screen bg-gray-900 bg-opacity-75">
        <div className="px-6 md:px-12 h-screen flex flex-col items-center justify-center space-y-4 lg:space-y-6">
          <>
            <Banner
              className="fixed top-0"
              businessCountry={business?.Country || "EC"}
            />
            <div className="flex flex-col items-center space-y-4 lg:space-y-6">
              <img
                src="/googleqik.webp"
                alt="logo google"
                className="w-32 sm:w-40"
                width={1584}
                height={958}
              />
              <img
                src={business?.Icono || ""}
                className="w-32 lg:w-40 animate-in"
                alt={business?.Name || "Icono del negocio"}
                width={160}
                height={90}
                loading="eager"
              />
              <h2 className="font-sans text-2xl sm:text-3xl text-center font-bold tracking-tight text-white sm:leading-none">
                {business?.Name}
              </h2>
            </div>
            <div className="flex flex-col items-center text-white/80 space-y-2 sm:space-y-3 max-w-lg">
              <p className="max-w-xl text-center text-xs sm:text-base">
                <IconMapPin className="w-4 h-4  sm:w-6 sm:h-6 inline-block" />{" "}
                {business?.Address}
              </p>
            </div>
            <p className="text-center text-base text-white/90 sm:text-lg pb-2 font-bold">
              {t(`ratingTitle`)} <br /> {t(`excellenceSubtitle`)}
            </p>
            {waiter && (
              <div className="flex flex-col justify-center items-center my-2">
                {waiter?.gender === "masculino" ||
                waiter?.gender === "male" ||
                waiter?.gender === "mâle" ? (
                  <ImageRounded
                    imageUrl="/waiter_male.gif"
                    imageAlt="Icono de mesero"
                  />
                ) : (
                  <ImageRounded
                    imageUrl="/waiter_female.gif"
                    imageAlt="Icono de mesera"
                  />
                )}
                <p className="text-center text-sm text-white/90 sm:text-lg pb-1 font-medium">
                  {t(`attendTitle`)}
                </p>
                <p className="text-center text-base text-white/90 sm:text-lg pb-1 font-semibold">
                  {waiter?.name}
                </p>
              </div>
            )}
            <Button variant="secondary" onClick={handleScrollToForm}>
              {t(`startButton`)}{" "}
              <IconChevronsDown className="w-4 h-4 ml-2 animate-bounce" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowBusinessSelector(true)}
            >
              <IconMap />
            </Button>
          </>
        </div>
      </div>
    </div>
  );
}

export default Hero;
