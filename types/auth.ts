export type Role = "recruiter" | "admin"

export interface User {
  id: number
  email: string
  role: Role
  active: boolean
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: "bearer"
  role: Role
  email: string
}

export interface RegisterRequest {
  email: string
  password: string
  role?: Role
}
