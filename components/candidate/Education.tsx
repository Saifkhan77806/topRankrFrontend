import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CandidateProfile } from "@/types/candidate"

interface EducationProps {
  education: CandidateProfile["education"]
}

export function Education({ education }: EducationProps) {
  const entries = Array.isArray(education) ? education : []

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Education</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">No education data extracted</p>
        )}

        {entries.map((entry, index) => (
          <div key={index} className="flex flex-col gap-1">
            {index > 0 && <Separator className="mb-2.5" />}
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="text-sm font-medium text-foreground">
                {[entry.degree, entry.field].filter(Boolean).join(" in ") || "Unknown degree"}
              </span>
              {entry.year && (
                <span className="text-xs text-muted-foreground">{entry.year}</span>
              )}
            </div>
            {entry.institution && (
              <p className="text-sm text-muted-foreground">{entry.institution}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
