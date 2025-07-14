"use client";

import React, { useState } from "react";
import { Branch } from "@/lib/domain/entities";
import { BranchSelectionDialog } from "@/components/BranchSelectionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Example branches with different coordinates
const exampleBranches: Branch[] = [
  {
    id: "branch-1",
    brandId: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Restaurante El Buen Sabor",
      category: "Restaurante",
      location: {
        address: "Calle 15 #23-45, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
  {
    id: "branch-2",
    brandId: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Restaurante El Buen Sabor - Centro",
      category: "Restaurante",
      location: {
        address: "Carrera 5 #18-32, Centro, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.928, lon: -75.2825 },
        googleMapURL: "https://maps.google.com/?q=2.9280,-75.2825",
      },
    },
  },
  {
    id: "branch-3",
    brandId: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/googleqik.png",
      coverImgURL: "/business_icon_cover.jpg",
      name: "Café Delicioso",
      category: "Café",
      location: {
        address: "Avenida 26 #15-67, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9265, lon: -75.28 },
        googleMapURL: "https://maps.google.com/?q=2.9265,-75.2800",
      },
    },
  },
];

export const UseLocationHookExample: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowDialog(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Location-Based Branch Selection Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            This example demonstrates how the BranchSelectionDialog uses real
            location data to determine the nearest branch.
          </p>

          <Button onClick={() => setShowDialog(true)} className="w-full">
            Open Branch Selection
          </Button>

          {selectedBranch && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Selected Branch:</h4>
              <p className="text-sm text-green-700">
                {selectedBranch.payload.name}
              </p>
              <p className="text-xs text-green-600">
                {selectedBranch.payload.location.address}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4">
            <p>
              <strong>Features:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Requests user location permission</li>
              <li>Calculates real distances using Mapbox API</li>
              <li>Shows nearest branch based on actual location</li>
              <li>Fallback to first branch if location unavailable</li>
              <li>Option to view all branches</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <BranchSelectionDialog
        branches={exampleBranches}
        open={showDialog}
        onBranchSelect={handleBranchSelect}
        brandColor="220, 100%, 50%"
        brandName="Restaurante El Buen Sabor"
      />
    </div>
  );
};
