export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};
export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export type LoginValidationErrors = Record<string, string[]>;

