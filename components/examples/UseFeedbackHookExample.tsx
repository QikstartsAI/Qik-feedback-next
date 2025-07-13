"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useFeedback } from "@/hooks/useFeedback";
import { FeedbackPayload, FeedbackDataPayload } from "@/lib/domain/entities";

export function UseFeedbackHookExample() {
  const { sendFeedback, loading, error, clearError } = useFeedback();
  const [formData, setFormData] = useState<FeedbackPayload>({
    branchId: "",
    waiterId: "",
    customerId: "",
    acceptTerms: false,
    acceptPromotions: false,
    payload: {
      averageTicket: "",
      origin: "",
      feedback: "",
      rate: 5,
      experienceText: "",
      improve: [],
    },
  });

  const handleInputChange = (
    field: keyof FeedbackPayload | keyof FeedbackDataPayload,
    value: any
  ) => {
    if (field === "payload") {
      setFormData((prev) => ({
        ...prev,
        payload: { ...prev.payload, ...value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const result = await sendFeedback(formData);
      if (result) {
        alert("Feedback sent successfully!");
        // Reset form or redirect
      }
    } catch (error) {
      console.error("Failed to send feedback:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Feedback Form Example</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="branchId">Branch ID</Label>
          <Input
            id="branchId"
            value={formData.branchId}
            onChange={(e) => handleInputChange("branchId", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="waiterId">Waiter ID (Optional)</Label>
          <Input
            id="waiterId"
            value={formData.waiterId}
            onChange={(e) => handleInputChange("waiterId", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="customerId">Customer ID</Label>
          <Input
            id="customerId"
            value={formData.customerId}
            onChange={(e) => handleInputChange("customerId", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="averageTicket">Average Ticket</Label>
          <Input
            id="averageTicket"
            value={formData.payload.averageTicket}
            onChange={(e) =>
              handleInputChange("payload", { averageTicket: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            value={formData.payload.origin}
            onChange={(e) =>
              handleInputChange("payload", { origin: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="rate">Rating (1-5)</Label>
          <Input
            id="rate"
            type="number"
            min="1"
            max="5"
            value={formData.payload.rate}
            onChange={(e) =>
              handleInputChange("payload", { rate: parseInt(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="experienceText">Experience Text (Optional)</Label>
          <Textarea
            id="experienceText"
            value={formData.payload.experienceText}
            onChange={(e) =>
              handleInputChange("payload", { experienceText: e.target.value })
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) =>
              handleInputChange("acceptTerms", checked)
            }
            required
          />
          <Label htmlFor="acceptTerms">Accept Terms and Conditions</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptPromotions"
            checked={formData.acceptPromotions}
            onCheckedChange={(checked) =>
              handleInputChange("acceptPromotions", checked)
            }
          />
          <Label htmlFor="acceptPromotions">Accept Promotions</Label>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
    </div>
  );
}
