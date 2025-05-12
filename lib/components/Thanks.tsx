import { cn } from "./../lib/utils";
import { ClockIcon, CalendarIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Props {
  businessName: string;
  customerName: string;
  brandColor?: string;
}

function Thanks({ businessName, customerName, brandColor }: Props) {
  const { t } = useTranslation("common");
  const date = new Date();
  const currentDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      className={cn(
        "w-full h-[calc(100vh-198px)] items-center flex flex-col justify-center shadow z-10 gap-4"
      )}
      style={{ backgroundColor: brandColor ? brandColor : "#058FFF" }}
    >
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-white font-medium text-2xl text-center">
            {t("thanks.name.label")}
          </h3>
          <p className="text-white font-medium text-base text-center">
            {customerName}
          </p>
        </div>
        <div>
          <h3 className="text-white font-medium text-2xl text-center">
            {t("thanks.business.label")}
          </h3>
          <p className="text-white font-medium text-base text-center">
            {businessName}
          </p>
        </div>
        <div className="flex flex-row justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center gap-1">
            <CalendarIcon className="text-white h-5 w-5" />
            <span className="text-white font-medium">{currentDate}</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <ClockIcon className="text-white h-5 w-5" />
            <span className="text-white font-medium">{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thanks;
