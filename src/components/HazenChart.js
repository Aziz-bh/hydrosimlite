import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function HazenChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div id="chart-hazen" className="mb-4">
      <h5>Flow Rate vs Head Loss</h5>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="flow"
          label={{
            value: "Flow (m³/s)",
            position: "insideBottomRight",
            offset: -5,
          }}
        />
        <YAxis
          label={{
            value: "Head Loss (m)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="headLoss"
          stroke="#28a745" // Bootstrap green
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
}

export default HazenChart;
