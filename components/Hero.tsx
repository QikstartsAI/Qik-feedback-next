"use client";

import Image from "next/image";

interface HeroProps {
  coverImage: string;
  logo: string;
  name: string;
  address: string;
  distance?: string;
  loading?: boolean;
}

export function Hero({
  coverImage,
  logo,
  name,
  address,
  distance = "",
  loading = false,
}: HeroProps) {
  return (
    <div className="relative h-32 bg-cover bg-center overflow-hidden">
      {/* Animated Cover Image */}
      <Image
        src={coverImage}
        alt={`${name} cover`}
        fill
        className="object-cover animate-in fade-in duration-700"
        priority={true}
        loading="eager"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex items-center space-x-3 w-full max-w-md animate-in slide-in-from-bottom duration-600 delay-200">
          {/* Animated Business Icon */}
          <div className="w-12 md:w-20 h-12 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-500 delay-300">
            <Image
              src={logo}
              alt={`${name} logo`}
              width={32}
              height={32}
              className="w-8 h-8 md:w-12 md:h-12 rounded-full"
              priority={true}
              loading="eager"
            />
          </div>
          
          {/* Business Info */}
          <div className="text-white animate-in slide-in-from-right duration-600 delay-400">
            <h1 className="text-lg md:text-xl font-bold animate-in fade-in duration-500 delay-500">
              {name}
            </h1>
            <p className="text-sm md:text-base text-gray-200 animate-in fade-in duration-500 delay-600">
              📍 {address} {loading ? "• Cargando..." : distance && `• ${distance}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
