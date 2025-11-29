import { LoginRequest, type LoginResponse } from "@/schemas/auth/login";
import { type RegisterRequest } from "@/schemas/auth/register";
import { http } from "@/lib/http";
import { type IBackendRes } from "@/types/glubal";

const AUTH_PATH = "/auth";

export const authService = {
  login: (payload: LoginRequest) =>
    http.post<IBackendRes<LoginResponse>>(`${AUTH_PATH}/login`, payload),
  register: (payload: RegisterRequest) =>
    http.post<IBackendRes<unknown>>(`${AUTH_PATH}/register`, payload),
};
