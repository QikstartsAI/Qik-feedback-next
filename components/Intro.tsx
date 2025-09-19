"use client";

import Image from "next/image";

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
  className?: string;
}

export function Intro({ waiter, className = "" }: IntroProps) {
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
    <div className={`text-center space-y-3 md:space-y-6 animate-in slide-in-from-bottom duration-700 delay-1500 ${className}`}>
      {/* Waiter Animation */}
      {waiter && (
        <div className="flex flex-col items-center space-y-2 md:space-y-4 animate-in fade-in duration-600 delay-1600">
          <div className="relative">
            <Image
              src={getWaiterGif(waiter.payload.gender)}
              alt={`${getWaiterName()} animado`}
              width={120}
              height={120}
              className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover shadow-lg animate-in zoom-in duration-500 delay-1700"
              priority={true}
              loading="eager"
            />
          </div>
          <div className="animate-in slide-in-from-bottom duration-500 delay-1800">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">
              ¡Hola! Soy {getWaiterName()}
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Hoy te atendí y me encantaría conocer tu opinión
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
