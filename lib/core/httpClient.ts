import { toast } from "sonner";

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
        "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
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
    return new HttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODZjMmY1MDUzOWM4ZjVhNDg0ODdiYmMiLCJyb2xlcyI6WyJ1c2VyIl0sImJyYW5kSWQiOiJhYzM0YzQwMi03M2ExLTRhMmItYjkyMC1iOWExNDc0NzFlY2IiLCJpYXQiOjE3NTIxNTcxNzcsImV4cCI6MTc1MjI0MzU3N30.QgwliL6ju1bC3HZZquLGtOD9snKcJ9umb6MaEzicBoI`,
      },
    });
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

    const urlObj = new URL(fullURL, window.location.origin);
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

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
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

      // Apply response interceptors
      const processedResponse = await this.applyResponseInterceptors(
        httpResponse
      );

      return processedResponse;
    } catch (error) {
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
