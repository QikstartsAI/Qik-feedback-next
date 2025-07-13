"use client";

import React, { useState } from "react";
import { useBranch } from "@/hooks/useBranch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building } from "lucide-react";

function UseBranchHookExample() {
  const { getBranchById, loading, error, clearError } = useBranch();
  const [branchId, setBranchId] = useState("");
  const [branch, setBranch] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setBranch(null);

    try {
      const result = await getBranchById(branchId);
      setBranch(result);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branch Search Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="branchId">Branch ID</Label>
              <Input
                id="branchId"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                placeholder="Enter branch ID (e.g., branch-1, branch-2, branch-3)"
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={loading || !branchId}>
              {loading ? "Searching..." : "Search Branch"}
            </Button>
          </form>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {branch && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Branch Found:</h3>
              <Card className="border-2 border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <img
                        src={branch.payload.logoImgURL}
                        alt="Branch logo"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {branch.payload.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {branch.payload.category}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{branch.payload.location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>Brand ID: {branch.brandId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Mock Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>branch-1:</strong> Restaurante El Buen Sabor (Quito)
            </p>
            <p>
              <strong>branch-2:</strong> Restaurante El Buen Sabor - Centro
              (Quito)
            </p>
            <p>
              <strong>branch-3:</strong> Café Delicioso (Plaza Grande, Quito)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UseBranchHookExample;
