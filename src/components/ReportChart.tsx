import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const GOLD = '#C89B3C';

const PALETTE = [
  '#C89B3C', // gold
  '#3B5B7C', // slate blue
  '#5B9279', // muted green
  '#B0703C', // muted amber
  '#7C6BA6', // muted violet
  '#4C8FA6', // muted teal-blue
  '#A65B6B', // muted rose
  '#8A9B5C', // muted olive
  '#6B7C93', // steel
  '#AD8A4C', // bronze
];

const STATUS_COLORS: Record<string, string> = {
  active: '#E8A11E',
  returned: '#4C9A6A',
  overdue: '#C4514A',
};

const BAR_WIDTH = 56;
const MIN_BARS_BEFORE_SCROLL = 10;

interface Props {
  type: 'bar' | 'line' | 'pie';
  data: { name: string; value: number }[];
  height?: number;
}

export default function ReportChart({ type, data, height = 280 }: Props) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-dashed border-border bg-background text-sm text-text-secondary"
        style={{ minHeight: height }}
      >
        No report data yet
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="46%"
            innerRadius={56}
            outerRadius={80}
            paddingAngle={3}
            cornerRadius={4}
            labelLine={false}
            label={({ value }) => String(value)}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={STATUS_COLORS[entry.name.toLowerCase()] ?? PALETTE[i % PALETTE.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: 16 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={8} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={GOLD} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  const needsScroll = data.length > MIN_BARS_BEFORE_SCROLL;
  const chartWidth = needsScroll ? data.length * BAR_WIDTH : undefined;

  const chart = (
    <BarChart
      data={data}
      width={chartWidth}
      height={needsScroll ? height : undefined}
      margin={{ top: 8, right: 16, bottom: 40, left: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis
        dataKey="name"
        tick={{ fontSize: 12 }}
        tickMargin={8}
        interval={0}
        height={70}
        angle={-35}
        textAnchor="end"
        tickFormatter={(name: string) => (name.length > 14 ? `${name.slice(0, 14)}…` : name)}
      />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
      </Bar>
    </BarChart>
  );

  if (needsScroll) {
    return (
      <div className="overflow-x-auto">
        <div style={{ width: chartWidth, height }}>
          {chart}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {chart}
    </ResponsiveContainer>
  );
}
