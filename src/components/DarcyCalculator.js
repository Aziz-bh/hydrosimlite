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
                <h3 className="text-primary font-weight-bold mb-2">Calculateur Darcy-Weisbach</h3>
                <p className="text-muted">
                  Estimez la perte de charge, la vitesse et le régime d'écoulement avec l'équation de Darcy-Weisbach.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  calculate();
                }}
              >
                <div className="form-group mb-3">
                  <label className="font-weight-bold">Longueur de la conduite (m)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Diamètre de la conduite (m)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Débit (m³/s)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={flow}
                    onChange={(e) => setFlow(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-weight-bold">Rugosité de la conduite ε (m)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={roughness}
                    onChange={(e) => setRoughness(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-round btn-lg btn-block">
                  Calculer
                </button>
              </form>
            </div>
            
          {results && (
            <div className="card mt-5 shadow-sm">
              <div className="card-body">
                <h5 className="text-success text-center">Résultats</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><strong>Perte de charge (h<sub>f</sub>) :</strong> {results.hf} m</li>
                  <li className="list-group-item"><strong>Vitesse (V) :</strong> {results.V} m/s</li>
                  <li className="list-group-item"><strong>Facteur de frottement (f) :</strong> {results.f}</li>
                  <li className="list-group-item"><strong>Nombre de Reynolds (Re) :</strong> {results.Re}</li>
                  <li className="list-group-item"><strong>Régime d'écoulement :</strong> {results.regime}</li>
                </ul>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="card mt-4 shadow-sm">
              <div className="card-body">
                <h5 className="text-center mb-4">Débit vs Perte de charge</h5>
                <LineChart width={600} height={300} data={chartData}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis
                    dataKey="flow"
                    label={{
                      value: "Débit (m³/s)",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Perte de charge (m)",
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
                Exporter en PDF
              </button>
              <button onClick={handleExportCSV} className="btn btn-outline-secondary">
                Exporter en CSV
              </button>
            </div>
          )}
            <div className="row">
  <div className="justify-content">
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
      <h3>Explication</h3>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
      <p>
        Le <strong>calculateur Darcy-Weisbach</strong> permet d’estimer la <strong>perte de charge (h<sub>f</sub>)</strong> dans les conduites sous pression pour tout fluide, en tenant compte de la rugosité, du régime d’écoulement et des propriétés du fluide.
      </p>
      <p>📐 <strong>Formule de Darcy-Weisbach :</strong></p>
      <p style={{ fontFamily: "serif", fontSize: "1.2rem" }}>
        h<sub>f</sub> = f × (L/D) × (V<sup>2</sup> / (2g))
      </p>
      <p><strong>Où :</strong></p>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
        <li><strong>h<sub>f</sub></strong> = Perte de charge (m)</li>
        <li><strong>f</strong> = Facteur de frottement de Darcy (adimensionnel)</li>
        <li><strong>L</strong> = Longueur de la conduite (m)</li>
        <li><strong>D</strong> = Diamètre intérieur (m)</li>
        <li><strong>V</strong> = Vitesse moyenne du fluide (m/s)</li>
        <li><strong>g</strong> = Accélération due à la gravité (9,81 m/s²)</li>
      </ul>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '10px' }}>
      <div style={{ marginTop: '20px' }}>
        <iframe 
          width="630" 
          height="355" 
          src="https://www.youtube.com/embed/D_CPDCXh1LA" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
</div>
          </div>

        </div>
        
      </div>
      
      
    </div>
    
  );
}

export default DarcyCalculator;