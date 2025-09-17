"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Waiter {
  payload: {
    name: string;
    lastName: string;
    gender: string;
    rate: number;
  };
}

interface IntroProps {
  waiter?: Waiter;
  onCustomerTypeSelect: (type: "new" | "returning") => void;
  className?: string;
}

export function Intro({ waiter, onCustomerTypeSelect, className = "" }: IntroProps) {
  const getWaiterGif = (gender: string) => {
    // Handle different gender formats
    const normalizedGender = gender?.toLowerCase();
    if (normalizedGender === "masculino" || normalizedGender === "male" || normalizedGender === "mâle") {
      return "/waiter_male.gif";
    }
    return "/waiter_female.gif";
  };

  const getWaiterName = () => {
    if (!waiter) return "Nuestro equipo";
    const { name, lastName } = waiter.payload;
    return `${name} ${lastName}`.trim();
  };

  return (
    <div className={`text-center space-y-6 animate-in slide-in-from-bottom duration-700 delay-1500 ${className}`}>
      {/* Waiter Animation */}
      {waiter && (
        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-600 delay-1600">
          <div className="relative">
            <Image
              src={getWaiterGif(waiter.payload.gender)}
              alt={`${getWaiterName()} animado`}
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg animate-in zoom-in duration-500 delay-1700"
              priority={true}
              loading="eager"
            />
          </div>
          <div className="animate-in slide-in-from-bottom duration-500 delay-1800">
            <h3 className="text-lg font-semibold text-gray-800">
              ¡Hola! Soy {getWaiterName()}
            </h3>
            <p className="text-sm text-gray-600">
              Hoy te atendí y me encantaría conocer tu opinión
            </p>
          </div>
        </div>
      )}

      {/* Customer Type Selection */}
      <div className="space-y-4 animate-in slide-in-from-bottom duration-600 delay-1900">
        <h4 className="text-base font-medium text-gray-700">
          ¿Es tu primera vez aquí?
        </h4>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => onCustomerTypeSelect("new")}
            variant="outline"
            className="flex-1 max-w-32 animate-in slide-in-from-left duration-500 delay-2000"
          >
            Primera vez
          </Button>
          <Button
            onClick={() => onCustomerTypeSelect("returning")}
            variant="outline"
            className="flex-1 max-w-32 animate-in slide-in-from-right duration-500 delay-2000"
          >
            Cliente frecuente
          </Button>
        </div>
      </div>
    </div>
  );
}
