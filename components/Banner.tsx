"use client";

import Image from "next/image";

interface BannerProps {
  language?: "es" | "en" | "fr";
  brandColor?: string;
  className?: string;
}

export function Banner({ 
  language = "es", 
  brandColor = "bg-blue-600",
  className = "" 
}: BannerProps) {
  // Get the appropriate courtesy GIF based on language
  const getCourtesyGif = (lang: string) => {
    switch (lang) {
      case "en":
        return "/cortesia-en.gif";
      case "fr":
        return "/cortesia-fr.gif";
      case "es":
      default:
        return "/cortesia-es.gif";
    }
  };

  return (
    <div className={`w-full ${brandColor} py-3 px-4 animate-in slide-in-from-top duration-700 delay-1000 ${className}`}>
      <div className="flex items-center justify-center">
        <Image
          src={getCourtesyGif(language)}
          alt="¡Recuerda pedir tu cortesía al mesero!"
          width={200}
          height={56}
          className="h-12 md:h-14 w-auto"
          priority={true}
          loading="eager"
        />
      </div>
    </div>
  );
}
