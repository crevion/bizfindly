export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface CountryOption {
  code: string;
  flag: string;
  name: string;
}

export interface RegisterPayload {
  phone: string;
  name?: string;
  password: string;
  password_confirm: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface ResetPasswordPayload {
  phone: string;
  code: string;
  password: string;
  password_confirm: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  password: string;
  password_confirm: string;
}

export interface TokenResponse {
  token: string;
}

export interface MessageResponse {
  message: string;
}
