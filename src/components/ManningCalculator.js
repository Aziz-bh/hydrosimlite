import { useState } from "react";
import ManningChart from "./ManningChart";

function ManningCalculator() {
  // Inputs communs
  const [shape, setShape] = useState("rectangular");
  const [slope, setSlope] = useState("");
  const [manningN, setManningN] = useState("0.013");

  // Rectangulaire
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");

  // Trapézoïdal
  const [base, setBase] = useState("");
  const [trapeDepth, setTrapeDepth] = useState("");
  const [sideSlope, setSideSlope] = useState(""); // ratio horizontal/vertical (z)

  // Circulaire
  const [diameter, setDiameter] = useState("");
  const [circDepth, setCircDepth] = useState("");

  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Calculs de géométrie
  function computeRectangular(b, y) {
    const A = b * y;
    const P = b + 2 * y;
    const R = A / P;
    return { A, P, R };
  }
  function computeTrapezoidal(b, y, z) {
    const A = (b + z * y) * y;
    const P = b + 2 * y * Math.sqrt(1 + z * z);
    const R = A / P;
    return { A, P, R };
  }
  function computeCircular(D, y) {
    const r = D / 2;
    let theta;
    if (y < r) {
      theta = 2 * Math.acos((r - y) / r);
    } else {
      theta = 2 * Math.PI - 2 * Math.acos((y - r) / r);
    }
    const A = (r * r / 2) * (theta - Math.sin(theta));
    const P = r * theta;
    const R = A / P;
    return { A, P, R };
  }

  // Main calculation logic
  const calculateResults = () => {
    const S = parseFloat(slope);
    const n = parseFloat(manningN);

    let A, P, R, Q;
    let chartPoints = [];

    if (shape === "rectangular") {
      const b = parseFloat(width);
      const y = parseFloat(depth);
      if (!(b > 0 && y > 0 && S > 0 && n > 0)) {
        alert("Veuillez entrer des valeurs positives valides pour tous les champs.");
        return;
      }
      ({ A, P, R } = computeRectangular(b, y));
      Q = (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(S);

      // Chart points for varying depth
      for (let d = 0.1; d <= y * 2; d += y / 10) {
        const { A: area, P: perim, R: rad } = computeRectangular(b, d);
        const discharge = (1 / n) * area * Math.pow(rad, 2 / 3) * Math.sqrt(S);
        chartPoints.push({ depth: d.toFixed(2), discharge: discharge.toFixed(3) });
      }
    } else if (shape === "trapezoidal") {
      const b = parseFloat(base);
      const y = parseFloat(trapeDepth);
      const z = parseFloat(sideSlope);
      if (!(b > 0 && y > 0 && z >= 0 && S > 0 && n > 0)) {
        alert("Veuillez entrer des valeurs valides pour tous les champs du canal trapézoïdal.");
        return;
      }
      ({ A, P, R } = computeTrapezoidal(b, y, z));
      Q = (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(S);

      for (let d = 0.1; d <= y * 2; d += y / 10) {
        const { A: area, P: perim, R: rad } = computeTrapezoidal(b, d, z);
        const discharge = (1 / n) * area * Math.pow(rad, 2 / 3) * Math.sqrt(S);
        chartPoints.push({ depth: d.toFixed(2), discharge: discharge.toFixed(3) });
      }
    } else if (shape === "circular") {
      const D = parseFloat(diameter);
      const y = parseFloat(circDepth);
      if (!(D > 0 && y > 0 && y <= D && S > 0 && n > 0)) {
        alert("Veuillez entrer des valeurs valides pour tous les champs du canal circulaire.");
        return;
      }
      ({ A, P, R } = computeCircular(D, y));
      Q = (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(S);

      for (let d = 0.05; d <= y * 2 && d <= D; d += (y / 10)) {
        const { A: area, P: perim, R: rad } = computeCircular(D, d);
        const discharge = (1 / n) * area * Math.pow(rad, 2 / 3) * Math.sqrt(S);
        chartPoints.push({ depth: d.toFixed(2), discharge: discharge.toFixed(3) });
      }
    }

    setResults({
      area: A?.toFixed(3),
      perimeter: P?.toFixed(3),
      hydraulicRadius: R?.toFixed(3),
      discharge: Q?.toFixed(3),
    });
    setChartData(chartPoints);
  };

  // UI
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="text-primary font-weight-bold mb-2">Calculateur de Manning</h3>
                <p className="text-muted">Estimez le débit dans les canaux à surface libre à l’aide de l’équation de Manning</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  calculateResults();
                }}
              >
                <div className="form-group mb-3">
                  <label className="font-weight-bold">Forme de la section du canal</label>
                  <select
                    className="form-control form-control-lg"
                    value={shape}
                    onChange={(e) => setShape(e.target.value)}
                  >
                    <option value="rectangular">Rectangulaire</option>
                    <option value="trapezoidal">Trapézoïdal</option>
                    <option value="circular">Circulaire</option>
                  </select>
                </div>

                {shape === "rectangular" && (
                  <>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Largeur (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-lg"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Profondeur (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-lg"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {shape === "trapezoidal" && (
                  <>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Largeur du fond (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-lg"
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Profondeur (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-lg"
                        value={trapeDepth}
                        onChange={(e) => setTrapeDepth(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Pente des côtés (z, m/m)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-lg"
                        value={sideSlope}
                        onChange={(e) => setSideSlope(e.target.value)}
                        required
                      />
                      <small className="form-text text-muted">Rapport horizontal/vertical (ex : z=1 pour 1H/1V)</small>
                    </div>
                  </>
                )}

                {shape === "circular" && (
                  <>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Diamètre (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-lg"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="font-weight-bold">Profondeur d'eau (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-lg"
                        value={circDepth}
                        onChange={(e) => setCircDepth(e.target.value)}
                        required
                      />
                      <small className="form-text text-muted">Doit être inférieur ou égal au diamètre</small>
                    </div>
                  </>
                )}

                <div className="form-group mb-3">
                  <label className="font-weight-bold">Pente (m/m)</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="form-control form-control-lg"
                    placeholder="ex : 0.002"
                    value={slope}
                    onChange={(e) => setSlope(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-weight-bold">Coefficient de rugosité (n) </label>
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
                  Calculer
                </button>
              </form>
            </div>

            <div>
              {results && (
                <div className="card mt-5 shadow">
                  <div className="card-body text-center">
                    <h5 className="text-success mb-3">Résultats</h5>
                    <ul className="list-unstyled">
                      <li><strong>Section mouillée :</strong> {results.area} m²</li>
                      <li><strong>Périmètre mouillé :</strong> {results.perimeter} m</li>
                      <li><strong>Rayon hydraulique :</strong> {results.hydraulicRadius} m</li>
                      <li><strong>Débit (Q) :</strong> {results.discharge} m³/s</li>
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

<div className="row ">
                <div className=" justify-content">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
                  <h3> Explication</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
  <p>
    Un <strong>calculateur de Manning</strong> est un outil utilisé en hydraulique des canaux à surface libre
    pour estimer le <strong>débit (Q)</strong> ou la <strong>vitesse de l’eau</strong>, à l’aide de la 
    formule de Manning. Il est couramment utilisé en génie civil et en environnement pour les rivières, 
    les canaux et les systèmes de drainage.
  </p>

  <p>📐 <strong>Formule de Manning :</strong></p>
  <p style={{ fontFamily: "serif", fontSize: "1.2rem" }}>
    Q = (1/n) × A × R<sup>2/3</sup> × S<sup>1/2</sup>
  </p>

  <p><strong>Où :</strong></p>
  <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
    <li><strong>Q</strong> = Débit (m³/s)</li>
    <li><strong>n</strong> = Coefficient de rugosité de Manning (sans unité)</li>
    <li><strong>A</strong> = Aire de la section mouillée (m²)</li>
    <li><strong>R</strong> = Rayon hydraulique = A / P (m), avec <strong>P</strong> = périmètre mouillé</li>
    <li><strong>S</strong> = Pente du canal (m/m)</li>
  </ul>
</div>

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
                  <div style={{ marginTop: '20px' }}>
  <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/EoP7axPsCJA" 
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
    </div>
  );
}

export default ManningCalculator;