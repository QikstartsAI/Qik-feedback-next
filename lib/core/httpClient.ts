import { toast } from "sonner";
import { logApiConfigStatus } from '@/lib/utils/apiConfigValidator';

// Types for HTTP client
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export interface RequestConfig extends HttpClientConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: any;
  params?: Record<string, any>;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}

export interface HttpError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
  config?: RequestConfig;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
}

// Request/Response interceptors
export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor<T = any> = (
  response: HttpResponse<T>
) => HttpResponse<T> | Promise<HttpResponse<T>>;
export type ErrorInterceptor = (
  error: HttpError
) => HttpError | Promise<HttpError>;

export interface IHttpClient {
  addRequestInterceptor(interceptor: RequestInterceptor): void;
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
  addErrorInterceptor(interceptor: ErrorInterceptor): void;
  request<T = any>(config: RequestConfig): Promise<HttpResponse<T>>;
  get<T = any>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url">
  ): Promise<HttpResponse<T>>;
  post<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "url" | "data">
  ): Promise<HttpResponse<T>>;
  put<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "url" | "data">
  ): Promise<HttpResponse<T>>;
  delete<T = any>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url">
  ): Promise<HttpResponse<T>>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "url" | "data">
  ): Promise<HttpResponse<T>>;
}

export class HttpClient implements IHttpClient {
  private config: HttpClientConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: HttpClientConfig = {}) {
    // Sanitize baseURL if provided
    const sanitizedBaseURL = config.baseURL
      ? config.baseURL.replace(/[;'"]/g, "").trim()
      : "";

    this.config = {
      baseURL: sanitizedBaseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
      ...config,
    };
  }

  /**
   * Factory method for creating HttpClient with default configuration
   */
  static create(config?: HttpClientConfig): HttpClient {
    return new HttpClient(config);
  }

  /**
   * Factory method for creating HttpClient with environment-based configuration
   */
  static createWithEnv(): HttpClient {
    // Log configuration status in development
    if (process.env.NODE_ENV === 'development') {
      logApiConfigStatus();
    }
    
    const httpClient = new HttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://ec2-54-172-125-136.compute-1.amazonaws.com/api/v1",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to dynamically add API key
    httpClient.addRequestInterceptor(async (config) => {
      // Use NEXT_PUBLIC_API_KEY as x-api-key header (as per backend implementation)
      if (process.env.NEXT_PUBLIC_API_KEY) {
        config.headers = {
          ...config.headers,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        };
        console.log("🔑 [HttpClient] Added x-api-key header to request");
      } else {
        console.warn("⚠️ [HttpClient] NEXT_PUBLIC_API_KEY not found, requests may fail with 401");
      }
      return config;
    });

    return httpClient;
  }

  // Interceptor methods
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // Helper method to build URL with query parameters
  private buildURL(url: string, params?: Record<string, any>): string {
    // Sanitize baseURL to remove any malformed characters
    const sanitizedBaseURL = this.config.baseURL
      ? this.config.baseURL.replace(/[;'"]/g, "").trim()
      : "";

    const fullURL = sanitizedBaseURL ? `${sanitizedBaseURL}${url}` : url;

    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    const urlObj = new URL(fullURL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });

    return urlObj.toString();
  }

  // Helper method to merge headers
  private mergeHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    return {
      ...this.config.headers,
      ...customHeaders,
    };
  }

  // Helper method to apply request interceptors
  private async applyRequestInterceptors(
    config: RequestConfig
  ): Promise<RequestConfig> {
    let modifiedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  // Helper method to apply response interceptors
  private async applyResponseInterceptors<T>(
    response: HttpResponse<T>
  ): Promise<HttpResponse<T>> {
    let modifiedResponse = { ...response };

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  // Helper method to apply error interceptors
  private async applyErrorInterceptors(error: HttpError): Promise<HttpError> {
    let modifiedError = { ...error };

    for (const interceptor of this.errorInterceptors) {
      modifiedError = await interceptor(modifiedError);
    }

    return modifiedError;
  }

  // Helper method to handle errors
  private async handleError(error: any, config: RequestConfig): Promise<never> {
    let httpError: HttpError;

    if (error.name === "AbortError") {
      httpError = {
        message: "Request was aborted",
        isNetworkError: true,
        config,
      };
    } else if (error.name === "TypeError" && error.message.includes("fetch")) {
      httpError = {
        message: "Network error - please check your connection",
        isNetworkError: true,
        config,
      };
    } else if (error.status) {
      // HTTP error response
      httpError = {
        message: error.statusText || `HTTP ${error.status}`,
        status: error.status,
        statusText: error.statusText,
        data: error.data,
        config,
      };
    } else {
      // Unknown error
      httpError = {
        message: error.message || "An unexpected error occurred",
        config,
      };
    }

    const processedError = await this.applyErrorInterceptors(httpError);
    throw processedError;
  }

  // Main request method
  async request<T = any>(config: RequestConfig): Promise<HttpResponse<T>> {
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    console.log(`🌐 [HttpClient] request - Starting [${requestId}]`, { 
      method: config.method,
      url: config.url,
      hasData: !!config.data,
      hasParams: !!config.params
    });

    try {
      // Apply request interceptors
      const processedConfig = await this.applyRequestInterceptors(config);

      // Build URL
      const url = this.buildURL(processedConfig.url, processedConfig.params);

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: processedConfig.method,
        headers: this.mergeHeaders(processedConfig.headers),
        credentials: processedConfig.withCredentials ? "include" : "omit",
      };

      // Add body for non-GET requests
      if (processedConfig.method !== "GET" && processedConfig.data) {
        if (processedConfig.data instanceof FormData) {
          fetchOptions.body = processedConfig.data;
          // Remove Content-Type header to let browser set it with boundary
          delete (fetchOptions.headers as Record<string, string>)[
            "Content-Type"
          ];
        } else {
          fetchOptions.body = JSON.stringify(processedConfig.data);
        }
      }

      console.log(`📡 [HttpClient] request - Making request [${requestId}]`, { 
        url,
        method: processedConfig.method,
        headers: {
          ...fetchOptions.headers,
          // Don't log full authorization token
          Authorization: fetchOptions.headers?.['Authorization'] ? 
            `${fetchOptions.headers['Authorization'].substring(0, 20)}...` : undefined
        },
        hasBody: !!fetchOptions.body
      });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        processedConfig.timeout || this.config.timeout
      );

      fetchOptions.signal = controller.signal;

      // Make the request
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(`❌ [HttpClient] request - HTTP Error [${requestId}]`, { 
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          errorData
        });
        
        throw {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        };
      }

      // Parse response
      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else if (contentType?.includes("text/")) {
        data = (await response.text()) as T;
      } else {
        data = (await response.blob()) as T;
      }

      // Create response object
      const httpResponse: HttpResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config: processedConfig,
      };

      console.log(`✅ [HttpClient] request - Success [${requestId}]`, { 
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        contentType,
        dataSize: JSON.stringify(data).length
      });

      // Apply response interceptors
      const processedResponse = await this.applyResponseInterceptors(
        httpResponse
      );

      return processedResponse;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ [HttpClient] request - Error [${requestId}]`, { 
        method: config.method,
        url: config.url,
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : error
      });
      
      return this.handleError(error, config);
    }
  }

  // Convenience methods
  async get<T = any>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url">
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ method: "GET", url, ...config });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "url" | "data">
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ method: "POST", url, data, ...config });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "url" | "data">
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ method: "PUT", url, data, ...config });
  }

  async delete<T = any>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url">
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ method: "DELETE", url, ...config });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "url" | "data">
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ method: "PATCH", url, data, ...config });
  }
}

// Default HTTP client instance
export const httpClient = new HttpClient();

// Default error handler that shows toast notifications
httpClient.addErrorInterceptor((error: HttpError) => {
  if (error.isNetworkError) {
    toast.error("Network error - please check your connection");
  } else if (error.status === 401) {
    toast.error("Session expired - please log in again");
  } else if (error.status === 403) {
    toast.error("Access denied");
  } else if (error.status === 404) {
    toast.error("Resource not found");
  } else if (error.status && error.status >= 500) {
    toast.error("Server error - please try again later");
  } else {
    toast.error(error.message || "An error occurred");
  }

  return error;
});

// Default response interceptor for common data transformations
httpClient.addResponseInterceptor((response) => {
  // You can add common response transformations here
  // For example, unwrapping data from a standard API response format
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    response.data = response.data.data;
  }

  return response;
});

export default httpClient;
