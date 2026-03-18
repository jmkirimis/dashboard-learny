import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function CustomPieChart() {
  return (
    <div className="flex items-center justify-center">
      <ResponsiveContainer width="55%" height={150}>
        <PieChart>
          <Pie
            data={pieData}
            cx="40%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda customizada */}
      <div className="flex flex-col gap-2 ml-4">
        {pieData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
