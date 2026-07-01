"use client"

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import type { ComparisonCandidate } from "@/types/comparison"

interface RadarChartProps {
  candidates: ComparisonCandidate[]
}

const CHART_COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#ec4899", "#22c55e", "#a855f7"]

export function RadarChart({ candidates }: RadarChartProps) {
  const maxExperience = Math.max(1, ...candidates.map((c) => c.experience))

  const axes = ["Semantic score", "Ranking score", "Experience (normalized)"]

  const data = axes.map((axis) => {
    const row: Record<string, string | number> = { axis }
    candidates.forEach((candidate) => {
      let value: number
      if (axis === "Semantic score") value = candidate.semantic_score
      else if (axis === "Ranking score") value = candidate.ranking_score
      else value = (candidate.experience / maxExperience) * 100

      row[candidate.name] = Math.round(value)
    })
    return row
  })

  return (
    <div className="flex flex-col gap-2">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            {candidates.map((candidate, index) => (
              <Radar
                key={candidate.candidate_id}
                name={candidate.name}
                dataKey={candidate.name}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.15}
              />
            ))}
            <Legend />
            <Tooltip />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground">
        Experience is normalized to 0–100 relative to the highest experience among
        the compared candidates — it is not a percentage.
      </p>
    </div>
  )
}
