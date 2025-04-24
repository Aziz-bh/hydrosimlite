// src/data/constants.js

// Common Manning's n values
export const MANNING_N_VALUES = [
    { material: "Concrete (finished)", value: 0.012 },
    { material: "Concrete (rough)", value: 0.015 },
    { material: "Earth, straight, clean", value: 0.022 },
    { material: "Earth, winding, sluggish", value: 0.035 },
    { material: "Gravel", value: 0.030 },
    { material: "Plastic (HDPE, PVC)", value: 0.009 },
  ];
  
  // Common Hazen-Williams C values
  export const HAZEN_WILLIAMS_C_VALUES = [
    { material: "Plastic (PVC)", value: 150 },
    { material: "Copper", value: 140 },
    { material: "New steel", value: 120 },
    { material: "Cast iron", value: 100 },
    { material: "Old pipe / corroded", value: 80 },
  ];
  
  // Standard pipe diameters in meters (could be expanded)
  export const STANDARD_PIPE_DIAMETERS = [
    0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2,
  ];
  