import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  exportResultsToCSV,
  exportResultsToPDF,
} from "../utils/export";
import {
  calculateManningRectangular,
} from "../utils/hydraulics";

function ChannelDesign() {
  const [mode, setMode] = useState("channel");
  const [targetQ, setTargetQ] = useState("");
  const [slope, setSlope] = useState("0.001");
  const [n, setN] = useState("0.015");
  const [pipeSlope, setPipeSlope] = useState("0.001");
  const [designResults, setDesignResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleDesign = () => {
    const Q = parseFloat(targetQ);
    if (!(Q > 0)) return;

    if (mode === "channel") {
      const S = parseFloat(slope);
      const nVal = parseFloat(n);
      let best = null;
      let bestP = Infinity;

      for (let width = 0.5; width <= 10; width += 0.5) {
        let depth = 0.1;
        while (depth <= 5) {
          const { Q: calcQ, A, Rh } = calculateManningRectangular(width, depth, S, nVal);
          if (calcQ >= Q) {
            const P = width + 2 * depth;
            if (P < bestP) {
              bestP = P;
              best = { width, depth, Q: calcQ, A, Rh };
            }
            break;
          }
          depth += 0.1;
        }
      }

      if (best) {
        setDesignResults(best);
        const points = [];
        for (let d = 0.1; d <= best.depth * 1.5; d += 0.1) {
          const { Q: qVal } = calculateManningRectangular(best.width, d, S, nVal);
          points.push({ depth: d.toFixed(2), discharge: qVal.toFixed(3) });
        }
        setChartData(points);
      }
    } else if (mode === "pipe") {
      const S = parseFloat(pipeSlope);
      const nPipe = 0.013;
      const diameters = [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 1.0];
      let chosen = null;

      for (let D of diameters) {
        const A = Math.PI * (D * D) / 4;
        const Rh = D / 4;
        const Q_cap = (1 / nPipe) * Math.pow(Rh, 2 / 3) * Math.sqrt(S) * A;
        if (Q_cap >= Q) {
          chosen = { diameter: D, capacity: Q_cap };
          break;
        }
      }

      setDesignResults(chosen || { error: true });
      setChartData([]);
    }
  };

  const handleExportCSV = () => {
    exportResultsToCSV("design_results.csv", designResults, chartData);
  };

  const handleExportPDF = () => {
    exportResultsToPDF("Channel Design Results", designResults, "chart-design");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="text-primary font-weight-bold mb-2">Channel Design Tool</h3>
                <p className="text-muted">Find optimal dimensions for open channels or circular pipes.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDesign();
                }}
              >
                <div className="form-group mb-3">
                  <label className="font-weight-bold">Design Mode</label>
                  <select
                    className="form-control form-control-lg"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="channel">Open Channel</option>
                    <option value="pipe">Circular Pipe</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Target Discharge (Q, m³/s)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={targetQ}
                    onChange={(e) => setTargetQ(e.target.value)}
                    required
                  />
                </div>

                {mode === "channel" && (
                  <>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Slope (m/m)</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={slope}
                        onChange={(e) => setSlope(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="font-weight-bold">Manning's n</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={n}
                        onChange={(e) => setN(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {mode === "pipe" && (
                  <div className="form-group mb-4">
                    <label className="font-weight-bold">Pipe Slope (m/m)</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={pipeSlope}
                      onChange={(e) => setPipeSlope(e.target.value)}
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-round btn-lg btn-block">
                  Design
                </button>
              </form>
            </div>
          </div>

          {designResults && mode === "channel" && (
            <div className="card mt-5 shadow-sm">
              <div className="card-body">
                <h5 className="text-success text-center">Optimal Channel Dimensions</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><strong>Width:</strong> {designResults.width.toFixed(2)} m</li>
                  <li className="list-group-item"><strong>Depth:</strong> {designResults.depth.toFixed(2)} m</li>
                  <li className="list-group-item"><strong>Discharge:</strong> {designResults.Q.toFixed(3)} m³/s</li>
                  <li className="list-group-item"><strong>Area:</strong> {designResults.A.toFixed(3)} m²</li>
                  <li className="list-group-item"><strong>Hydraulic Radius:</strong> {designResults.Rh.toFixed(3)} m</li>
                </ul>
              </div>
            </div>
          )}

          {designResults && mode === "pipe" && (
            <div className="card mt-5 shadow-sm">
              <div className="card-body text-center">
                <h5 className="text-success">Recommended Pipe Size</h5>
                {!designResults.error ? (
                  <>
                    <p><strong>Diameter:</strong> {designResults.diameter.toFixed(2)} m</p>
                    <p><strong>Capacity:</strong> {designResults.capacity.toFixed(3)} m³/s</p>
                  </>
                ) : (
                  <p className="text-danger">No pipe size found that can handle this flow.</p>
                )}
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="card mt-4 shadow-sm">
              <div className="card-body">
                <h5 className="text-center mb-4">Depth vs Discharge (Rectangular Channel)</h5>
                <LineChart width={600} height={300} data={chartData}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="depth" label={{ value: "Depth (m)", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Discharge (m³/s)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="discharge" stroke="#17a2b8" strokeWidth={2} />
                </LineChart>
              </div>
            </div>
          )}

          {designResults && (
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

export default ChannelDesign;
