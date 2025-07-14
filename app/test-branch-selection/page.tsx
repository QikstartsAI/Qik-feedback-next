"use client";

import { useEffect } from "react";
import { useBrand } from "@/hooks/useBrand";
import { useSearchParams } from "next/navigation";

export default function TestBranchSelectionPage() {
  const { currentBrand, getBrandById, loading, error } = useBrand();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("id") || "brand-1";

  useEffect(() => {
    getBrandById(brandId);
  }, [brandId, getBrandById]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Branch Selection Flow Test</h1>

      <div className="mb-4">
        <p className="text-lg mb-2">Test the branch selection flow:</p>
        <div className="space-y-1 text-sm">
          <p>
            <code>/?id=brand-1</code> - Should show branch selection dialog (has
            GEOLOCATION power)
          </p>
          <p>
            <code>/?id=brand-2</code> - Should show branch selection dialog (has
            GEOLOCATION power)
          </p>
          <p>
            <code>/?id=brand-3</code> - Should show branch selection dialog (has
            GEOLOCATION power)
          </p>
          <p>
            <code>/?id=brand-4</code> - Should show branch selection dialog (has
            GEOLOCATION power)
          </p>
          <p>
            <code>/?id=brand-5</code> - Should show branch selection dialog (has
            GEOLOCATION power)
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
              <strong>Powers:</strong>{" "}
              {currentBrand.payload.powers?.join(", ") || "None"}
            </div>
            <div>
              <strong>Has GEOLOCATION:</strong>{" "}
              {currentBrand.payload.powers?.includes("GEOLOCATION")
                ? "Yes"
                : "No"}
            </div>
            <div>
              <strong>Address:</strong> {currentBrand.payload.location.address}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Expected Behavior:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • When you visit with only brand ID, it should fetch the brand
          </li>
          <li>
            • If brand has GEOLOCATION power, it should show full-screen branch
            selection
          </li>
          <li>
            • First shows the nearest branch with a &quot;Ver todas las
            sucursales&quot; button
          </li>
          <li>
            • Clicking &quot;Ver todas las sucursales&quot; shows all available
            branches
          </li>
          <li>• After selecting a branch, it should load the branch data</li>
        </ul>
      </div>
    </div>
  );
}
