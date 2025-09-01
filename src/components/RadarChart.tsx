'use client';

import { PolarGrid, PolarAngleAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface RadarChartProps {
  data: { skill: string; value: number }[];
}

const chartConfig = {
  value: {
    label: 'Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function RadarChart({ data }: RadarChartProps) {
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
      <ResponsiveContainer>
        <RechartsRadarChart data={data}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <PolarAngleAxis dataKey="skill" />
          <PolarGrid />
          <Radar
            dataKey="value"
            fill="var(--color-value)"
            fillOpacity={0.6}
            dot={{
              r: 4,
              fillOpacity: 1,
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
