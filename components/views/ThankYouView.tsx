"use client";

import Image from "next/image";

interface ThankYouViewProps {
  rating: string;
}

export function ThankYouView({ rating }: ThankYouViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 bg-white">
      {/* Check Icon */}
      <div className="mb-8">
        <Image
          src="/checkqikstarts.svg"
          alt="Check mark"
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </div>

      {/* Main Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 leading-tight">
        ¡Gracias por<br />
        Compartir tu opinión!
      </h1>

      {/* Description */}
      <p className="text-base md:text-lg text-gray-600 text-center mb-8 leading-relaxed max-w-md">
        Tu feedback nos ayuda a mejorar y<br />
        ofrecerte una mejor experiencia<br />
        cada vez que nos visitas.
      </p>

      {/* Closing Message */}
      <p className="text-lg md:text-xl font-bold text-blue-600 text-center">
        ¡Nos vemos Pronto!
      </p>
    </div>
  );
}
