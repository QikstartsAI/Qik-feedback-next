"use client";

import { useState } from 'react';
import { useDependencyInjection } from '@/hooks/useDependencyInjection';
import { BrandRepository } from '@/lib/domain/repositories/iBrandRepository';
import { BranchRepository } from '@/lib/domain/repositories/iBranchRepository';
import { FeedbackRepository } from '@/lib/domain/repositories/iFeedbackRepository';
import { CustomerRepository } from '@/lib/domain/repositories/iCustomerRepository';
import { WaiterRepository } from '@/lib/domain/repositories/iWaiterRepository';

export default function TestApiPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { container } = useDependencyInjection();

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setLoading(name);
    setError(null);
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [name]: result }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`${name}: ${errorMessage}`);
      console.error(`Error testing ${name}:`, err);
    } finally {
      setLoading(null);
    }
  };

  const testBrands = async () => {
    const brandRepo = await container.resolve<BrandRepository>('BRAND_REPOSITORY');
    return await brandRepo.getBrandById('ac34c402-73a1-4a2b-b920-b9a147471ecb');
  };

  const testBranches = async () => {
    const branchRepo = await container.resolve<BranchRepository>('BRANCH_REPOSITORY');
    return await branchRepo.getBranchesByBrandId('ac34c402-73a1-4a2b-b920-b9a147471ecb');
  };

  const testFeedback = async () => {
    const feedbackRepo = await container.resolve<FeedbackRepository>('FEEDBACK_REPOSITORY');
    return await feedbackRepo.getFeedbacksByBranchId('d66bc78e-516f-46b3-ba3b-4bc042200908');
  };

  const testCustomers = async () => {
    const customerRepo = await container.resolve<CustomerRepository>('CUSTOMER_REPOSITORY');
    return await customerRepo.getCustomerByPhoneNumber('+573183147981');
  };

  const testWaiters = async () => {
    const waiterRepo = await container.resolve<WaiterRepository>('WAITER_REPOSITORY');
    return await waiterRepo.getWaitersByBranchId('d66bc78e-516f-46b3-ba3b-4bc042200908');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test de Integración con API Backend
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => testEndpoint('brands', testBrands)}
            disabled={loading === 'brands'}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading === 'brands' ? 'Cargando...' : 'Test Brands'}
          </button>
          
          <button
            onClick={() => testEndpoint('branches', testBranches)}
            disabled={loading === 'branches'}
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading === 'branches' ? 'Cargando...' : 'Test Branches'}
          </button>
          
          <button
            onClick={() => testEndpoint('feedback', testFeedback)}
            disabled={loading === 'feedback'}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading === 'feedback' ? 'Cargando...' : 'Test Feedback'}
          </button>
          
          <button
            onClick={() => testEndpoint('customers', testCustomers)}
            disabled={loading === 'customers'}
            className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading === 'customers' ? 'Cargando...' : 'Test Customers'}
          </button>
          
          <button
            onClick={() => testEndpoint('waiters', testWaiters)}
            disabled={loading === 'waiters'}
            className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading === 'waiters' ? 'Cargando...' : 'Test Waiters'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
                {key} - Resultado
              </h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Información de la API
          </h3>
          <p className="text-blue-700">
            <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ec2-54-172-125-136.compute-1.amazonaws.com/api/v1'}
          </p>
          <p className="text-blue-700">
            <strong>Documentación:</strong> http://ec2-54-172-125-136.compute-1.amazonaws.com/api
          </p>
          <p className="text-blue-700">
            <strong>Autenticación:</strong> X-Api-Key Header
          </p>
          <p className="text-blue-700">
            <strong>API Key Configurado:</strong> {process.env.NEXT_PUBLIC_API_KEY ? '✅ Sí' : '❌ No'}
          </p>
          <p className="text-blue-700">
            <strong>Estado:</strong> {loading ? 'Probando...' : 'Listo para pruebas'}
          </p>
        </div>
      </div>
    </div>
  );
}
