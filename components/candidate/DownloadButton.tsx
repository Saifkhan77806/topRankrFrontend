"use client"

import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useResume } from "@/hooks/use-resume"

interface DownloadButtonProps {
  candidateId: number
  candidateName: string | null
}

export function DownloadButton({ candidateId, candidateName }: DownloadButtonProps) {
  const { objectUrl, isPending, isError } = useResume(candidateId, true)

  const handleDownload = () => {
    if (!objectUrl) return

    const filename = `${candidateName?.trim() || `candidate-${candidateId}`}-resume.pdf`
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={isPending || isError || !objectUrl}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <Download />}
      {isPending ? "Loading..." : "Download"}
    </Button>
  )
}
