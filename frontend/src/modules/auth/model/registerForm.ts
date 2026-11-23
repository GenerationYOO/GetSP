export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type RegisterValidationErrors = Record<string, string[]>;