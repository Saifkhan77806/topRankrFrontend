import { Users, UsersRound } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CandidateProfile } from "@/types/candidate"

interface LeadershipProps {
  leadership: CandidateProfile["leadership"]
}

export function Leadership({ leadership }: LeadershipProps) {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Leadership</CardTitle>
      </CardHeader>
      <CardContent>
        {!leadership ? (
          <p className="text-sm text-muted-foreground">No leadership data available</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <UsersRound className="size-4 text-muted-foreground" />
              <Badge variant={leadership.has_leadership ? "default" : "outline"}>
                {leadership.has_leadership ? "Has leadership experience" : "No leadership experience"}
              </Badge>
            </div>

            {leadership.has_leadership && typeof leadership.team_size === "number" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                Managed a team of {leadership.team_size}
              </div>
            )}

            {typeof leadership.management_experience === "boolean" && (
              <p className="text-sm text-muted-foreground">
                {leadership.management_experience
                  ? "Has formal management experience"
                  : "No formal management experience"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
