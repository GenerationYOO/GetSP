import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useAuth } from '../../../shared/auth/useAuth'
import { getBackendErrors, validateForm } from '../models/loginValidation'
import type { LoginFormData, LoginFormErrors, LoginValidationErrors } from '../models/loginForm'

export function useLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState<string>();
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateForm(formData);
    setErrors(result.errors);
    setFormError(undefined);
    const isValid = result.isValid;

    if (isValid) {
      try {
        await login(
          formData.email,
          formData.password,
          formData.rememberMe
        );
        navigate("/create-session");
      } catch (error) {
        console.error('Ошибка при входе:', error);

        if (isAxiosError(error)) {
          const data = error.response?.data;
          const validationErrors = data?.errors as LoginValidationErrors | undefined;
          const fieldErrors = getBackendErrors(validationErrors);
          const generalError = data?.message ||
            Object.values(validationErrors ?? {}).flat().join(' ') ||
            'Ошибка входа';

          setErrors(prev => ({
            ...prev,
            ...fieldErrors
          }));
          setFormError(
            Object.keys(fieldErrors).length === 0 ? generalError : undefined
          );
        } else if (error instanceof Error) {
          setFormError(error.message);
        } else {
          setFormError('Неизвестная ошибка');
        }
      }
    }
  }

  function handleEmailChange(value: string) {
    setFormError(undefined);
    setFormData(prev => ({
      ...prev,
      email: value
    }));
    if (value.trim() && touched.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  }

  function handleEmailBlur() {
    setTouched(prev => ({
      ...prev,
      email: true
    }));

    if (!formData.email.trim()) {
      setErrors(prev => ({
        ...prev,
        email: 'Введите вашу электронную почту'
      }));
    }
  }

  function handlePasswordChange(value: string) {
    setFormError(undefined);
    setFormData(prev => ({
      ...prev,
      password: value
    }))
    if (value.trim() && touched.password) {
      setErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  }

  function handlePasswordBlur() {
    setTouched(prev => ({
      ...prev,
      password: true
    }));
    if (!formData.password.trim()) {
      setErrors(prev => ({
        ...prev,
        password: 'Введите ваш пароль'
      }));
    }
  }

  function handleCheckboxChange(checked: boolean) {
    setFormError(undefined);
    setFormData(prev => ({
      ...prev,
      rememberMe: checked
    }))
  }

  return {
    formData,
    errors,
    formError,
    handleLogin,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleCheckboxChange
  }
}