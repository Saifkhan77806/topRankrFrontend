"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FeedbackStats } from "@/types/recruiter"

interface FeedbackChartProps {
  stats: FeedbackStats
}

const BAR_COLORS: Record<string, string> = {
  Shortlisted: "#8b5cf6",
  Rejected: "#f43f5e",
  Interviewed: "#f59e0b",
  Hired: "#10b981",
}

export function FeedbackChart({ stats }: FeedbackChartProps) {
  const data = [
    { label: "Shortlisted", count: stats.shortlisted },
    { label: "Rejected", count: stats.rejected },
    { label: "Interviewed", count: stats.interviewed },
    { label: "Hired", count: stats.hired },
  ]

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Feedback breakdown</CardTitle>
        <p className="text-xs text-muted-foreground">
          Raw feedback counts recorded system-wide.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={BAR_COLORS[entry.label]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
