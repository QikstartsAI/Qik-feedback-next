import { cn } from "@/lib/lib/utils";
import { Business } from "@/lib/types/business";
import { useTranslation } from "next-i18next";

export const ClientTypeSelection = ({
  business,
  setClientType,
}: {
  setClientType: (type: "newClient" | "frequentClient") => void;
  business?: Business | null;
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="text-center">
      <h1
        className="font-bold md:text-2xl max-sm:text-2xl"
        style={{
          color: business?.BrandColor ? business?.BrandColor : "#058FFF",
        }}
      >
        {t("wizard.clientType.title")}
      </h1>
      <p className="text-gray-600">{t("wizard.clientType.subtitle")}</p>
      <div className="flex mt-7 justify-center items-center">
        <button
          className="flex flex-col items-center mx-4"
          onClick={() => setClientType("newClient")}
        >
          <img
            src={true ? "/yellow-start.png" : "/gray-start.png"}
            alt={t("wizard.clientType.newClientAlt")}
            style={{ maxWidth: "180px" }}
          />
          <h1 className="text-gray-800 md:text-xl font-bold">
            {t("wizard.clientType.newClientButton")}
          </h1>
        </button>
        <button
          className="flex flex-col items-center mx-4"
          onClick={() => setClientType("frequentClient")}
        >
          <img
            src={true ? "/red-heart.png" : "/gray-heart.png"}
            alt={t("wizard.clientType.frequentClientAlt")}
            style={{ maxWidth: "180px" }}
          />
          <h1 className="text-gray-800 md:text-xl font-bold">
            {t("wizard.clientType.frequentClientButton")}
          </h1>
        </button>
      </div>
    </div>
  );
};
