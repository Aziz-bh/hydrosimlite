import { useState } from "react";
import ManningChart from "./ManningChart";

function ManningCalculator() {
  const [shape, setShape] = useState("rectangular");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [slope, setSlope] = useState("");
  const [manningN, setManningN] = useState("0.013");
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateResults = () => {
    const b = parseFloat(width);
    const y = parseFloat(depth);
    const S = parseFloat(slope);
    const n = parseFloat(manningN);

    if (!(b > 0 && y > 0 && S > 0 && n > 0)) {
      alert("Please enter valid positive numbers for all inputs.");
      return;
    }

    const A = b * y;
    const P = b + 2 * y;
    const R = A / P;
    const Q = (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(S);

    setResults({
      area: A.toFixed(3),
      perimeter: P.toFixed(3),
      hydraulicRadius: R.toFixed(3),
      discharge: Q.toFixed(3),
    });

    const chartPoints = [];
    for (let d = 0.1; d <= y * 2; d += y / 10) {
      const area = b * d;
      const perimeter = b + 2 * d;
      const radius = area / perimeter;
      const discharge = (1 / n) * area * Math.pow(radius, 2 / 3) * Math.sqrt(S);
      chartPoints.push({
        depth: d.toFixed(2),
        discharge: discharge.toFixed(3),
      });
    }
    setChartData(chartPoints);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="text-primary font-weight-bold mb-2">Manning Calculator</h3>
                <p className="text-muted">Estimate flow for open channels using the Manning equation</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  calculateResults();
                }}
              >
                <div className="form-group mb-3">
                  <label className="font-weight-bold">Channel Shape</label>
                  <select
                    className="form-control form-control-lg"
                    value={shape}
                    onChange={(e) => setShape(e.target.value)}
                  >
                    <option value="rectangular">Rectangular</option>
                    <option value="trapezoidal">Trapezoidal</option>
                    <option value="circular">Circular</option>
                  </select>
                </div>

                {shape === "rectangular" && (
                  <>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Width (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-control-lg"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Depth (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-control-lg"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Slope (m/m)</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="form-control form-control-lg"
                    placeholder="e.g., 0.002"
                    value={slope}
                    onChange={(e) => setSlope(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-weight-bold">Manning's n</label>
                  <input
                    type="number"
                    step="0.001"
                    className="form-control form-control-lg"
                    value={manningN}
                    onChange={(e) => setManningN(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-round btn-lg">
                  Calculate
                </button>
              </form>
            </div>
          </div>

          {results && (
            <div className="card mt-5 shadow">
              <div className="card-body text-center">
                <h5 className="text-success mb-3">Results</h5>
                <ul className="list-unstyled">
                  <li><strong>Area:</strong> {results.area} m²</li>
                  <li><strong>Wetted Perimeter:</strong> {results.perimeter} m</li>
                  <li><strong>Hydraulic Radius:</strong> {results.hydraulicRadius} m</li>
                  <li><strong>Discharge (Q):</strong> {results.discharge} m³/s</li>
                </ul>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="card mt-4 shadow">
              <div className="card-body">
                <ManningChart data={chartData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManningCalculator;
