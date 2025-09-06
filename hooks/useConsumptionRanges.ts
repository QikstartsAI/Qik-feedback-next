"use client";

import { useState, useEffect } from "react";

export interface ConsumptionRange {
  currency: string;
  ranges: string[];
}

export interface ConsumptionRangesData {
  [countryCode: string]: ConsumptionRange;
}

export function useConsumptionRanges() {
  const [data, setData] = useState<ConsumptionRangesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsumptionRanges = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/consumption-ranges.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch consumption ranges: ${response.status}`);
        }
        
        const consumptionData = await response.json();
        setData(consumptionData);
        setError(null);
      } catch (err) {
        console.error('Error loading consumption ranges:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to default data if JSON fails to load
        setData({
          MX: {
            currency: "MXN",
            ranges: ["1-100 $", "100-200 $", "300-400 $", "400-500 $", "+500 $"]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsumptionRanges();
  }, []);

  const getConsumptionRanges = (countryCode: string): ConsumptionRange | null => {
    if (!data) return null;
    return data[countryCode] || null;
  };

  const getConsumptionOptions = (countryCode: string) => {
    const countryData = getConsumptionRanges(countryCode);
    if (!countryData) return [];
    
    return countryData.ranges.map((range) => ({
      value: range,
      label: range
    }));
  };

  const getCurrency = (countryCode: string): string => {
    const countryData = getConsumptionRanges(countryCode);
    return countryData?.currency || "USD";
  };

  return {
    data,
    loading,
    error,
    getConsumptionRanges,
    getConsumptionOptions,
    getCurrency,
  };
}
