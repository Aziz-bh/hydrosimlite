import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function DesignChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div id="chart-design" className="mb-4">
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
          stroke="#17a2b8" // Bootstrap 'info' color
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
}

export default DesignChart;
