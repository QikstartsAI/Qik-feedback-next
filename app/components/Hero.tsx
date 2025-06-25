import { Business } from "@/app/types/business";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/new_version/components/ui/select";
import Image from "next/image";

interface HeroProps {
  business: Business | null;
  locationPermission: boolean;
  branchIndex?: number;
}

function Hero({ business, locationPermission }: HeroProps) {
  return (
    <div
      className="relative h-32 bg-cover bg-center"
      style={{ backgroundImage: `url(${business?.Cover})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex items-center space-x-3 w-full max-w-md">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <Image
              src={business?.Icono ?? ""}
              alt={business?.Name ?? "Business Logo"}
              height={55}
              width={55}
              className="w-[55px] h-[55px] rounded-full object-cover"
            />
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold">{business?.Name}</h1>
            <p className="text-sm text-gray-200">{business?.Address}</p>
          </div>
        </div>
      </div>

      {/* Language selector */}
      <div className="absolute top-4 right-4 z-20">
        {/* <Select value={language} onValueChange={setLanguage}> */}
        <Select value={"es"} onValueChange={() => {}}>
          <SelectTrigger className="w-20 bg-white/90 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">🇪🇸 ES</SelectItem>
            <SelectItem value="en">🇺🇸 EN</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default Hero;
