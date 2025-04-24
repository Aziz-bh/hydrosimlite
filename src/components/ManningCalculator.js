import { useState } from "react";
import ManningChart from "./ManningChart";

function ManningCalculator() {
  // State for inputs
  const [shape, setShape] = useState("rectangular");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [slope, setSlope] = useState("");
  const [manningN, setManningN] = useState("0.013");  // default n, e.g., 0.013 for concrete
  // State for outputs
  const [results, setResults] = useState(null);
  // State for chart data
  const [chartData, setChartData] = useState([]);

  const calculateResults = () => {
    console.log("calculateResults called");
    console.log("calculateResults called");
    const b = parseFloat(width);
    const y = parseFloat(depth);
    const S = parseFloat(slope);
    const n = parseFloat(manningN);
  
    if (!(b > 0 && y > 0 && S > 0 && n > 0)) {
      alert("Please enter valid positive numbers for all inputs.");
      return;
    }
  
    const A = b * y; // Cross-sectional area
    const P = b + 2 * y; // Wetted perimeter
    const R = A / P; // Hydraulic radius
    const Q = (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(S); // Discharge
  
    setResults({
      area: A.toFixed(3),
      perimeter: P.toFixed(3),
      hydraulicRadius: R.toFixed(3),
      discharge: Q.toFixed(3),
    });
  
    // Generate chart data
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
    <div>
      <h2>Manning Calculator</h2>
      <form 
        onSubmit={e => { e.preventDefault(); calculateResults(); }} 
        className="mb-4"
      >
        {/* Shape selection */}
        <div className="mb-3">
          <label className="form-label">Channel Shape</label>
          <select 
            className="form-select" 
            value={shape} 
            onChange={e => setShape(e.target.value)}
          >
            <option value="rectangular">Rectangular</option>
            <option value="trapezoidal">Trapezoidal</option>
            <option value="circular">Circular</option>
          </select>
        </div>

        {/* Rectangular inputs: width & depth (shown if shape === rectangular) */}
        {shape === "rectangular" && (
          <>
            <div className="mb-3">
              <label className="form-label">Width (m)</label>
              <input 
                type="number" step="0.1" className="form-control" 
                value={width} onChange={e => setWidth(e.target.value)} required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Depth (m)</label>
              <input 
                type="number" step="0.1" className="form-control" 
                value={depth} onChange={e => setDepth(e.target.value)} required 
              />
            </div>
          </>
        )}
        {/* (Similarly, add inputs for trapezoidal or circular when those shapes are selected) */}

        <div className="mb-3">
          <label className="form-label">Slope (m/m)</label>
          <input 
            type="number" step="0.0001" className="form-control" placeholder="e.g., 0.002" 
            value={slope} onChange={e => setSlope(e.target.value)} required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Manning's n</label>
          <input 
            type="number" step="0.001" className="form-control" 
            value={manningN} onChange={e => setManningN(e.target.value)} required 
          />
        </div>

        <button type="submit" className="btn btn-primary">Calculate</button>

      </form>

      {chartData.length > 0 && <ManningChart data={chartData} />}

    </div>
  );
}

export default ManningCalculator;
