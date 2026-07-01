import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { CandidateProfile } from "@/types/candidate"

interface ExperienceProps {
  experience: CandidateProfile["experience"]
}

export function Experience({ experience }: ExperienceProps) {
  const entries = Array.isArray(experience) ? experience : []

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Experience</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">No experience data extracted</p>
        )}

        {entries.map((entry, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            {index > 0 && <Separator className="mb-2.5" />}
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="text-sm font-medium text-foreground">
                {entry.role || "Unknown role"}
                {entry.company ? ` · ${entry.company}` : ""}
              </span>
              {entry.duration && (
                <span className="text-xs text-muted-foreground">{entry.duration}</span>
              )}
            </div>
            {entry.description && (
              <p className="text-sm text-muted-foreground">{entry.description}</p>
            )}
            {Array.isArray(entry.skills_used) && entry.skills_used.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {entry.skills_used.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
