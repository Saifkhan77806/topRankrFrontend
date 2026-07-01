import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ComparisonResponse, ComparisonCandidate } from "@/types/comparison"

interface ComparisonGridProps {
  comparison: ComparisonResponse
}

type RowDef = {
  label: string
  render: (candidate: ComparisonCandidate) => React.ReactNode
}

const ROWS: RowDef[] = [
  { label: "Experience", render: (c) => `${c.experience} yrs` },
  { label: "Industry", render: (c) => c.industry || "—" },
  { label: "Seniority", render: (c) => c.seniority || "—" },
  {
    label: "Semantic score",
    render: (c) => <Badge variant="secondary">{Math.round(c.semantic_score)}%</Badge>,
  },
  {
    label: "Ranking score",
    render: (c) => <Badge variant="secondary">{Math.round(c.ranking_score)}%</Badge>,
  },
  {
    label: "Skills",
    render: (c) =>
      c.skills.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {c.skills.map((skill, i) => (
            <Badge key={i} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      ) : (
        "—"
      ),
  },
  {
    label: "Leadership",
    render: (c) =>
      c.leadership.length > 0 ? (
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          {c.leadership.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        "—"
      ),
  },
  {
    label: "AI reasoning",
    render: (c) => <span className="text-sm text-muted-foreground">{c.ai_reason || "—"}</span>,
  },
]

export function ComparisonGrid({ comparison }: ComparisonGridProps) {
  const candidates = comparison.comparison

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Candidate</TableHead>
            {candidates.map((candidate) => (
              <TableHead
                key={candidate.candidate_id}
                className={cn(
                  "min-w-48 whitespace-normal align-top",
                  candidate.candidate_id === comparison.winner.winner &&
                    "bg-primary/5 text-primary"
                )}
              >
                {candidate.name}
                {candidate.candidate_id === comparison.winner.winner && (
                  <Badge className="ml-2">Winner</Badge>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium text-muted-foreground">{row.label}</TableCell>
              {candidates.map((candidate) => (
                <TableCell
                  key={candidate.candidate_id}
                  className={cn(
                    "whitespace-normal align-top",
                    candidate.candidate_id === comparison.winner.winner && "bg-primary/5"
                  )}
                >
                  {row.render(candidate)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
