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

function safeFixed(val: number | undefined, digits = 2) {
  return typeof val === "number" && !isNaN(val) ? val.toFixed(digits) : "-";
}

// Utility: compute theoretical minimum diameter for full circular pipe (Manning)
function computeMinPipeDiameter(Q: number, S: number, n: number) {
  // D = [Q * n / (K * S^0.5)]^(3/8)
  // K = (π/4) * 4^(-2/3)
  const K = (Math.PI / 4) * Math.pow(4, -2 / 3);
  if (Q <= 0 || S <= 0 || n <= 0) return undefined;
  const D = Math.pow((Q * n) / (K * Math.sqrt(S)), 3 / 8);
  return D;
}

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
      } else {
        setDesignResults(null);
        setChartData([]);
      }
    } else if (mode === "pipe") {
      const S = parseFloat(pipeSlope);
      const nPipe = 0.013;
      const Q = parseFloat(targetQ);
      const diameters = [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0];
      let chosen = null;

      for (let D of diameters) {
        const A = Math.PI * (D * D) / 4;
        const Rh = D / 4;
        const Q_cap = (1 / nPipe) * A * Math.pow(Rh, 2 / 3) * Math.sqrt(S);
        if (Q_cap >= Q) {
          chosen = { diameter: D, capacity: Q_cap };
          break;
        }
      }

      if (chosen) {
        setDesignResults(chosen);
      } else {
        // Compute theoretical minimum diameter
        const minD = computeMinPipeDiameter(Q, S, nPipe);
        setDesignResults({
          error: true,
          minimalDiameter: minD,
        });
      }
      setChartData([]);
    }
  };

  const handleExportCSV = () => {
    exportResultsToCSV("design_results.csv", designResults, chartData);
  };

  const handleExportPDF = () => {
    exportResultsToPDF("Résultats du dimensionnement du canal", designResults, "chart-design");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="text-primary font-weight-bold mb-2">
                  Outil de dimensionnement de canal
                </h3>
                <p className="text-muted">
                  Trouvez les dimensions optimales pour des canaux ouverts ou des conduites circulaires.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDesign();
                }}
              >
                <div className="form-group mb-3">
                  <label className="font-weight-bold">Mode de dimensionnement</label>
                  <select
                    className="form-control form-control-lg"
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value);
                      setDesignResults(null); // Reset results when switching mode
                      setChartData([]);
                    }}
                  >
                    <option value="channel">Canal ouvert</option>
                    <option value="pipe">Conduite circulaire</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Débit cible (Q, m³/s)</label>
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
                      <label className="font-weight-bold">Pente (m/m)</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={slope}
                        onChange={(e) => setSlope(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="font-weight-bold">Coefficient de Manning n</label>
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
                    <label className="font-weight-bold">Pente de la conduite (m/m)</label>
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
                  Dimensionner
                </button>
              </form>
            </div>

            {/* Results for Open Channel */}
            {designResults && mode === "channel" && (
              <div className="card mt-5 shadow-sm">
                <div className="card-body">
                  <h5 className="text-success text-center">Dimensions optimales du canal</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Largeur :</strong> {safeFixed(designResults?.width, 2)} m</li>
                    <li className="list-group-item"><strong>Hauteur :</strong> {safeFixed(designResults?.depth, 2)} m</li>
                    <li className="list-group-item"><strong>Débit :</strong> {safeFixed(designResults?.Q, 3)} m³/s</li>
                    <li className="list-group-item"><strong>Surface :</strong> {safeFixed(designResults?.A, 3)} m²</li>
                    <li className="list-group-item"><strong>Rayon hydraulique :</strong> {safeFixed(designResults?.Rh, 3)} m</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Results for Pipe */}
            {designResults && mode === "pipe" && (
              <div className="card mt-5 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="text-success">Diamètre de conduite recommandé</h5>
                  {!designResults.error ? (
                    <>
                      <p><strong>Diamètre :</strong> {safeFixed(designResults?.diameter, 2)} m</p>
                      <p><strong>Capacité :</strong> {safeFixed(designResults?.capacity, 3)} m³/s</p>
                    </>
                  ) : (
                    <>
                      <p className="text-danger">Aucun diamètre de conduite commercial ne permet d'assurer ce débit.</p>
                      {designResults.minimalDiameter &&
                        <p className="text-muted">
                          <strong>Diamètre minimal théorique requis :</strong> {safeFixed(designResults.minimalDiameter, 2)} m
                        </p>
                      }
                      <ul className="text-muted small" style={{ textAlign: "left", margin: "0 auto", maxWidth: 450 }}>
                        <li>Essayez d’augmenter la pente</li>
                        <li>Ou utilisez plusieurs conduites en parallèle</li>
                        <li>Ou contactez un ingénieur pour une solution sur mesure</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="card mt-4 shadow-sm">
                <div className="card-body">
                  <h5 className="text-center mb-4">Hauteur vs Débit (canal rectangulaire)</h5>
                  <LineChart width={600} height={300} data={chartData}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="depth" label={{ value: "Hauteur (m)", position: "insideBottomRight", offset: -5 }} />
                    <YAxis label={{ value: "Débit (m³/s)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="discharge" stroke="#17a2b8" strokeWidth={2} />
                  </LineChart>
                </div>
              </div>
            )}

            {/* Export buttons */}
            {designResults && (
              <div className="mt-4 text-center">
                <button onClick={handleExportPDF} className="btn btn-outline-primary me-3">
                  Exporter en PDF
                </button>
                <button onClick={handleExportCSV} className="btn btn-outline-secondary">
                  Exporter en CSV
                </button>
              </div>
            )}

            {/* Explanation Section */}
            <div className="row">
              <div className="justify-content">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
                  <h3>Explication</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
                  <p>
                    L’<strong>outil de dimensionnement de canal</strong> permet de déterminer les dimensions optimales pour un canal ouvert ou une conduite circulaire, selon le débit cible et les contraintes hydrauliques.
                  </p>
                  <p>
                    Pour les canaux ouverts, on utilise la <strong>formule de Manning</strong> :<br/>
                    <span style={{ fontFamily: "serif", fontSize: "1.2rem" }}>
                      Q = (1/n) × A × R<sup>2/3</sup> × S<sup>1/2</sup>
                    </span>
                  </p>
                  <p>
                    Pour les conduites circulaires à surface pleine, la capacité maximale est calculée à l’aide de la même formule, adaptée à la géométrie.
                  </p>
                  <p><strong>Où :</strong></p>
                  <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                    <li><strong>Q</strong> = Débit (m³/s)</li>
                    <li><strong>n</strong> = Coefficient de rugosité de Manning</li>
                    <li><strong>A</strong> = Aire mouillée (m²)</li>
                    <li><strong>R</strong> = Rayon hydraulique (A/P) (m)</li>
                    <li><strong>S</strong> = Pente du canal (m/m)</li>
                  </ul>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
                  <div style={{ marginTop: '20px' }}>
                    <iframe 
                      width="560" 
                      height="315" 
                      src="https://www.youtube.com/embed/Qmk_XxI8lvc" 
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

export default ChannelDesign;