import useSWRImmutable from "swr/immutable";
import { waitersService } from "@/app/services/waiters";
import { useSearchParams } from "next/navigation";

export const useGetWaiterByBusinessImmutable = ({
  businessId,
  waiterId,
}: {
  businessId: string;
  waiterId: string;
}) => {
  const enabled = !!(businessId && waiterId);
  const response = useSWRImmutable(
    enabled ? `/business/${businessId}/waiter/${waiterId}` : null,
    () => waitersService.getWaiterByBusiness({ businessId, waiterId })
  );
  return response;
};

export const useGetCurrentWaiterByBusinessImmutable = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id") as string;
  const waiterId = searchParams.get("mesero") as string;
  const response = useGetWaiterByBusinessImmutable({ businessId, waiterId });
  return response;
};

export const useGetWaiterByBusinessOrSucursal = ({
  businessId,
  waiterId,
  sucursalId,
}: {
  businessId: string;
  waiterId: string;
  sucursalId?: string;
}) => {
  const enabled = !!(businessId && waiterId);
  const response = useSWRImmutable(
    enabled
      ? `/business/${businessId}/sucursal/${sucursalId}/waiter/${waiterId}`
      : null,
    () =>
      waitersService.getWaiterByBusinessOrSucursal({
        businessId,
        waiterId,
        sucursalId,
      })
  );
  return response;
};

export const useGetWaiterByBusinessOrSucursalImmutable = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id") as string;
  const waiterId = searchParams.get("mesero") as string;
  const sucursalId = searchParams.get("sucursal") as string;
  const response = useGetWaiterByBusinessOrSucursal({
    businessId,
    waiterId,
    sucursalId,
  });
  return response;
};
