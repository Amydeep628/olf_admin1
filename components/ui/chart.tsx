"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
import { useTheme } from "next-themes";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>[];
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

interface PieChartProps extends Omit<ChartProps, "categories"> {
  category: string;
}

// Custom Tooltip Component
const CustomTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
}: TooltipProps<any, any> & { valueFormatter?: (value: number) => string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.name}: {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AreaChart({
  data,
  categories,
  index,
  colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  className,
  ...props
}: ChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "hsl(var(--border))" : "hsl(var(--border))"}
              opacity={0.3}
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              axisLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
            />
          )}
          {showYAxis && (
            <YAxis
              tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              axisLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              tickFormatter={valueFormatter}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />}
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              fill={`hsl(var(--${colors[i % colors.length]}))`}
              stroke={`hsl(var(--${colors[i % colors.length]}))`}
              fillOpacity={0.2}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({
  data,
  categories,
  index,
  colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  className,
  ...props
}: ChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "hsl(var(--border))" : "hsl(var(--border))"}
              opacity={0.3}
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              axisLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
            />
          )}
          {showYAxis && (
            <YAxis
              tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              axisLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              tickFormatter={valueFormatter}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />}
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={`hsl(var(--${colors[i % colors.length]}))`}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({
  data,
  categories,
  index,
  colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  className,
  ...props
}: ChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "hsl(var(--border))" : "hsl(var(--border))"}
              opacity={0.3}
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              axisLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
            />
          )}
          {showYAxis && (
            <YAxis
              tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              axisLine={{ stroke: isDark ? "hsl(var(--border))" : "hsl(var(--border))" }}
              tickFormatter={valueFormatter}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />}
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={`hsl(var(--${colors[i % colors.length]}))`}
              strokeWidth={2}
              dot={{ fill: `hsl(var(--${colors[i % colors.length]}))`, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({
  data,
  category,
  index,
  colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showTooltip = true,
  className,
  ...props
}: PieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={category}
            nameKey={index}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(var(--${colors[index % colors.length]}))`}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />}
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}