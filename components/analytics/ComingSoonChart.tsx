import { Construction } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComingSoonChartProps {
  title: string
  explanation: string
}

export function ComingSoonChart({ title, explanation }: ComingSoonChartProps) {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted">
          <Construction className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Coming soon</p>
        <p className="max-w-xs text-sm text-muted-foreground">{explanation}</p>
      </CardContent>
    </Card>
  )
}
