import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function DarcyChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div id="chart-darcy" className="mb-4">
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
          stroke="#dc3545" // red (Bootstrap danger)
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
}

export default DarcyChart;
