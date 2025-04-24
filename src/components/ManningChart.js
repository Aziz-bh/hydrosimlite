import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function ManningChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div id="chart-manning" className="mb-4">
      <h5>Depth vs Discharge</h5>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="depth"
          label={{
            value: "Depth (m)",
            position: "insideBottomRight",
            offset: -5,
          }}
        />
        <YAxis
          label={{
            value: "Discharge (m³/s)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="discharge"
          stroke="#007bff" // Bootstrap primary (blue)
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
}

export default ManningChart;
