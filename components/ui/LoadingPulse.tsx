import Image from "next/image";

interface LoadingPulseProps {
  size?: number;
  className?: string;
}

export function LoadingPulse({ size = 80, className = "" }: LoadingPulseProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div className="animate-pulse">
        <Image
          src="/qik.svg"
          alt="Qik Logo"
          width={size}
          height={size / 2}
          className="opacity-80"
        />
      </div>
      <div className="text-sm text-gray-500 font-medium">Cargando...</div>
    </div>
  );
}
