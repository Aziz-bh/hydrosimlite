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
          const { Q: calcQ, A, Rh } = calculateManningRectangular(
            width,
            depth,
            S,
            nVal
          );
          if (calcQ >= Q) {
            const P = width + 2 * depth;
            if (P < bestP) {
              bestP = P;
              best = {
                width,
                depth,
                Q: calcQ,
                A,
                Rh,
              };
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
          const { Q: qVal } = calculateManningRectangular(
            best.width,
            d,
            S,
            nVal
          );
          points.push({
            depth: d.toFixed(2),
            discharge: qVal.toFixed(3),
          });
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
        const Q_cap =
          (1 / nPipe) * Math.pow(Rh, 2 / 3) * Math.sqrt(S) * A;

        if (Q_cap >= Q) {
          chosen = {
            diameter: D,
            capacity: Q_cap,
          };
          break;
        }
      }

      setDesignResults(chosen || { error: true });
      setChartData([]);
    }
  };

  const handleExportCSV = () => {
    exportResultsToCSV(
      "design_results.csv",
      designResults,
      chartData
    );
  };

  const handleExportPDF = () => {
    exportResultsToPDF(
      "Channel Design Results",
      designResults,
      "chart-design"
    );
  };

  return (
    <div>
      <h2>Channel Design Tool</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDesign();
        }}
        className="mb-4"
      >
        <div className="mb-3">
          <label className="form-label">Design Mode</label>
          <select
            className="form-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="channel">Open Channel</option>
            <option value="pipe">Circular Pipe</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Target Discharge (Q, m³/s)
          </label>
          <input
            type="number"
            className="form-control"
            value={targetQ}
            onChange={(e) => setTargetQ(e.target.value)}
            required
          />
        </div>

        {mode === "channel" && (
          <>
            <div className="mb-3">
              <label className="form-label">Slope (m/m)</label>
              <input
                type="number"
                className="form-control"
                value={slope}
                onChange={(e) => setSlope(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Manning's n</label>
              <input
                type="number"
                className="form-control"
                value={n}
                onChange={(e) => setN(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {mode === "pipe" && (
          <div className="mb-3">
            <label className="form-label">Pipe Slope (m/m)</label>
            <input
              type="number"
              className="form-control"
              value={pipeSlope}
              onChange={(e) => setPipeSlope(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Design
        </button>
      </form>

      {designResults && mode === "channel" && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              Optimal Channel Dimensions
            </h5>
            <ul>
              <li>
                <strong>Width:</strong>{" "}
                {designResults.width.toFixed(2)} m
              </li>
              <li>
                <strong>Depth:</strong>{" "}
                {designResults.depth.toFixed(2)} m
              </li>
              <li>
                <strong>Discharge:</strong>{" "}
                {designResults.Q.toFixed(3)} m³/s
              </li>
              <li>
                <strong>Area:</strong>{" "}
                {designResults.A.toFixed(3)} m²
              </li>
              <li>
                <strong>Hydraulic Radius:</strong>{" "}
                {designResults.Rh.toFixed(3)} m
              </li>
            </ul>
          </div>
        </div>
      )}

      {designResults && mode === "pipe" && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Recommended Pipe Size</h5>
            {!designResults.error ? (
              <>
                <p>
                  <strong>Diameter:</strong>{" "}
                  {designResults.diameter.toFixed(2)} m
                </p>
                <p>
                  <strong>Capacity:</strong>{" "}
                  {designResults.capacity.toFixed(3)} m³/s
                </p>
              </>
            ) : (
              <p>No pipe size found that can handle this flow.</p>
            )}
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div id="chart-design" className="mb-4">
          <h5>Depth vs Discharge (Rectangular Channel)</h5>
          <LineChart width={500} height={300} data={chartData}>
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
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="discharge"
              stroke="#17a2b8"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      )}

      {designResults && (
        <div className="mb-4">
          <button
            onClick={handleExportPDF}
            className="btn btn-secondary me-2"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
          >
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default ChannelDesign;
