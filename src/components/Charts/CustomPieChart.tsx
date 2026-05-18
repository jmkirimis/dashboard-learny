import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function CustomPieChart({ data }: Props) {
  const CHART_COLORS = ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#FDE68A"];
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2">
        {data.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <div
              className="h-3 w-3 rounded"
              style={{
                backgroundColor:
                  CHART_COLORS[index % CHART_COLORS.length],
              }}
            />

            <span className="text-sm text-gray-600">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}