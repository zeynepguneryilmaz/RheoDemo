export enum RheologyModel {
  NEWTONIAN = 'Newtonian (Ideal)',
  POWER_LAW = 'Power-law (Thinning/Dilatant)',
  CROSS = 'Cross Model (Viscosity Plateaus)',
  CARREAU = 'Carreau (Polymer Standard)',
  HERSCHEL_BULKLEY = 'Herschel–Bulkley (Yield + Power)',
  CASSON = 'Casson (Yield + Square Root)',
  BINGHAM = 'Bingham (Yield + Linear)',
  THIXOTROPY = 'Thixotropy (Time-Thinning)',
  RHEOPEXY = 'Rheopexy (Time-Thickening)',
  MAXWELL = 'Maxwell (Viscoelastic Liquid)',
  KELVIN_VOIGT = 'Kelvin–Voigt (Viscoelastic Solid)',
  GELATION = 'Gelation/Aging (Sol-Gel)'
}

export interface RheologyParams {
  n: number;
  K: number;
  tau0: number;
  gammaDotMin: number;
  gammaDotMax: number;
  
  // Cross/Carreau specific
  eta0: number;
  etaInf: number;
  kCross: number;
  mCross: number;
  lambdaCarreau: number;
  
  // Time dependent / Thixotropy
  gammaDotConst: number;
  gammaDotLow: number;
  gammaDotHigh: number;
  tTotal: number;
  dt: number;
  kb: number;
  kr: number;
  lambda0: number;
  a: number;

  // Oscillation
  G0: number;
  tauR: number;
  kSpring: number;
  etaDashpot: number;
  freqMin: number;
  freqMax: number;

  // Amplitude
  gamma0Min: number;
  gamma0Max: number;
  gammaY: number;
  softeningP: number;

  // Gelation / Aging / Time Sweep
  gelRate: number;
  GprimeFinal: number;
  gelT0: number;
  oscFreq: number;

  // Thermal Analysis
  currentTemp: number;
  tempMin: number;
  tempMax: number;
  tempSensitivity: number;
}

export interface ComparisonSeries {
  id: string;
  name: string;
  model: RheologyModel;
  params: RheologyParams;
  color: string;
}

export interface DataPoint {
  x: number;
  y: number;
}