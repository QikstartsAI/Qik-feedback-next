import { cn } from "@/app/lib/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Props {
  businessCountry: string;
}

function Thanks({ businessCountry }: Props) {
  const { t } = useTranslation("thanks");
  return (
    <div
      className={cn(
        "w-full min-h-screen items-center flex justify-center bg-qik shadow z-10"
      )}
    >
      <img
        src={t(`image`)}
        alt={t(`imageAlt`)}
        className="h-auto max-w-sm px-4 md:px-0"
        width={2251}
        height={2126}
      />
    </div>
  );
}

export default Thanks;
