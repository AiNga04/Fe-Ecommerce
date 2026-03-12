export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string // Usually frontend only, but good to have type if we validate before sending
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otpCode: string
  newPassword: string
}

export interface ChangeEmailRequest {
  newEmail: string
}

export interface ResendActivationRequest {
  email: string
}
