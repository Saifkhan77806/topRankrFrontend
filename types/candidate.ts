export interface CandidateProfile {
  personal?: {
    name?: string
    email?: string
    phone?: string
    location?: string
  }
  professional?: {
    current_title?: string
    total_experience_years?: number
    industry?: string
    seniority?: string
    domain_expertise?: string[]
  }
  skills?: {
    technical?: string[]
    tools?: string[]
    soft_skills?: string[]
    languages?: string[]
  }
  education?: Array<{
    degree?: string
    field?: string
    institution?: string
    year?: string
  }>
  experience?: Array<{
    company?: string
    role?: string
    duration?: string
    description?: string
    skills_used?: string[]
  }>
  projects?: Array<{
    name?: string
    description?: string
    technologies?: string[]
  }>
  certifications?: string[]
  leadership?: {
    has_leadership?: boolean
    team_size?: number
    management_experience?: boolean
  }
  achievements?: string[]
}

export interface CandidateDetail {
  id: number
  name: string | null
  email: string | null
  phone: string | null
  current_title: string | null
  experience_years: number | null
  industry: string | null
  summary: string
  resume_path: string
  profile: CandidateProfile
}

export interface CandidateDetailResponse {
  success: boolean
  data?: CandidateDetail
  message?: string
}
