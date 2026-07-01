import { apiClient } from "@/lib/api-client"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types/auth"

export const authService = {
  register: (data: RegisterRequest) =>
    apiClient.post<LoginResponse>("/auth/register", data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>("/auth/login", data),

  getMe: () => apiClient.get<User>("/auth/me", { auth: true }),
}
