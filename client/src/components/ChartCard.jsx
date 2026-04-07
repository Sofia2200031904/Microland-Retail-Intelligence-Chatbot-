import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatInrAmount, formatNumber } from "../utils/formatters";

const fallbackColors = ["#3453ff", "#1789ff", "#13c7ff", "#7aa9ff", "#5d6eff"];
const currencyKeys = new Set(["revenue", "value", "profit", "loss", "cost", "net"]);

function formatChartValue(value, key) {
  if (currencyKeys.has(key)) {
    return formatInrAmount(value);
  }

  return formatNumber(value);
}

export default function ChartCard({
  chart,
  variant = "default",
  heightClassName = "h-64",
}) {
  if (!chart?.data?.length) {
    return null;
  }

  const series = chart.series || [];
  const usesCurrency =
    chart.type === "pie" || series.some((item) => currencyKeys.has(item.key));
  const tickFormatter = (value) =>
    usesCurrency ? formatInrAmount(value) : formatNumber(value);
  const cardClassName =
    variant === "dashboard"
      ? "min-w-0 rounded-[30px] border border-[#d7e7ff] bg-white p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)]"
      : "mt-4 min-w-0 rounded-[26px] border border-[#d7e7ff] bg-white p-4 shadow-sm";

  return (
    <div className={cardClassName}>
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-[#1a2942]">{chart.title}</h4>
        <p className="text-xs text-[#7386a4]">{chart.description}</p>
      </div>

      <div className={`${heightClassName} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === "line" ? (
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis dataKey={chart.xKey} stroke="#7b8eac" />
              <YAxis
                yAxisId="currency"
                stroke="#1789ff"
                tickFormatter={(value) => formatInrAmount(value)}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                stroke="#3453ff"
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip formatter={(value, key) => formatChartValue(value, key)} />
              <Legend />
              {series.map((item) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  yAxisId={item.key === "revenue" ? "currency" : "count"}
                  stroke={item.color}
                  strokeWidth={3}
                />
              ))}
            </LineChart>
          ) : chart.type === "pie" ? (
            <PieChart>
              <Tooltip formatter={(value, key) => formatChartValue(value, key)} />
              <Legend />
              <Pie
                data={chart.data}
                dataKey={chart.dataKey}
                nameKey={chart.xKey}
                innerRadius={48}
                outerRadius={78}
                paddingAngle={4}
              >
                {chart.data.map((entry, index) => (
                  <Cell
                    key={`${entry[chart.xKey]}-${index}`}
                    fill={fallbackColors[index % fallbackColors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis dataKey={chart.xKey} stroke="#7b8eac" />
              <YAxis stroke="#7b8eac" tickFormatter={tickFormatter} />
              <Tooltip formatter={(value, key) => formatChartValue(value, key)} />
              <Legend />
              {series.map((item) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  fill={item.color}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
