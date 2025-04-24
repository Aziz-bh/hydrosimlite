import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  exportResultsToCSV,
  exportResultsToPDF,
} from "../utils/export";
import { calculateDarcyWeisbach } from "../utils/hydraulics";

function DarcyCalculator() {
  const [length, setLength] = useState("");
  const [diameter, setDiameter] = useState("");
  const [flow, setFlow] = useState("");
  const [roughness, setRoughness] = useState("0.0001"); // meters
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculate = () => {
    const L = parseFloat(length);
    const D = parseFloat(diameter);
    const Q = parseFloat(flow);
    const ε = parseFloat(roughness);
    if (!(L > 0 && D > 0 && Q > 0 && ε >= 0)) return;

    const result = calculateDarcyWeisbach(L, D, Q, ε);
    setResults({
      ...result,
      hf: result.hf.toFixed(3),
      f: result.f.toFixed(4),
      Re: Math.round(result.Re),
      V: result.V.toFixed(3),
    });

    // Generate chart data
    const points = [];
    const maxFlow = Q * 2;
    for (let q = 0; q <= maxFlow; q += maxFlow / 20) {
      const r = calculateDarcyWeisbach(L, D, q, ε);
      points.push({
        flow: q.toFixed(3),
        headLoss: r.hf.toFixed(3),
      });
    }
    setChartData(points);
  };

  const handleExportCSV = () => {
    exportResultsToCSV("darcy_results.csv", results, chartData);
  };

  const handleExportPDF = () => {
    exportResultsToPDF("Darcy-Weisbach Results", results, "chart-darcy");
  };

  return (
    <div>
      <h2>Darcy-Weisbach Calculator</h2>
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
          <label className="form-label">Pipe Roughness ε (m)</label>
          <input
            type="number"
            className="form-control"
            value={roughness}
            onChange={(e) => setRoughness(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Calculate
        </button>
      </form>

      {results && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Results</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Head Loss (h<sub>f</sub>):</strong> {results.hf} m
              </li>
              <li className="list-group-item">
                <strong>Velocity (V):</strong> {results.V} m/s
              </li>
              <li className="list-group-item">
                <strong>Friction Factor (f):</strong> {results.f}
              </li>
              <li className="list-group-item">
                <strong>Reynolds Number (Re):</strong> {results.Re}
              </li>
              <li className="list-group-item">
                <strong>Flow Regime:</strong> {results.regime}
              </li>
            </ul>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div id="chart-darcy" className="mb-4">
          <h5>Flow Rate vs Head Loss</h5>
          <LineChart width={500} height={300} data={chartData}>
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
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="headLoss"
              stroke="#dc3545"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      )}

      {results && (
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

export default DarcyCalculator;
