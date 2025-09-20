"use client";

import { useEffect, useState, Suspense } from "react";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";

function TestWaiterContent() {
  const [testResults, setTestResults] = useState<any[]>([]);
  
  const {
    currentWaiter,
    currentBranch,
    currentBrand,
    waiterId,
    branchId,
    brandId,
  } = useFeedbackForm();

  useEffect(() => {
    const results = [];
    
    // Test waiter parameter
    if (waiterId) {
      results.push({
        test: "Waiter ID from URL",
        value: waiterId,
        status: "✅ Found"
      });
    } else {
      results.push({
        test: "Waiter ID from URL",
        value: "Not found",
        status: "❌ Missing"
      });
    }

    // Test waiter data
    if (currentWaiter) {
      results.push({
        test: "Waiter Data",
        value: `${currentWaiter.payload.name} ${currentWaiter.payload.lastName}`,
        status: "✅ Loaded",
        details: {
          id: currentWaiter.id,
          branchId: currentWaiter.branchId,
          rate: currentWaiter.payload.rate
        }
      });
    } else {
      results.push({
        test: "Waiter Data",
        value: "Not loaded",
        status: "❌ Missing"
      });
    }

    // Test branch data
    if (currentBranch) {
      results.push({
        test: "Branch Data",
        value: currentBranch.payload.name,
        status: "✅ Loaded",
        details: {
          id: currentBranch.id,
          brandId: currentBranch.brandId
        }
      });
    } else {
      results.push({
        test: "Branch Data",
        value: "Not loaded",
        status: "❌ Missing"
      });
    }

    // Test brand data
    if (currentBrand) {
      results.push({
        test: "Brand Data",
        value: currentBrand.payload.name,
        status: "✅ Loaded",
        details: {
          id: currentBrand.id
        }
      });
    } else {
      results.push({
        test: "Brand Data",
        value: "Not loaded",
        status: "❌ Missing"
      });
    }

    setTestResults(results);
  }, [waiterId, currentWaiter, currentBranch, currentBrand]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test de Parámetro Waiter
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📋 Instrucciones de Prueba</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Para probar con waiter:</strong></p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              /test-waiter?waiter=1e9b404e-560b-42f7-919e-28d00afd463c
            </p>
            <p><strong>Para probar con branch:</strong></p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              /test-waiter?branch=4d83c2dc-91f7-427e-a5c1-b1e02c484951
            </p>
            <p><strong>Para probar con brand:</strong></p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              /test-waiter?id=5032f594-3212-45c2-aa3f-53f559c78ea8
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔍 Resultados de Prueba</h2>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{result.test}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    result.status.includes('✅') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{result.value}</p>
                {result.details && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <pre className="text-gray-700">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Flujo Esperado
          </h2>
          <div className="text-blue-800 space-y-1">
            <p>1. <strong>Waiter ID</strong> → Obtener datos del waiter</p>
            <p>2. <strong>Waiter.branchId</strong> → Obtener datos de la sucursal</p>
            <p>3. <strong>Branch.brandId</strong> → Obtener datos de la marca</p>
            <p>4. <strong>Resultado</strong> → Todos los datos disponibles para el feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestWaiterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🧪 Test de Parámetro Waiter
            </h1>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <p className="text-gray-600 mt-4">Cargando parámetros de URL...</p>
          </div>
        </div>
      </div>
    }>
      <TestWaiterContent />
    </Suspense>
  );
}
