export interface SearchRequest {
  job_description: string
  top_k?: number
}

export interface SearchSubmitResponse {
  job_id: number
  status: "pending"
}

export interface JobProgressEvent {
  job_id: number
  status: string
  progress: number
  current_step: string
}

export interface StreamErrorEvent {
  error: string
}
