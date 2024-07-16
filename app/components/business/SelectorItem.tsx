import { useFormStore } from "@/app/stores/form";
import { Icon } from "@iconify/react";

interface BusinessSelectorbusinessProps {
  business: BusinessI | BusinessSucursalI;
}

export const BusinessSelectorItem = ({
  business,
}: BusinessSelectorbusinessProps) => {
  const { business: currentBusiness, setBusiness } = useFormStore();

  return (
    <div
      className="w-full py-4 flex items-center gap-4 cursor-pointer"
      onClick={() => setBusiness(business)}
    >
      <div
        className={`min-w-[20px] w-[20px] h-[20px] border-2 border-primary p-1 rounded-full bg-white duration-200`}
      >
        <div
          className={`w-full h-full rounded-full ${
            currentBusiness?.id === business?.id ? "bg-primary" : ""
          }`}
        ></div>
      </div>
      <div
        className={`${
          currentBusiness?.id === business?.id
            ? "text-black font-bold"
            : "text-gray-600"
        } duration-200 flex flex-col`}
      >
        <p>{business?.Name}</p>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-[20px] border">
            <Icon icon="mdi:location" />
          </div>
          <p>{business?.Address}</p>
        </div>
      </div>
    </div>
  );
};
