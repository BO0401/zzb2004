/**
 * API 服务基类
 * 提供统一的 HTTP 请求封装和错误处理
 */

import { API_CONFIG, ERROR_CODES } from '@/config'

// 请求配置接口
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  retry?: number
}

// 响应接口
export interface ApiResponse<T = any> {
  data: T
  code: number
  message: string
  success: boolean
}

// 错误接口
export interface ApiError {
  code: string
  message: string
  status?: number
  data?: any
}

// API 服务类
export class ApiService {
  private baseURL: string
  private timeout: number
  private retryCount: number
  private retryDelay: number

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
    this.retryCount = API_CONFIG.RETRY_COUNT
    this.retryDelay = API_CONFIG.RETRY_DELAY
  }

  /**
   * 发送 HTTP 请求
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const {
      url,
      method = 'GET',
      data,
      params,
      headers = {},
      timeout = this.timeout,
      retry = this.retryCount
    } = config

    // 构建完整 URL
    const fullUrl = this.buildUrl(url, params)

    // 构建请求配置
    const fetchConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: AbortSignal.timeout(timeout)
    }

    // 添加请求体
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchConfig.body = JSON.stringify(data)
    }

    // 执行请求（带重试机制）
    return this.executeWithRetry(fullUrl, fetchConfig, retry)
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config
    })
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config
    })
  }

  /**
   * 构建 URL
   */
  private buildUrl(url: string, params?: Record<string, any>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    
    if (!params || Object.keys(params).length === 0) {
      return fullUrl
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    return `${fullUrl}?${searchParams.toString()}`
  }

  /**
   * 执行请求（带重试机制）
   */
  private async executeWithRetry<T>(
    url: string,
    config: RequestInit,
    retryCount: number
  ): Promise<ApiResponse<T>> {
    let lastError: ApiError

    for (let i = 0; i <= retryCount; i++) {
      try {
        const response = await fetch(url, config)
        return await this.handleResponse<T>(response)
      } catch (error) {
        lastError = this.handleError(error)
        
        // 如果是最后一次重试或者是不可重试的错误，直接抛出
        if (i === retryCount || !this.shouldRetry(lastError)) {
          throw lastError
        }

        // 等待后重试
        await this.delay(this.retryDelay * Math.pow(2, i))
      }
    }

    throw lastError!
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    let data: any

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // 如果响应已经是标准格式，直接返回
    if (data && typeof data === 'object' && 'code' in data) {
      return data
    }

    // 否则包装成标准格式
    return {
      data,
      code: response.status,
      message: 'Success',
      success: true
    }
  }

  /**
   * 处理错误
   */
  private handleError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        code: ERROR_CODES.TIMEOUT,
        message: '请求超时'
      }
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: '网络连接失败'
      }
    }

    if (error.message?.includes('HTTP')) {
      const status = parseInt(error.message.match(/\d+/)?.[0] || '0')
      return {
        code: this.getErrorCodeByStatus(status),
        message: error.message,
        status
      }
    }

    return {
      code: ERROR_CODES.SERVER_ERROR,
      message: error.message || '未知错误'
    }
  }

  /**
   * 根据状态码获取错误代码
   */
  private getErrorCodeByStatus(status: number): string {
    switch (status) {
      case 401:
        return ERROR_CODES.UNAUTHORIZED
      case 403:
        return ERROR_CODES.FORBIDDEN
      case 404:
        return ERROR_CODES.NOT_FOUND
      case 422:
        return ERROR_CODES.VALIDATION_ERROR
      default:
        return ERROR_CODES.SERVER_ERROR
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: ApiError): boolean {
    // 网络错误和超时可以重试
    const retryableCodes = [
      ERROR_CODES.NETWORK_ERROR,
      ERROR_CODES.TIMEOUT,
      ERROR_CODES.SERVER_ERROR
    ] as string[]
    return retryableCodes.includes(error.code)
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 创建默认实例
export const apiService = new ApiService()

// 默认导出
export default apiService

// 导出便捷方法
export const { get, post, put, delete: del } = apiService