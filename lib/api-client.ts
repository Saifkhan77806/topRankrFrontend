const API_URL = process.env.NEXT_PUBLIC_API_URL

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem("toprankr-auth")
    if (!raw) return null
    return JSON.parse(raw)?.state?.token ?? null
  } catch {
    return null
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...rest } = options

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (auth) {
    const token = getStoredToken()
    if (token) {
      ;(finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const body = await res.json()
      message = body?.detail ?? body?.message ?? message
    } catch {
      // response had no JSON body
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
}
