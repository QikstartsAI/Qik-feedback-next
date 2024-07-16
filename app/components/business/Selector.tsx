import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/Button";
import {
  useGetCurrentBusinessAndSucursalesImmutable,
  useGetCurrentBusinessByIdImmutable,
  useGetCurrentBusinessSucursalesImmutable,
} from "@/app/hooks/services/businesses";
import { Icon } from "@iconify/react";

//
import { BusinessSelectorItem } from "@/app/components/business/SelectorItem";
import { useFormStore } from "@/app/stores/form";

export const BusinessSelector = () => {
  const { showBusinessSelector, setShowBusinessSelector } = useFormStore();
  const { business: mainBusiness, sucursales } =
    useGetCurrentBusinessAndSucursalesImmutable();

  return (
    <Drawer open={showBusinessSelector}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm h-full">
          <DrawerHeader>
            <DrawerTitle>Sucursal</DrawerTitle>
            <DrawerDescription>
              Elige la sucursal en la que te encuentres
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="max-h-[360px] overflow-y-auto">
              {mainBusiness && <BusinessSelectorItem business={mainBusiness} />}
              {sucursales?.map((item, index) => (
                <BusinessSelectorItem
                  business={item}
                  key={`sucursal-${index}`}
                />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button onClick={() => setShowBusinessSelector(false)}>
                Cerrar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
