import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { CandidateProfile } from "@/types/candidate"

interface ProjectsProps {
  projects: CandidateProfile["projects"]
}

export function Projects({ projects }: ProjectsProps) {
  const entries = Array.isArray(projects) ? projects : []

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Projects</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">No project data extracted</p>
        )}

        {entries.map((entry, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            {index > 0 && <Separator className="mb-2.5" />}
            <span className="text-sm font-medium text-foreground">
              {entry.name || "Untitled project"}
            </span>
            {entry.description && (
              <p className="text-sm text-muted-foreground">{entry.description}</p>
            )}
            {Array.isArray(entry.technologies) && entry.technologies.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {entry.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="outline">
                    {tech}
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
