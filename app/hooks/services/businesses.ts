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
    businessId ? `/business/sucursales/${businessId}` : null,
    () => businessService.getBusinessSucursales({ businessId })
  );
  return response;
};

export const useGetBusinessSucursalesImmutable = ({
  businessId,
}: {
  businessId: string | undefined | null;
}) => {
  const response = useSWRImmutable(
    businessId ? `/businesses/sucursal/${businessId}` : null,
    () =>
      businessService.getBusinessSucursales({
        businessId: businessId as string,
      })
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

export const useGetCurrentSucursalImmutable = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id") as string;
  const sucursalId = searchParams.get("sucursal") as string;
  const enabled = !sucursalId && !!businessId;
  const response = useSWRImmutable(
    enabled ? `/business/sucursal/${sucursalId}` : null,
    () => businessService.getBusinessSucursal({ businessId, sucursalId })
  );
  return response;
};
