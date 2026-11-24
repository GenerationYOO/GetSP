import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { registerUser } from "../api/register";
import type {
  RegisterFormData,
  RegisterFormErrors,
  RegisterValidationErrors
} from "../model/registerForm";
import {
  validateForm,
  getPasswordError,
  getConfirmPasswordError,
  getBackendErrors
} from "../model/registerValidation";

export function useRegisterForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [formError, setFormError] = useState<string>();

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateForm(formData);
    setErrors(result.errors);
    setFormError(undefined);
    const isValid = result.isValid;

    if (isValid) {
      try {
        await registerUser(formData.name, formData.email, formData.password);
        navigate('/login');
      } catch (error) {
        console.error('Ошибка при регистрации:', error);

        if (isAxiosError(error)) {
          const data = error.response?.data;
          const validationErrors = data?.errors as RegisterValidationErrors | undefined;
          const fieldErrors = getBackendErrors(validationErrors);
          const generalError = data?.message ||
            Object.values(validationErrors ?? {}).flat().join(' ') ||
            'Ошибка регистрации';

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

  function handleNameChange(value: string) {
    setFormData(prev => ({ ...prev, name: value }));
    setFormError(undefined);

    if (touched.name) {
      setErrors(prev => ({
        ...prev,
        name: value.trim() ? undefined : 'Введите ваше имя'
      }));
    }
  }

  function handleNameBlur() {
    setTouched(prev => ({ ...prev, name: true }));

    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Введите ваше имя' }));
    }
  }

  function handleEmailChange(value: string) {
    setFormData(prev => ({ ...prev, email: value }));
    setFormError(undefined);

    if (touched.email) {
      setErrors(prev => ({
        ...prev,
        email: value.trim() ? undefined : 'Введите вашу электронную почту'
      }));
    }
  }

  function handleEmailBlur() {
    setTouched(prev => ({ ...prev, email: true }));

    if (!formData.email.trim()) {
      setErrors(prev => ({
        ...prev,
        email: 'Введите вашу электронную почту'
      }));
    }
  }

  function handlePasswordChange(value: string) {
    setFormData(prev => ({ ...prev, password: value }));
    setFormError(undefined);

    if (touched.password || touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        password: touched.password ? getPasswordError(value) : prev.password,
        confirmPassword: touched.confirmPassword
          ? getConfirmPasswordError(value, formData.confirmPassword)
          : prev.confirmPassword
      }));
    }
  }

  function handlePasswordBlur() {
    setTouched(prev => ({ ...prev, password: true }));
    setErrors(prev => ({
      ...prev,
      password: getPasswordError(formData.password)
    }));
  }

  function handleConfirmPasswordChange(value: string) {
    setFormData(prev => ({ ...prev, confirmPassword: value }));
    setFormError(undefined);

    if (touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: getConfirmPasswordError(formData.password, value)
      }));
    }
  }

  function handleConfirmPasswordBlur() {
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    setErrors(prev => ({
      ...prev,
      confirmPassword: getConfirmPasswordError(
        formData.password,
        formData.confirmPassword
      )
    }));
  }

  return {
    formData,
    errors,
    formError,
    handleRegister,
    handleNameChange,
    handleNameBlur,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordChange,
    handleConfirmPasswordBlur,
  };
}