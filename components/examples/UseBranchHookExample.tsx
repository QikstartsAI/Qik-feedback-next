"use client";

import React, { useState } from "react";
import { useBranch } from "@/hooks/useBranch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UseBranchHookExample: React.FC = () => {
  const { currentBranch, loading, error, getBranchById, clearError } =
    useBranch();
  const [branchId, setBranchId] = useState("");

  const handleGetBranch = async () => {
    if (branchId.trim()) {
      await getBranchById(branchId);
    }
  };

  const handleClearError = () => {
    clearError();
    setBranchId("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branch Hook Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Branch ID"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleGetBranch}
              disabled={loading || !branchId.trim()}
            >
              {loading ? "Loading..." : "Get Branch"}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearError}
                className="mt-2"
              >
                Clear Error
              </Button>
            </div>
          )}

          {currentBranch && (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-2">
                Branch Found:
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>ID:</strong> {currentBranch.id}
                </p>
                <p>
                  <strong>Name:</strong> {currentBranch.payload.name}
                </p>
                <p>
                  <strong>Address:</strong> {currentBranch.payload.address}
                </p>
                <p>
                  <strong>City:</strong> {currentBranch.payload.city}
                </p>
                <p>
                  <strong>Country:</strong> {currentBranch.payload.country}
                </p>
                {currentBranch.payload.coverImgURL && (
                  <p>
                    <strong>Cover Image:</strong>{" "}
                    {currentBranch.payload.coverImgURL}
                  </p>
                )}
                {currentBranch.payload.logo && (
                  <p>
                    <strong>Logo:</strong> {currentBranch.payload.logo}
                  </p>
                )}
                {currentBranch.payload.geopoint && (
                  <div>
                    <p>
                      <strong>Location:</strong>
                    </p>
                    <p className="ml-4">
                      Lat: {currentBranch.payload.geopoint._lat}
                    </p>
                    <p className="ml-4">
                      Long: {currentBranch.payload.geopoint._long}
                    </p>
                  </div>
                )}
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(currentBranch.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(currentBranch.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
