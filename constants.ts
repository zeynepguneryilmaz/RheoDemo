import { RheologyParams, RheologyModel } from './types.ts';

export const DEFAULT_PARAMS: RheologyParams = {
  n: 0.8,
  K: 5.0,
  tau0: 10,
  gammaDotMin: 0.001,
  gammaDotMax: 1000,
  eta0: 100,
  etaInf: 0.01,
  kCross: 0.5,
  mCross: 0.8,
  lambdaCarreau: 1.0,
  gammaDotConst: 10,
  gammaDotLow: 0.1,
  gammaDotHigh: 500,
  tTotal: 180,
  dt: 0.5,
  kb: 0.1,
  kr: 0.01,
  lambda0: 1.0,
  a: 10.0,
  G0: 2500,
  tauR: 1.0,
  kSpring: 2000,
  etaDashpot: 200,
  freqMin: 0.001,
  freqMax: 1000,
  gamma0Min: 0.001,
  gamma0Max: 1000,
  gammaY: 10,
  softeningP: 2.5,
  gelRate: 0.02,
  GprimeFinal: 8000,
  gelT0: 20,
  oscFreq: 1.0,
  currentTemp: 25,
  tempMin: 5,
  tempMax: 85,
  tempSensitivity: 0.04
};

export const MATERIAL_PROFILES = [
  {
    name: "Commercial Toothpaste",
    model: RheologyModel.BINGHAM,
    params: { ...DEFAULT_PARAMS, tau0: 160, K: 12.0, n: 1.0, G0: 48000, gammaY: 1.2 },
    description: "Ideal Bingham plastic. Acts as a rigid gel at rest to stay on the brush, but flows linearly once the squeeze pressure (yield stress) is applied."
  },
  {
    name: "Classic Tomato Ketchup",
    model: RheologyModel.HERSCHEL_BULKLEY,
    params: { ...DEFAULT_PARAMS, tau0: 32, K: 15, n: 0.3, G0: 1100, gammaY: 25 },
    description: "Highly pseudoplastic yield stress fluid. It won't run off your burger, but once you shake the bottle, it thins drastically to flow out easily."
  },
  {
    name: "10W-40 Synthetic Motor Oil",
    model: RheologyModel.NEWTONIAN,
    params: { ...DEFAULT_PARAMS, K: 1.2, n: 1.0, tempSensitivity: 0.15 },
    description: "Pure Newtonian lubricant. Viscosity is independent of speed but collapses rapidly as engine temperature increases."
  },
  {
    name: "Self-Healing Hydrogel",
    model: RheologyModel.THIXOTROPY,
    params: { ...DEFAULT_PARAMS, kr: 0.03, kb: 0.5, K: 22, a: 18, lambda0: 1.0, G0: 9500 },
    description: "Intelligent recovery network. It liquefies under injection stress and regenerates its full solid-like stiffness within seconds of reaching rest."
  },
  {
    name: "Starch 'Oobleck' Slurry",
    model: RheologyModel.POWER_LAW,
    params: { ...DEFAULT_PARAMS, K: 0.02, n: 2.2, G0: 60 },
    description: "Dilatant (Shear-Thickening). The suspension becomes dramatically more resistive as more energy is applied."
  },
  {
    name: "Molten Dark Chocolate",
    model: RheologyModel.CASSON,
    params: { ...DEFAULT_PARAMS, tau0: 15, K: 3.2, n: 1.0, tempSensitivity: 0.1 },
    description: "Standard Casson profile for cocoa-based solids. Optimized for smooth coating and uniform thickness in manufacturing."
  },
  {
    name: "High-Density Mayonnaise",
    model: RheologyModel.HERSCHEL_BULKLEY,
    params: { ...DEFAULT_PARAMS, tau0: 95, K: 14, n: 0.42, G0: 7000, gammaY: 10 },
    description: "Structural emulsion. Very high yield stress ensures it holds shape, with significant thinning to allow easy spreading."
  }
];

export const SERIES_COLORS = [
  '#0f172a',
  '#2563eb',
  '#e11d48',
  '#059669',
  '#7c3aed',
  '#ea580c',
  '#c2410c',
  '#0369a1',
  '#4d7c0f',
  '#be185d'
];