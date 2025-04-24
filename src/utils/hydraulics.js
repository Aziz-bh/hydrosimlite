// src/utils/hydraulics.js

// Manning - Rectangular
export function calculateManningRectangular(width, depth, slope, manningN) {
    const A = width * depth;
    const P = width + 2 * depth;
    const Rh = A / P;
    const V = (1 / manningN) * Math.pow(Rh, 2 / 3) * Math.sqrt(slope);
    const Q = V * A;
  
    return { Q, V, A, Rh };
  }
  
  // Manning - Trapezoidal
  export function calculateManningTrapezoidal(bottomWidth, depth, sideSlope, slope, manningN) {
    const A = (bottomWidth + sideSlope * depth) * depth;
    const P = bottomWidth + 2 * depth * Math.sqrt(1 + sideSlope ** 2);
    const Rh = A / P;
    const V = (1 / manningN) * Math.pow(Rh, 2 / 3) * Math.sqrt(slope);
    const Q = V * A;
  
    return { Q, V, A, Rh };
  }
  
  // Manning - Circular (partially filled)
  export function calculateManningCircular(diameter, depth, slope, manningN) {
    const r = diameter / 2;
    let theta;
  
    if (depth < r) {
      theta = 2 * Math.acos((r - depth) / r);
    } else {
      theta = 2 * Math.PI - 2 * Math.acos((depth - r) / r);
    }
  
    const A = (r ** 2 / 2) * (theta - Math.sin(theta));
    const P = r * theta;
    const Rh = A / P;
    const V = (1 / manningN) * Math.pow(Rh, 2 / 3) * Math.sqrt(slope);
    const Q = V * A;
  
    return { Q, V, A, Rh };
  }
  
  // Darcy-Weisbach
  export function calculateDarcyWeisbach(length, diameter, flowRate, roughness) {
    const g = 9.81;
    const nu = 1e-6; // kinematic viscosity (m²/s)
    const A = Math.PI * Math.pow(diameter, 2) / 4;
    const V = flowRate / A;
    const Re = (V * diameter) / nu;
  
    let f;
    let regime = "Transitional";
  
    if (Re < 2300) {
      f = 64 / Re;
      regime = "Laminar";
    } else {
      // Swamee-Jain approximation for turbulent flow
      f = 0.25 / Math.pow(
        Math.log10(roughness / (3.7 * diameter) + 5.74 / Math.pow(Re, 0.9)),
        2
      );
      if (Re > 4000) regime = "Turbulent";
    }
  
    const hf = f * (length / diameter) * (V ** 2 / (2 * g));
  
    return { hf, f, Re, V, regime };
  }
  
  // Hazen-Williams
  export function calculateHazenWilliams(length, diameter, flowRate, C) {
    const hf = 10.67 * length * Math.pow(flowRate, 1.852) /
      (Math.pow(C, 1.852) * Math.pow(diameter, 4.8655));
  
    return { hf };
  }
  