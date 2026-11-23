import type { LoginFormData, LoginFormErrors, LoginValidationErrors } from './loginForm';

export function getBackendErrors(
  validationErrors: LoginValidationErrors | undefined
): LoginFormErrors {
  if (!validationErrors) {
    return {};
  }

  const getError = (field: string): string | undefined => {
    const messages = validationErrors[field] ??
      validationErrors[field.toLowerCase()];
    return messages?.join(' ');
  };

  return {
    email: getError('Email'),
    password: getError('Password')
  };
}

type ValidateFormResult = {
  isValid: boolean;
  errors: LoginFormErrors;
}

export function validateForm(formData: LoginFormData): ValidateFormResult {
  const newErrors: LoginFormErrors = {};
  if (!formData.email.trim()) {
    newErrors.email = 'Введите вашу электронную почту';
  }
  if (!formData.password.trim()) {
    newErrors.password = 'Введите ваш пароль';
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
}