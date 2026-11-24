import type { RegisterFormData, RegisterFormErrors, RegisterValidationErrors } from "./registerForm";

export function getBackendErrors(
  errors: RegisterValidationErrors | undefined
): RegisterFormErrors {
  if (!errors) {
    return {};
  }

  const getError = (field: string): string | undefined => {
    const messages = errors[field] ?? errors[field.toLowerCase()];
    return messages?.join(' ');
  };

  return {
    name: getError('Name'),
    email: getError('Email'),
    password: getError('Password')
  };
}

export function getPasswordError(password: string): string | undefined {
  if (!password) {
    return 'Введите ваш пароль';
  }

  if (password.length < 8) {
    return 'Минимальная длина пароля - 8';
  }

  return undefined;
}

export function getConfirmPasswordError(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) {
    return 'Повторите ваш пароль';
  }

  if (password !== confirmPassword) {
    return 'Пароли не совпадают';
  }

  return undefined;
}

export type RegisterFormValidationResult = {
  isValid: boolean;
  errors: RegisterFormErrors;
};

export function validateForm(
  formData: RegisterFormData
): RegisterFormValidationResult {
  const newErrors: RegisterFormErrors = {};
  const passwordError = getPasswordError(formData.password);
  const confirmPasswordError = getConfirmPasswordError(
    formData.password,
    formData.confirmPassword
  );

  if (passwordError) {
    newErrors.password = passwordError;
  }
  if (confirmPasswordError) {
    newErrors.confirmPassword = confirmPasswordError;
  }
  if (!formData.name.trim()) {
    newErrors.name = 'Введите ваше имя';
  }
  if (!formData.email.trim()) {
    newErrors.email = 'Введите вашу электронную почту';
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
}