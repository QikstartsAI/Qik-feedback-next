import React, { useState } from "react";
import { useWaiter } from "@/hooks/useWaiter";
import { WaiterCard } from "@/components/WaiterCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UseWaiterHookExample() {
  const { getWaiterById, loading, error, clearError } = useWaiter();
  const [waiterId, setWaiterId] = useState("");
  const [waiter, setWaiter] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setWaiter(null);

    try {
      const result = await getWaiterById(waiterId);
      setWaiter(result);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Waiter Search Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="waiterId">Waiter ID</Label>
              <Input
                id="waiterId"
                value={waiterId}
                onChange={(e) => setWaiterId(e.target.value)}
                placeholder="Enter waiter ID (e.g., waiter-1, waiter-2, waiter-3)"
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={loading || !waiterId}>
              {loading ? "Searching..." : "Search Waiter"}
            </Button>
          </form>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {waiter && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Waiter Found:</h3>
              <WaiterCard waiter={waiter} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Mock Waiters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>waiter-1:</strong> María González (Female, 4.8★)
            </p>
            <p>
              <strong>waiter-2:</strong> Carlos Rodríguez (Male, 4.6★)
            </p>
            <p>
              <strong>waiter-3:</strong> Ana Martínez (Female, 4.9★)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UseWaiterHookExample;
