/**
 * 验证工具函数
 * 统一管理表单验证、数据校验等方法
 */

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 是否为有效手机号
 */
export function isPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证URL格式
 * @param url URL地址
 * @returns 是否为有效URL
 */
export function isUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 是否为有效密码
 */
export function isValidPassword(password: string): boolean {
  // 至少8位，包含大小写字母和数字
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * 验证必填项
 * @param value 值
 * @returns 验证结果
 */
export function validateRequired(value: any): { valid: boolean; message?: string } {
  const valid = value !== null && value !== undefined && value !== ''
  return {
    valid,
    message: valid ? undefined : '此项为必填项'
  }
}

/**
 * 验证长度
 * @param value 值
 * @param min 最小长度
 * @param max 最大长度
 * @returns 验证结果
 */
export function validateLength(
  value: string, 
  min: number, 
  max?: number
): { valid: boolean; message?: string } {
  const length = value?.length || 0
  
  if (length < min) {
    return {
      valid: false,
      message: `长度不能少于${min}个字符`
    }
  }
  
  if (max && length > max) {
    return {
      valid: false,
      message: `长度不能超过${max}个字符`
    }
  }
  
  return { valid: true }
}

/**
 * 验证正则模式
 * @param value 值
 * @param pattern 正则表达式
 * @param message 错误消息
 * @returns 验证结果
 */
export function validatePattern(
  value: string, 
  pattern: RegExp, 
  message: string
): { valid: boolean; message?: string } {
  const valid = pattern.test(value)
  return {
    valid,
    message: valid ? undefined : message
  }
}

/**
 * 验证身份证号
 * @param idCard 身份证号
 * @returns 是否为有效身份证号
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return idCardRegex.test(idCard)
}

/**
 * 验证银行卡号
 * @param cardNumber 银行卡号
 * @returns 是否为有效银行卡号
 */
export function isValidBankCard(cardNumber: string): boolean {
  const cardRegex = /^\d{16,19}$/
  return cardRegex.test(cardNumber)
}