import { useSearchParams } from "next/navigation";
import useSWR from "swr";

// services
import { businessService } from "@/app/services/businesses";
import useSWRImmutable from "swr/immutable";

export const useGetBusinessById = ({ businessId }: { businessId: string }) => {
  const response = useSWR(
    businessId ? `/business/main/${businessId}` : null,
    () => businessService.getBusiness({ businessId })
  );
  return response;
};

export const useGetBusinessByIdImmutable = ({
  businessId,
}: {
  businessId: string;
}) => {
  const response = useSWRImmutable(
    businessId ? `/business/main/${businessId}` : null,
    () => businessService.getBusiness({ businessId })
  );
  return response;
};

export const useGetCurrentBusinessByIdImmutable = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id");
  const response = useGetBusinessByIdImmutable({
    businessId: businessId as string,
  });
  return response;
};

export const useGetBusinessSucursales = ({
  businessId,
}: {
  businessId: string;
}) => {
  const response = useSWR(
    businessId ? `/business/sucursal/${businessId}` : null,
    () => businessService.getBusinessSucursal({ businessId })
  );
  return response;
};

export const useGetBusinessSucursalesImmutable = ({
  businessId,
}: {
  businessId: string;
}) => {
  const response = useSWRImmutable(
    businessId ? `/businesses/sucursal/${businessId}` : null,
    () => businessService.getBusinessSucursal({ businessId })
  );
  return response;
};

export const useGetCurrentBusinessSucursalesImmutable = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id");
  const response = useGetBusinessSucursalesImmutable({
    businessId: businessId as string,
  });
  return response;
};
