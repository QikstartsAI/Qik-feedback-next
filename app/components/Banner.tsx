import { cn } from "@/app/lib/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Props {
  className: string;
  businessCountry: string;
}

function Banner({ className, businessCountry }: Props) {
  const { t } = useTranslation("hero");
  return (
    <div
      className={cn(
        "w-full items-center flex justify-center bg-qik shadow z-10",
        className
      )}
    >
      <img
        src={t(`banner.image`)}
        alt={t(`banner.imageAlt`)}
        className="h-12 md:h-14"
        width={260}
        height={56}
        loading="eager"
      />
    </div>
  );
}

export default Banner;
