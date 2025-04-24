import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
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
  const [C, setC] = useState("120");
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="text-primary font-weight-bold mb-2">Hazen-Williams Calculator</h3>
                <p className="text-muted">Calculate head loss in pipes based on the Hazen-Williams formula.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  calculate();
                }}
              >
                <div className="form-group mb-3">
                  <label className="font-weight-bold">Pipe Length (m)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Pipe Diameter (m)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Flow Rate (m³/s)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={flow}
                    onChange={(e) => setFlow(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-weight-bold">Hazen-Williams C</label>
                  <select
                    className="form-control form-control-lg"
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

                <button type="submit" className="btn btn-primary btn-round btn-lg btn-block">
                  Calculate
                </button>
              </form>
            </div>
          </div>

          {result && (
            <div className="card mt-5 shadow-sm">
              <div className="card-body text-center">
                <h5 className="text-success">Result</h5>
                <p>
                  <strong>Head Loss (h<sub>f</sub>):</strong> {result.hf} m
                </p>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="card mt-4 shadow-sm">
              <div className="card-body">
                <h5 className="text-center mb-4">Flow Rate vs Head Loss</h5>
                <LineChart width={600} height={300} data={chartData}>
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
                    stroke="#28a745"
                    strokeWidth={2}
                  />
                </LineChart>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-4 text-center">
              <button onClick={handleExportPDF} className="btn btn-outline-primary me-3">
                Export PDF
              </button>
              <button onClick={handleExportCSV} className="btn btn-outline-secondary">
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HazenCalculator;
