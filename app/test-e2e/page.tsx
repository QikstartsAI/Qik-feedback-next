"use client";

import { useState } from 'react';
import { ApiTester } from './ApiTester';

export default function TestE2EPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const runE2ETests = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const tester = new ApiTester();
      await tester.runAllTests();
      setResults(tester);
    } catch (error) {
      console.error('Error ejecutando pruebas E2E:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Pruebas E2E - Conexión Backend
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Configuración Actual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Base URL:</strong>
              <p className="text-sm text-gray-600 break-all">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'No configurado'}
              </p>
            </div>
            <div>
              <strong>API Key:</strong>
              <p className="text-sm text-gray-600">
                {process.env.NEXT_PUBLIC_API_KEY ? 
                  `${process.env.NEXT_PUBLIC_API_KEY.substring(0, 20)}...` : 
                  'No configurado'
                }
              </p>
            </div>
            <div>
              <strong>Autenticación:</strong>
              <p className="text-sm text-gray-600">Authorization: Bearer</p>
            </div>
            <div>
              <strong>Estado:</strong>
              <p className="text-sm text-gray-600">
                {process.env.NEXT_PUBLIC_API_KEY ? '✅ Configurado' : '❌ No configurado'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ejecutar Pruebas</h2>
          <p className="text-gray-600 mb-4">
            Estas pruebas verifican la conectividad completa con el backend NestJS,
            incluyendo autenticación, endpoints y operaciones CRUD.
          </p>
          
          <button
            onClick={runE2ETests}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isRunning ? '🔄 Ejecutando Pruebas...' : '🚀 Ejecutar Pruebas E2E'}
          </button>
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Resultados de las Pruebas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">✅ Exitosas</h3>
                <p className="text-2xl font-bold text-green-600">{results.passed}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800">❌ Fallidas</h3>
                <p className="text-2xl font-bold text-red-600">{results.failed}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">📈 Tasa de Éxito</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Detalles de las Pruebas:</h3>
              {results.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {result.success ? '✅' : '❌'} {result.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {result.method} {result.endpoint}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        result.success ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.status}
                      </p>
                    </div>
                  </div>
                  
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-sm">
                      <strong>Error:</strong> {JSON.stringify(result.error)}
                    </div>
                  )}
                  
                  {result.data && result.success && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600">
                        Ver respuesta
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Instrucciones</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Asegúrate de que el servidor de desarrollo esté ejecutándose</li>
            <li>• Verifica que las variables de entorno estén configuradas</li>
            <li>• Las pruebas se ejecutan directamente contra el backend</li>
            <li>• Revisa la consola del navegador para logs adicionales</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
