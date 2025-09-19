"use client";

interface HeaderProps {
  logo: string;
  coverImage: string;
  name: string;
  address: string;
  distance?: string;
  loading?: boolean;
}

export function Header({
  logo,
  coverImage,
  name,
  address,
  distance = "",
  loading = false,
}: HeaderProps) {
  return (
    <div
      className="relative h-32 bg-cover bg-center"
      style={{ backgroundImage: `url('${coverImage}')` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex items-center space-x-3 w-full max-w-md">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                // Only log warning if it's not an example URL
                if (!logo.includes('example.com') && !logo.includes('placeholder')) {
                  console.warn("Failed to load logo:", logo);
                }
                e.currentTarget.src = "/placeholder-logo.svg";
              }}
            />
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold">{name}</h1>
            <p className="text-sm text-gray-200">
              {address} • {loading ? "Cargando..." : distance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
