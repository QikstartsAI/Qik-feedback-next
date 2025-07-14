"use client";

import { useEffect } from "react";
import { useBrand } from "@/hooks/useBrand";
import { useSearchParams } from "next/navigation";

export default function TestMockBrandsPage() {
  const { currentBrand, getBrandById, loading, error } = useBrand();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("id") || "brand-1";

  useEffect(() => {
    getBrandById(brandId);
  }, [brandId, getBrandById]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mock Brand Test</h1>

      <div className="mb-4">
        <p className="text-lg mb-2">Test with URL parameters:</p>
        <div className="space-y-1 text-sm">
          <p>
            <code>/?id=brand-1</code> - Restaurante El Buen Sabor
          </p>
          <p>
            <code>/?id=brand-2</code> - Café Delicioso
          </p>
          <p>
            <code>/?id=brand-3</code> - Pizzería La Italiana
          </p>
          <p>
            <code>/?id=brand-4</code> - Hamburguesas El Rincón
          </p>
          <p>
            <code>/?id=brand-5</code> - Sushi Bar Sakura
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Current Brand Data</h2>

        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {currentBrand && (
          <div className="space-y-4">
            <div>
              <strong>ID:</strong> {currentBrand.id}
            </div>
            <div>
              <strong>Name:</strong> {currentBrand.payload.name}
            </div>
            <div>
              <strong>Category:</strong> {currentBrand.payload.category}
            </div>
            <div>
              <strong>Address:</strong> {currentBrand.payload.location.address}
            </div>
            <div>
              <strong>Country:</strong>{" "}
              {currentBrand.payload.location.countryCode}
            </div>
            <div>
              <strong>Logo URL:</strong> {currentBrand.payload.logoImgURL}
            </div>
            <div>
              <strong>Cover URL:</strong> {currentBrand.payload.coverImgURL}
            </div>
            <div>
              <strong>Coordinates:</strong> Lat:{" "}
              {currentBrand.payload.location.geopoint.lat}, Lon:{" "}
              {currentBrand.payload.location.geopoint.lon}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {currentBrand.createdAt.toLocaleDateString()}
            </div>
            <div>
              <strong>Updated:</strong>{" "}
              {currentBrand.updatedAt.toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
