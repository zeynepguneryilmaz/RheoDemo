
import { RheologyModel, RheologyParams } from '../types.ts';
import { logSpace, linSpace } from './mathUtils.ts';

const getThermalFactor = (p: RheologyParams, overrideTemp?: number) => {
  const refTemp = 25;
  const targetTemp = overrideTemp !== undefined ? overrideTemp : p.currentTemp;
  // Arrhenius-like sensitivity: η = η0 * exp(-α(T-T0))
  return Math.exp(-p.tempSensitivity * (targetTemp - refTemp));
};

export const computeFlowCurves = (model: RheologyModel, p: RheologyParams) => {
  const rates = logSpace(p.gammaDotMin, p.gammaDotMax, 100);
  const fT = getThermalFactor(p);
  const K_eff = p.K * fT;
  const tau0_eff = p.tau0 * fT;
  const eta0_eff = p.eta0 * fT;
  const etaInf_eff = p.etaInf * fT;

  return rates.map((g) => {
    let tau = 0;
    let eta = 0;
    switch (model) {
      case RheologyModel.NEWTONIAN:
        tau = K_eff * g;
        eta = K_eff;
        break;
      case RheologyModel.POWER_LAW:
        tau = K_eff * Math.pow(g, p.n);
        eta = tau / g;
        break;
      case RheologyModel.CROSS:
        eta = etaInf_eff + (eta0_eff - etaInf_eff) / (1 + Math.pow(p.kCross * g, p.mCross));
        tau = eta * g;
        break;
      case RheologyModel.CARREAU:
        eta = etaInf_eff + (eta0_eff - etaInf_eff) * Math.pow(1 + Math.pow(p.lambdaCarreau * g, 2), (p.n - 1) / 2);
        tau = eta * g;
        break;
      case RheologyModel.HERSCHEL_BULKLEY:
        tau = tau0_eff + K_eff * Math.pow(g, p.n);
        eta = tau / g;
        break;
      case RheologyModel.CASSON:
        tau = Math.pow(Math.sqrt(tau0_eff) + Math.sqrt(K_eff * g), 2);
        eta = tau / g;
        break;
      case RheologyModel.BINGHAM:
        tau = tau0_eff + K_eff * g;
        eta = tau / g;
        break;
      case RheologyModel.MAXWELL:
        // Maxwell Viscosity η = G * τ_relaxation
        eta = (p.G0 * p.tauR) * fT;
        tau = eta * g;
        break;
      case RheologyModel.KELVIN_VOIGT:
        // Kelvin-Voigt is a solid. No steady state flow.
        // We simulate a high 'apparent' viscosity for visualization
        eta = 1e6;
        tau = eta * g;
        break;
      default:
        tau = tau0_eff + K_eff * Math.pow(g, p.n);
        eta = tau / g;
    }
    return { gammaDot: g, tau: tau, eta: eta };
  });
};

export const computeOscillatory = (model: RheologyModel, p: RheologyParams) => {
  const freqs = logSpace(p.freqMin, p.freqMax, 100);
  const fT = getThermalFactor(p);
  const G0_eff = p.G0 * fT;
  const kSpring_eff = p.kSpring * fT;
  const etaDashpot_eff = p.etaDashpot * fT;

  return freqs.map((f) => {
    const w = 2 * Math.PI * f;
    let Gp = 0;
    let Gdp = 0;
    
    if (model === RheologyModel.MAXWELL) {
      const d = 1 + Math.pow(w * p.tauR, 2);
      Gp = G0_eff * (Math.pow(w * p.tauR, 2) / d);
      Gdp = G0_eff * ((w * p.tauR) / d);
    } else if (model === RheologyModel.KELVIN_VOIGT) {
      Gp = kSpring_eff;
      Gdp = w * etaDashpot_eff;
    } else if (model === RheologyModel.GELATION) {
      Gp = G0_eff * Math.pow(w, 0.5);
      Gdp = G0_eff * Math.pow(w, 0.5) * Math.tan(Math.PI * 0.25);
    } else {
      // General Structural Fluid oscillation
      Gp = G0_eff * Math.pow(w, 0.18);
      Gdp = (G0_eff * 0.3) * Math.pow(w, 0.22);
    }
    return { freq: f, Gprime: Math.max(1e-4, Gp), GdoublePrime: Math.max(1e-4, Gdp) };
  });
};

export const computeAmplitudeSweep = (p: RheologyParams) => {
  const strains = logSpace(p.gamma0Min, p.gamma0Max, 100);
  const fT = getThermalFactor(p);
  const G0_eff = p.G0 * fT;

  return strains.map((g0) => {
    // Structural breakdown logic based on yield strain
    const structuralPurity = 1 / (1 + Math.pow(g0 / p.gammaY, p.softeningP));
    const Gp = G0_eff * structuralPurity;
    const peak = Math.exp(-Math.pow(Math.log(g0 / p.gammaY), 2) / 1.0);
    const Gdp = (G0_eff * 0.2) * (structuralPurity + 3.0 * peak + 0.05);
    return { strain: g0, Gprime: Math.max(1e-3, Gp), GdoublePrime: Math.max(1e-3, Gdp) };
  });
};

export const computeTemperatureSweep = (p: RheologyParams) => {
  const temperatures = linSpace(p.tempMin, p.tempMax, 100);
  return temperatures.map((T) => {
    const fT = getThermalFactor(p, T);
    const Gp = p.G0 * fT;
    const Gdp = (p.G0 * 0.2) * fT * (1 + 0.005 * (T - 25));
    return { temperature: T, Gprime: Math.max(1e-3, Gp), GdoublePrime: Math.max(1e-3, Gdp) };
  });
};

export const computeCreepRecovery = (model: RheologyModel, p: RheologyParams) => {
  const times = linSpace(0, p.tTotal, 300);
  const tSwitch = p.tTotal / 2;
  const fT = getThermalFactor(p);
  const G0_eff = p.G0 * fT || 1000;
  const kSpring_eff = p.kSpring * fT || 1000;
  const etaDashpot_eff = p.etaDashpot * fT || 200;
  const K_eff = p.K * fT || 10;
  const stress = G0_eff * 0.05; 
  
  return times.map((t) => {
    let strain = 0;
    const isCreep = t <= tSwitch;
    if (model === RheologyModel.MAXWELL) {
      const tau = p.tauR || 1;
      if (isCreep) {
        strain = (stress / G0_eff) + (stress * t / (G0_eff * tau));
      } else {
        const strainAtSwitch = (stress / G0_eff) + (stress * tSwitch / (G0_eff * tau));
        strain = strainAtSwitch - (stress / G0_eff); 
      }
    } else if (model === RheologyModel.KELVIN_VOIGT) {
      const retTime = etaDashpot_eff / kSpring_eff;
      if (isCreep) {
        strain = (stress / kSpring_eff) * (1 - Math.exp(-t / retTime));
      } else {
        const strainAtSwitch = (stress / kSpring_eff) * (1 - Math.exp(-tSwitch / retTime));
        strain = strainAtSwitch * Math.exp(-(t - tSwitch) / retTime);
      }
    } else {
      if (isCreep) {
        strain = (stress / (K_eff + 1)) * Math.pow(t, 0.45);
      } else {
        strain = (stress / (K_eff + 1)) * Math.pow(tSwitch, 0.45) * 0.8;
      }
    }
    return { t: t, strain: strain };
  });
};

export const computeStepShear = (model: RheologyModel, p: RheologyParams) => {
  const pts = 200;
  const times = linSpace(0, p.tTotal, pts);
  let lambdaValue = p.lambda0;
  const dt = p.tTotal / pts;
  const fT = getThermalFactor(p);
  const K_eff = p.K * fT;

  return times.map((t) => {
    const g = (t > p.tTotal * 0.3 && t < p.tTotal * 0.6) ? p.gammaDotHigh : p.gammaDotLow;
    let dLambda = 0;
    if (model === RheologyModel.THIXOTROPY) {
      dLambda = p.kr * (1 - lambdaValue) - p.kb * g * lambdaValue;
    } else if (model === RheologyModel.RHEOPEXY) {
      dLambda = p.kr * (1 - lambdaValue) + p.kb * g * (1 - lambdaValue);
    } else {
      dLambda = 0.1 * (1 - lambdaValue) - 0.01 * g * lambdaValue;
    }
    lambdaValue = Math.min(1, Math.max(0, lambdaValue + dLambda * dt));
    const structuralK = K_eff * (1 + p.a * lambdaValue);
    const eta = structuralK * Math.pow(g, p.n - 1);
    return { t: t, eta: eta, lambda: lambdaValue, gammaDot: g };
  });
};

export const computeSelfHealing = (model: RheologyModel, p: RheologyParams) => {
  return computeStepShear(model, p).map(d => ({ ...d, recovery: d.lambda * 100 }));
};

export const computeTimeSweep = (model: RheologyModel, p: RheologyParams) => {
  const fT = getThermalFactor(p);
  const GprimeFinal_eff = p.GprimeFinal * fT;
  return linSpace(0, p.tTotal, 100).map((t) => {
    const dt_eff = Math.max(0, t - p.gelT0);
    const Gp = GprimeFinal_eff * (1 - Math.exp(-p.gelRate * dt_eff));
    const Gdp = (0.15 * GprimeFinal_eff) + (0.45 * GprimeFinal_eff * Math.exp(-p.gelRate * dt_eff * 0.7));
    return { t: t, Gprime: Gp, GdoublePrime: Gdp };
  });
};
