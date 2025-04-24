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
                <h3 className="text-primary font-weight-bold mb-2">Calculateur Hazen-Williams</h3>
                <p className="text-muted">
                  Calculez la perte de charge dans les canalisations à partir de la formule de Hazen-Williams.
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
                  <label className="font-weight-bold">C de Hazen-Williams</label>
                  <select
                    className="form-control form-control-lg"
                    value={C}
                    onChange={(e) => setC(e.target.value)}
                  >
                    <option value="150">PVC - 150</option>
                    <option value="140">Cuivre - 140</option>
                    <option value="130">Fonte - 130</option>
                    <option value="120">Acier - 120</option>
                    <option value="100">Ancienne conduite - 100</option>
                    <option value={C}>Personnalisé : {C}</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-round btn-lg btn-block">
                  Calculer
                </button>
              </form>
            </div>


          {result && (
            <div className="card mt-5 shadow-sm">
              <div className="card-body text-center">
                <h5 className="text-success">Résultat</h5>
                <p>
                  <strong>Perte de charge (h<sub>f</sub>) :</strong> {result.hf} m
                </p>
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
        Le <strong>calculateur Hazen-Williams</strong> est utilisé pour estimer la <strong>perte de charge (h<sub>f</sub>)</strong> dans les conduites d’eau sous pression, principalement pour l’eau potable.  
        Cette formule empirique est populaire en hydraulique urbaine pour les réseaux de canalisations.
      </p>
      <p>📐 <strong>Formule de Hazen-Williams :</strong></p>
      <p style={{ fontFamily: "serif", fontSize: "1.2rem" }}>
        h<sub>f</sub> = 10.67 × L × Q<sup>1.852</sup> / (C<sup>1.852</sup> × D<sup>4.87</sup>)
      </p>
      <p><strong>Où :</strong></p>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
        <li><strong>h<sub>f</sub></strong> = Perte de charge (m)</li>
        <li><strong>L</strong> = Longueur de la conduite (m)</li>
        <li><strong>Q</strong> = Débit (m³/s)</li>
        <li><strong>C</strong> = Coefficient de rugosité Hazen-Williams (sans unité)</li>
        <li><strong>D</strong> = Diamètre intérieur de la conduite (m)</li>
      </ul>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
      <div style={{ marginTop: '20px' }}>
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/oJZ91Mw0RXo" 
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

export default HazenCalculator;