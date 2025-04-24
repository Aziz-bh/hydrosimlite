import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
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
  const [roughness, setRoughness] = useState("0.0001");
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="text-primary font-weight-bold mb-2">Darcy-Weisbach Calculator</h3>
                <p className="text-muted">Estimate head loss, velocity, and flow regime using Darcy-Weisbach equation.</p>
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
                  <label className="font-weight-bold">Pipe Roughness ε (m)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={roughness}
                    onChange={(e) => setRoughness(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-round btn-lg btn-block">
                  Calculate
                </button>
              </form>
            </div>
          </div>

          {results && (
            <div className="card mt-5 shadow-sm">
              <div className="card-body">
                <h5 className="text-success text-center">Results</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><strong>Head Loss (h<sub>f</sub>):</strong> {results.hf} m</li>
                  <li className="list-group-item"><strong>Velocity (V):</strong> {results.V} m/s</li>
                  <li className="list-group-item"><strong>Friction Factor (f):</strong> {results.f}</li>
                  <li className="list-group-item"><strong>Reynolds Number (Re):</strong> {results.Re}</li>
                  <li className="list-group-item"><strong>Flow Regime:</strong> {results.regime}</li>
                </ul>
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
                    stroke="#dc3545"
                    strokeWidth={2}
                  />
                </LineChart>
              </div>
            </div>
          )}

          {results && (
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

export default DarcyCalculator;
