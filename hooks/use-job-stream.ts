import { useEffect, useRef, useState } from "react"
import type { JobProgressEvent, StreamErrorEvent } from "@/types/search"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const TERMINAL_STATUSES = new Set(["completed", "failed"])

interface UseJobStreamResult {
  status: string | null
  progress: number
  currentStep: string | null
  error: string | null
  isConnected: boolean
}

const INITIAL_STATE = {
  status: null as string | null,
  progress: 0,
  currentStep: null as string | null,
  error: null as string | null,
  isConnected: false,
}

export function useJobStream(jobId: number | null): UseJobStreamResult {
  const [state, setState] = useState(INITIAL_STATE)
  const [trackedJobId, setTrackedJobId] = useState(jobId)
  const retryCount = useRef(0)

  // Reset state during render (not in an effect) when jobId changes —
  // this is React's documented pattern for keying state to a prop
  // without triggering an extra render from a setState-in-effect.
  if (jobId !== trackedJobId) {
    setTrackedJobId(jobId)
    setState(INITIAL_STATE)
  }

  useEffect(() => {
    if (!jobId) return

    retryCount.current = 0

    let eventSource: EventSource | null = null
    let disposed = false

    function connect() {
      eventSource = new EventSource(`${API_URL}/recruiter/stream/${jobId}`)

      eventSource.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true }))
        retryCount.current = 0
      }

      eventSource.onmessage = (event) => {
        try {
          const payload: JobProgressEvent = JSON.parse(event.data)
          const isTerminal = TERMINAL_STATUSES.has(payload.status)

          if (isTerminal) eventSource?.close()

          setState((prev) => ({
            ...prev,
            status: payload.status,
            progress: payload.progress,
            currentStep: payload.current_step,
            isConnected: isTerminal ? false : prev.isConnected,
          }))
        } catch {
          // ignore malformed frame
        }
      }

      eventSource.addEventListener("error", (event) => {
        const messageEvent = event as MessageEvent
        if (messageEvent.data) {
          let message = "Something went wrong while tracking search progress."
          try {
            const payload: StreamErrorEvent = JSON.parse(messageEvent.data)
            message = payload.error
          } catch {
            // use default message
          }
          eventSource?.close()
          setState((prev) => ({ ...prev, error: message, isConnected: false }))
          return
        }

        // Native EventSource connection error (network drop, not a
        // server-sent `event: error` frame). Retry a few times before
        // surfacing a "connection lost" state to the user.
        eventSource?.close()
        setState((prev) => ({ ...prev, isConnected: false }))

        if (disposed) return

        if (retryCount.current < 3) {
          retryCount.current += 1
          setTimeout(() => {
            if (!disposed) connect()
          }, 1500 * retryCount.current)
        } else {
          setState((prev) => ({
            ...prev,
            error: "Lost connection to the search progress stream.",
          }))
        }
      })
    }

    connect()

    return () => {
      disposed = true
      eventSource?.close()
    }
  }, [jobId])

  return state
}
