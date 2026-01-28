export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string // Usually frontend only, but good to have type if we validate before sending
}
