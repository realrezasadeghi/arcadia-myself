type Interceptor<T> = {
  onFulfilled?: (value: T) => T | Promise<T>;
  onRejected?: (error: any) => any;
};

type CustomTransformer = (data: any, headers?: Record<string, string>) => any;

export interface RequestConfig {
  baseURL?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: "json" | "text" | "blob" | "arraybuffer";
  validateStatus?: (status: number) => boolean;
  transformRequest?: CustomTransformer[];
  transformResponse?: CustomTransformer[];
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  onDownloadProgress?: (progressEvent: ProgressEvent) => void;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

export interface HttpCustomResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestConfig;
  request?: Request;
  isSuccess: boolean;
}

export interface HttpCustomError extends Error {
  config: RequestConfig;
  code?: string;
  request?: Request;
  response?: HttpCustomResponse;
  isHttpError: boolean;
}

class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null> = [];

  use(
    onFulfilled?: (value: T) => T | Promise<T>,
    onRejected?: (error: any) => any,
  ): number {
    this.interceptors.push({ onFulfilled, onRejected });
    return this.interceptors.length - 1;
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    });
  }

  clear(): void {
    this.interceptors = [];
  }
}

interface RetryConfig {
  retries: number;
  retryDelay?: (retryCount: number) => number;
  retryCondition?: (error: HttpCustomError) => boolean;
}

class RequestRetryHandler {
  constructor(private config: RetryConfig) {}

  async execute<T>(fn: () => Promise<T>, retryCount = 0): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const httpError = error as HttpCustomError;

      if (
        retryCount < this.config.retries &&
        (!this.config.retryCondition || this.config.retryCondition(httpError))
      ) {
        const delay = this.config.retryDelay
          ? this.config.retryDelay(retryCount)
          : 2 ** retryCount * 1000;

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.execute(fn, retryCount + 1);
      }

      throw error;
    }
  }
}

export class HttpClient {
  private readonly defaults: RequestConfig;

  public interceptors: {
    request: InterceptorManager<RequestConfig>;
    response: InterceptorManager<HttpCustomResponse>;
  };
  private retryHandler?: RequestRetryHandler;

  constructor(config: RequestConfig = {}) {
    this.defaults = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
      validateStatus: (status) => status >= 200 && status < 300,
      ...config,
    };

    this.interceptors = {
      request: new InterceptorManager<RequestConfig>(),
      response: new InterceptorManager<HttpCustomResponse>(),
    };
  }

  private mergeConfig(config: RequestConfig): RequestConfig {
    return {
      ...this.defaults,
      ...config,
      headers: {
        ...this.defaults.headers,
        ...config.headers,
      },
    };
  }

  private buildUrl(url: string, params?: Record<string, any>): string {
    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    return `${url}?${searchParams.toString()}`;
  }

  private createError(
    message: string,
    config: RequestConfig,
    code?: string,
    request?: Request,
    response?: HttpCustomResponse,
  ): HttpCustomError {
    const error = new Error(message) as HttpCustomError;
    error.config = config;
    error.code = code;
    error.request = request;
    error.response = response;
    error.isHttpError = true;
    return error;
  }

  private async runInterceptors<T>(
    interceptors: InterceptorManager<T>,
    value: T,
    isError = false,
  ): Promise<T> {
    let result: any = value;
    const chain: Array<Interceptor<T>> = [];

    interceptors.forEach((interceptor) => chain.push(interceptor));

    for (const interceptor of chain) {
      try {
        if (isError && interceptor.onRejected) {
          result = await interceptor.onRejected(result);
          isError = false;
        } else if (!isError && interceptor.onFulfilled) {
          result = await interceptor.onFulfilled(result);
        }
      } catch (error) {
        result = error;
        isError = true;
      }
    }

    if (isError) throw result;
    return result;
  }

  private transformData(
    data: any,
    headers: Record<string, string>,
    transformers?: CustomTransformer[],
  ): any {
    if (!transformers || !transformers.length) return data;
    return transformers.reduce(
      (acc, transformer) => transformer(acc, headers),
      data,
    );
  }

  async request<T = any>(
    url: string,
    config: RequestConfig = {},
  ): Promise<HttpCustomResponse<T>> {
    const mergedConfig = this.mergeConfig(config);

    const interceptedConfig = await this.runInterceptors(
      this.interceptors.request,
      mergedConfig,
    );

    const executeRequest = async (): Promise<HttpCustomResponse<T>> => {
      const fullUrl = this.buildUrl(
        mergedConfig.baseURL ? mergedConfig.baseURL + url : url,
        interceptedConfig.params,
      );

      const transformedData = this.transformData(
        interceptedConfig.data,
        interceptedConfig.headers || {},
        interceptedConfig.transformRequest,
      );

      const fetchOptions: RequestInit = {
        method: interceptedConfig.method,
        headers: interceptedConfig.headers,
        credentials: interceptedConfig.withCredentials
          ? "include"
          : "same-origin",
        next: interceptedConfig.next,
        cache: interceptedConfig.cache,
      };

      if (
        transformedData &&
        ["POST", "PUT", "PATCH"].includes(interceptedConfig.method || "")
      ) {
        fetchOptions.body =
          typeof transformedData === "string"
            ? transformedData
            : JSON.stringify(transformedData);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        interceptedConfig.timeout || 30000,
      );

      try {
        const response = await fetch(fullUrl, {
          ...fetchOptions,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        let data: any;
        switch (interceptedConfig.responseType || "json") {
          case "json":
            data = await response.json().catch(() => null);
            break;
          case "text":
            data = await response.text();
            break;
          case "blob":
            data = await response.blob();
            break;
          case "arraybuffer":
            data = await response.arrayBuffer();
            break;
          default:
            data = await response.json().catch(() => null);
        }

        const transformedResponseData = this.transformData(
          data,
          Object.fromEntries(response.headers.entries()),
          interceptedConfig.transformResponse,
        );

        const httpResponse: HttpCustomResponse<T> = {
          data: transformedResponseData,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: interceptedConfig,
          isSuccess: true,
        };

        const validateStatus =
          interceptedConfig.validateStatus || this.defaults.validateStatus;

        if (!validateStatus || !validateStatus(response.status)) {
          throw this.createError(
            `Request failed with status code ${response.status}`,
            interceptedConfig,
            "ERR_BAD_RESPONSE",
            undefined,
            { ...httpResponse, isSuccess: false },
          );
        }

        return httpResponse;
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          throw this.createError(
            "Request timeout",
            interceptedConfig,
            "ERR_TIMEOUT",
          );
        }
        if (error.isHttpError) throw error;
        throw this.createError(
          error.message || "Network Error",
          interceptedConfig,
          "ERR_NETWORK",
        );
      }
    };

    const executeFn = this.retryHandler
      ? () => this.retryHandler!.execute(executeRequest)
      : executeRequest;

    try {
      const response = await executeFn();
      return await this.runInterceptors(this.interceptors.response, response);
    } catch (error) {
      throw await this.runInterceptors<any>(
        this.interceptors.response,
        error,
        true,
      );
    }
  }

  static create(config: RequestConfig) {
    return new HttpClient(config);
  }

  get<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<HttpCustomResponse<T>> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<HttpCustomResponse<T>> {
    return this.request<T>(url, { ...config, method: "POST", data });
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<HttpCustomResponse<T>> {
    return this.request<T>(url, { ...config, method: "PUT", data });
  }

  delete<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<HttpCustomResponse<T>> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<HttpCustomResponse<T>> {
    return this.request<T>(url, { ...config, method: "PATCH", data });
  }
}
