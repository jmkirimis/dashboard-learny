import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function CustomBarChart({ data }: Props) {
  const CHART_COLORS = ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#FDE68A"];
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data} barSize={40} margin={{ left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis dataKey="name" />

        <YAxis allowDecimals={false} />

        <Tooltip />

        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}