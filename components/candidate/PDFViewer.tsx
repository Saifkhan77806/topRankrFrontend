"use client"

import { FileWarning } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useResume } from "@/hooks/use-resume"
import { ApiError } from "@/lib/api-client"

interface PDFViewerProps {
  candidateId: number
  candidateName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PDFViewer({ candidateId, candidateName, open, onOpenChange }: PDFViewerProps) {
  const { objectUrl, isPending, isError, error } = useResume(candidateId, open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-w-3xl flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{candidateName}&apos;s resume</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border/60">
          {isPending && <Skeleton className="h-full w-full" />}

          {isError && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
              <Alert variant="destructive" className="max-w-sm">
                <FileWarning />
                <AlertTitle>
                  {error instanceof ApiError && error.status === 404
                    ? "Resume not found"
                    : "Could not load resume"}
                </AlertTitle>
                <AlertDescription>
                  {error instanceof ApiError
                    ? error.message
                    : "Something went wrong while fetching this resume."}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!isPending && !isError && objectUrl && (
            <embed
              src={objectUrl}
              type="application/pdf"
              className="h-full w-full flex-1"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
