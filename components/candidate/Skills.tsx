import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CandidateProfile } from "@/types/candidate"

interface SkillsProps {
  skills: CandidateProfile["skills"]
}

const SKILL_GROUPS: Array<{
  key: keyof NonNullable<CandidateProfile["skills"]>
  label: string
}> = [
  { key: "technical", label: "Technical skills" },
  { key: "tools", label: "Tools" },
  { key: "soft_skills", label: "Soft skills" },
  { key: "languages", label: "Languages" },
]

export function Skills({ skills }: SkillsProps) {
  const groups = SKILL_GROUPS.filter(
    (group) => Array.isArray(skills?.[group.key]) && skills![group.key]!.length > 0
  )

  if (groups.length === 0) return null

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {group.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skills![group.key]!.map((item, index) => (
                <Badge key={`${group.key}-${index}`} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
