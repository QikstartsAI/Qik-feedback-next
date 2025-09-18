/**
 * API Configuration Validator
 * 
 * This utility helps validate that the API configuration is correct
 * and provides helpful error messages for debugging.
 */

export interface ApiConfigStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: {
    baseUrl: string;
    hasApiKey: boolean;
    apiKeyLength: number;
  };
}

export function validateApiConfig(): ApiConfigStatus {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
    'http://ec2-54-172-125-136.compute-1.amazonaws.com/api/v1';
  
  if (!baseUrl.startsWith('http')) {
    errors.push('Base URL must start with http:// or https://');
  }
  
  // Check API Key
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const hasApiKey = !!apiKey;
  
  if (!hasApiKey) {
    errors.push('NEXT_PUBLIC_API_KEY environment variable is not set');
  } else if (apiKey.length < 10) {
    warnings.push('API Key seems too short, please verify it\'s correct');
  }
  
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    if (baseUrl.includes('localhost') && !baseUrl.includes('3000')) {
      warnings.push('Development mode detected but base URL doesn\'t point to localhost:3000');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: {
      baseUrl,
      hasApiKey,
      apiKeyLength: apiKey?.length || 0,
    }
  };
}

export function logApiConfigStatus(): void {
  const status = validateApiConfig();
  
  console.group('🔧 API Configuration Status');
  console.log('Valid:', status.isValid ? '✅' : '❌');
  console.log('Base URL:', status.config.baseUrl);
  console.log('Has API Key:', status.config.hasApiKey ? '✅' : '❌');
  console.log('API Key Length:', status.config.apiKeyLength);
  
  if (status.errors.length > 0) {
    console.group('❌ Errors:');
    status.errors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  if (status.warnings.length > 0) {
    console.group('⚠️ Warnings:');
    status.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }
  
  console.groupEnd();
}
