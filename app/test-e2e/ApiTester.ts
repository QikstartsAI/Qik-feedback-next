/**
 * Clase para ejecutar pruebas E2E en el frontend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ec2-54-172-125-136.compute-1.amazonaws.com/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// IDs de prueba (del backend)
const TEST_IDS = {
  brandId: 'ac34c402-73a1-4a2b-b920-b9a147471ecb',
  branchId: 'd66bc78e-516f-46b3-ba3b-4bc042200908',
  customerPhone: '+573183147981'
};

export interface TestResult {
  name: string;
  endpoint: string;
  method: string;
  success: boolean;
  status: number;
  data: any;
  error: any;
}

export class ApiTester {
  public results: TestResult[] = [];
  public passed: number = 0;
  public failed: number = 0;

  async makeRequest(endpoint: string, method: string = 'GET', data: any = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: responseData,
        error: response.ok ? null : responseData
      };
    } catch (error: any) {
      return {
        success: false,
        status: 0,
        data: null,
        error: error.message
      };
    }
  }

  async testEndpoint(name: string, endpoint: string, method: string = 'GET', data: any = null): Promise<TestResult> {
    console.log(`\n🧪 Probando: ${name}`);
    console.log(`   ${method} ${endpoint}`);
    
    const result = await this.makeRequest(endpoint, method, data);
    
    const testResult: TestResult = {
      name,
      endpoint,
      method,
      success: result.success,
      status: result.status,
      data: result.data,
      error: result.error
    };
    
    if (result.success) {
      console.log(`   ✅ ÉXITO (${result.status})`);
      this.passed++;
    } else {
      console.log(`   ❌ FALLO (${result.status})`);
      console.log(`   Error: ${JSON.stringify(result.error)}`);
      this.failed++;
    }
    
    this.results.push(testResult);
    return testResult;
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Iniciando Pruebas E2E de Conexión Backend');
    console.log('='.repeat(50));
    
    // Test 1: Verificar conectividad básica
    await this.testEndpoint('Conectividad Básica', '/brands');
    
    // Test 2: Obtener marca específica
    await this.testEndpoint('Obtener Marca', `/brands/${TEST_IDS.brandId}`);
    
    // Test 3: Obtener sucursales por marca
    await this.testEndpoint('Sucursales por Marca', `/branches?brandId=${TEST_IDS.brandId}`);
    
    // Test 4: Obtener sucursal específica
    await this.testEndpoint('Obtener Sucursal', `/branches/${TEST_IDS.branchId}`);
    
    // Test 5: Obtener feedback por sucursal
    await this.testEndpoint('Feedback por Sucursal', `/feedback/byBranchId?branchId=${TEST_IDS.branchId}`);
    
    // Test 6: Obtener cliente por teléfono
    await this.testEndpoint('Cliente por Teléfono', `/customers/by-number?phoneNumber=${TEST_IDS.customerPhone}`);
    
    // Test 7: Obtener meseros por sucursal
    await this.testEndpoint('Meseros por Sucursal', `/waiters?branchId=${TEST_IDS.branchId}`);
    
    // Test 8: Crear cliente de prueba
    const testCustomer = {
      payload: {
        name: 'Test',
        lastName: 'E2E',
        phoneNumber: '+573000000002',
        email: 'test2@e2e.com',
        branches: [{
          branchId: TEST_IDS.branchId,
          acceptPromotions: true
        }]
      }
    };
    
    await this.testEndpoint('Crear Cliente', '/customers', 'POST', testCustomer);
    
    // Test 9: Crear feedback de prueba
    const testFeedback = {
      branchId: TEST_IDS.branchId,
      customerId: 'test-customer-id',
      payload: {
        acceptTerms: true,
        acceptPromotions: true,
        customerType: 'New',
        averageTicket: '50-100',
        origin: 'GoogleMapsContext',
        rate: 5,
        experienceText: 'Excelente experiencia E2E',
        status: 'complete'
      }
    };
    
    await this.testEndpoint('Crear Feedback', '/feedback', 'POST', testFeedback);
    
    this.printSummary();
  }

  printSummary(): void {
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE PRUEBAS E2E');
    console.log('='.repeat(50));
    console.log(`✅ Exitosas: ${this.passed}`);
    console.log(`❌ Fallidas: ${this.failed}`);
    console.log(`📈 Total: ${this.passed + this.failed}`);
    console.log(`🎯 Tasa de Éxito: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    
    if (this.failed > 0) {
      console.log('\n❌ PRUEBAS FALLIDAS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   - ${r.name}: ${r.status} - ${JSON.stringify(r.error)}`);
        });
    }
    
    console.log('\n🔧 CONFIGURACIÓN:');
    console.log(`   Base URL: ${API_BASE_URL}`);
    console.log(`   API Key: ${API_KEY.substring(0, 20)}...`);
    console.log(`   Autenticación: X-Api-Key Header`);
    
    console.log('\n' + '='.repeat(50));
  }
}
