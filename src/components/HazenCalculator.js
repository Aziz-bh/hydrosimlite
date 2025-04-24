import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  exportResultsToCSV,
  exportResultsToPDF,
} from "../utils/export";
import { calculateHazenWilliams } from "../utils/hydraulics";

function HazenCalculator() {
  const [length, setLength] = useState("");
  const [diameter, setDiameter] = useState("");
  const [flow, setFlow] = useState("");
  const [C, setC] = useState("120"); // Default C for steel
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculate = () => {
    const L = parseFloat(length);
    const D = parseFloat(diameter);
    const Q = parseFloat(flow);
    const coeff = parseFloat(C);

    if (!(L > 0 && D > 0 && Q > 0 && coeff > 0)) return;

    const { hf } = calculateHazenWilliams(L, D, Q, coeff);
    setResult({ hf: hf.toFixed(3), L, D, Q, C: coeff });

    // Generate chart data: vary flow from 0 to 2*Q
    const points = [];
    const maxQ = Q * 2;
    for (let q = 0.01; q <= maxQ; q += maxQ / 20) {
      const { hf: h } = calculateHazenWilliams(L, D, q, coeff);
      points.push({
        flow: q.toFixed(3),
        headLoss: h.toFixed(3),
      });
    }
    setChartData(points);
  };

  const handleExportCSV = () => {
    exportResultsToCSV("hazen_results.csv", result, chartData);
  };

  const handleExportPDF = () => {
    exportResultsToPDF("Hazen-Williams Results", result, "chart-hazen");
  };

  return (
    <div>
      <h2>Hazen-Williams Calculator</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
        className="mb-4"
      >
        <div className="mb-3">
          <label className="form-label">Pipe Length (m)</label>
          <input
            type="number"
            className="form-control"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Pipe Diameter (m)</label>
          <input
            type="number"
            className="form-control"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Flow Rate (m³/s)</label>
          <input
            type="number"
            className="form-control"
            value={flow}
            onChange={(e) => setFlow(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Hazen-Williams C</label>
          <select
            className="form-select"
            value={C}
            onChange={(e) => setC(e.target.value)}
          >
            <option value="150">PVC - 150</option>
            <option value="140">Copper - 140</option>
            <option value="130">Iron - 130</option>
            <option value="120">Steel - 120</option>
            <option value="100">Old Pipe - 100</option>
            <option value={C}>Custom: {C}</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Calculate
        </button>
      </form>

      {result && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Result</h5>
            <p>
              <strong>Head Loss (h<sub>f</sub>):</strong> {result.hf} m
            </p>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div id="chart-hazen" className="mb-4">
          <h5>Flow Rate vs Head Loss</h5>
          <LineChart width={500} height={300} data={chartData}>
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
      )}

      {result && (
        <div className="mb-4">
          <button
            onClick={handleExportPDF}
            className="btn btn-secondary me-2"
          >
            Export PDF
          </button>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default HazenCalculator;
