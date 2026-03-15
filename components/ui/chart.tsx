"use client";

import {
  Area,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type TrendSeries = {
  key: string;
  name?: string;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  type?: "line" | "area";
};

const defaultPalette = ["hsl(var(--primary))", "#22c55e", "#2563eb", "#f97316", "#38bdf8", "#c084fc"];

export type TrendChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  height?: number;
  series: TrendSeries[];
  tooltipFormatter?: (value: number) => string;
  hideGrid?: boolean;
};

export function TrendChart({ data, xKey, series, height = 260, tooltipFormatter, hideGrid }: TrendChartProps) {
  if (!series.length || !data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-3xl border border-white/5 bg-[#050505] text-sm text-slate-500">
        Chart data not available
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-[#050505] p-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {!hideGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            stroke="rgba(255,255,255,0.5)"
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.75)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            stroke="rgba(255,255,255,0.5)"
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.75)" }}
          />
          <Tooltip
            animationDuration={150}
            formatter={(value) => {
              if (typeof value === "number") {
                return tooltipFormatter?.(value) ?? `${value}`;
              }
              return value as string;
            }}
            contentStyle={{
              backgroundColor: "#0a0a0a",
              borderColor: "rgba(255,255,255,0.1)",
              color: "#fff"
            }}
          />
          {series.map((serie, index) => {
            const color = serie.color ?? defaultPalette[index % defaultPalette.length];
            const strokeWidth = serie.strokeWidth ?? 2;

            if (serie.type === "area") {
              return (
                <Area
                  key={serie.key}
                  dataKey={serie.key}
                  stroke={color}
                  fill={serie.fill ?? `${color}33`}
                  strokeWidth={strokeWidth}
                />
              );
            }

            return (
              <Line
                key={serie.key}
                type="monotone"
                dataKey={serie.key}
                stroke={color}
                strokeWidth={strokeWidth}
                dot={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export type DonutChartProps = {
  data: { name: string; value: number }[];
  palette?: string[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  tooltipFormatter?: (value: number) => string;
};

export function DonutChart({
  data,
  palette = defaultPalette,
  height = 240,
  innerRadius = 70,
  outerRadius = 110,
  tooltipFormatter
}: DonutChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-3xl border border-white/5 bg-[#050505] text-sm text-slate-500">
        No breakdown data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip
          formatter={(value) => {
            if (typeof value === "number") {
              return tooltipFormatter?.(value) ?? `${value}`;
            }
            return value as string;
          }}
          contentStyle={{
            backgroundColor: "#0a0a0a",
            borderColor: "rgba(255,255,255,0.1)",
            color: "#fff"
          }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={4}
          blendStroke
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={palette[index % palette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
