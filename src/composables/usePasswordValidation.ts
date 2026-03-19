import { ref } from 'vue';

/**
 * 密碼驗證規則介面
 */
export interface PasswordValidationRule {
  test: (password: string) => boolean;
  message: string;
}

/**
 * 密碼驗證結果介面
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 密碼驗證規則定義
 * 要求：至少 8 個字元、包含大小寫英文、包含數字
 */
export const passwordRules: PasswordValidationRule[] = [
  {
    test: (pwd) => pwd.length >= 8,
    message: '至少 8 個字元',
  },
  {
    test: (pwd) => /[a-z]/.test(pwd),
    message: '包含小寫英文字母',
  },
  {
    test: (pwd) => /[A-Z]/.test(pwd),
    message: '包含大寫英文字母',
  },
  {
    test: (pwd) => /[0-9]/.test(pwd),
    message: '包含數字',
  },
];

/**
 * 密碼驗證 Composable
 * 提供密碼格式驗證和即時反饋功能
 */
export function usePasswordValidation() {
  const password = ref('');
  const confirmPassword = ref('');

  /**
   * 驗證單一密碼格式
   * @param pwd 要驗證的密碼
   * @returns 驗證結果（是否有效、錯誤訊息列表）
   */
  const validatePassword = (pwd: string): PasswordValidationResult => {
    const errors = passwordRules.filter((rule) => !rule.test(pwd)).map((rule) => rule.message);

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  /**
   * 驗證兩次密碼是否一致
   * @param pwd1 第一次輸入的密碼
   * @param pwd2 第二次輸入的密碼
   * @returns 是否一致
   */
  const validatePasswordMatch = (pwd1: string, pwd2: string): boolean => {
    return pwd1 === pwd2 && pwd1.length > 0;
  };

  /**
   * 檢查新密碼是否與舊密碼相同
   * @param oldPwd 舊密碼
   * @param newPwd 新密碼
   * @returns 是否相同
   */
  const isSameAsOldPassword = (oldPwd: string, newPwd: string): boolean => {
    return oldPwd === newPwd && oldPwd.length > 0;
  };

  return {
    password,
    confirmPassword,
    passwordRules,
    validatePassword,
    validatePasswordMatch,
    isSameAsOldPassword,
  };
}
