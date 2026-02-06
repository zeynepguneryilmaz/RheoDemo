
import React, { useState, useMemo, useEffect } from 'react';
import { RheologyModel, RheologyParams, ComparisonSeries } from './types.ts';
import { DEFAULT_PARAMS, SERIES_COLORS } from './constants.ts';
import Sidebar from './components/Sidebar.tsx';
import ChartContainer from './components/ChartContainer.tsx';
import * as MathModels from './models/rheologyCalculations.ts';

/**
 * Maps each RheologyModel to the tabs that are physically meaningful for it.
 * Tabs: 0: Flow, 1: Freq, 2: Amp, 3: 3ITT, 4: Creep, 5: Time, 6: Temp, 7: Step-Shear
 */
const MODEL_TAB_MAPPING: Record<RheologyModel, number[]> = {
  [RheologyModel.NEWTONIAN]: [0, 6],
  [RheologyModel.POWER_LAW]: [0, 6],
  [RheologyModel.CROSS]: [0, 6],
  [RheologyModel.CARREAU]: [0, 6],
  [RheologyModel.HERSCHEL_BULKLEY]: [0, 1, 2, 3, 6, 7],
  [RheologyModel.CASSON]: [0, 1, 2, 3, 6, 7],
  [RheologyModel.BINGHAM]: [0, 1, 2, 3, 6, 7],
  [RheologyModel.THIXOTROPY]: [0, 3, 6, 7],
  [RheologyModel.RHEOPEXY]: [0, 3, 6, 7],
  [RheologyModel.MAXWELL]: [0, 1, 4, 6],
  [RheologyModel.KELVIN_VOIGT]: [1, 4, 6],
  [RheologyModel.GELATION]: [1, 5, 6]
};

const App: React.FC = () => {
  const [model, setModel] = useState<RheologyModel>(RheologyModel.POWER_LAW);
  const [params, setParams] = useState<RheologyParams>(JSON.parse(JSON.stringify(DEFAULT_PARAMS)));
  const [activeTab, setActiveTab] = useState(0);
  const [comparisonSeries, setComparisonSeries] = useState<ComparisonSeries[]>([]);

  const updateParams = (newParams: Partial<RheologyParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleReset = () => {
    setParams(JSON.parse(JSON.stringify(DEFAULT_PARAMS)));
    setModel(RheologyModel.POWER_LAW);
  };

  const addCurrentToComparison = () => {
    if (comparisonSeries.length >= SERIES_COLORS.length - 1) return;
    const id = Math.random().toString(36).substring(2, 9);
    const color = SERIES_COLORS[comparisonSeries.length + 1];
    const newSeries: ComparisonSeries = {
      id,
      name: `Trace ${comparisonSeries.length + 1}`,
      model,
      params: JSON.parse(JSON.stringify(params)),
      color
    };
    setComparisonSeries((prev) => [...prev, newSeries]);
  };

  const allPlottedSeries = useMemo(() => {
    const live = { id: 'live', name: 'Active Simulation', model, params, color: SERIES_COLORS[0] };
    return [live, ...comparisonSeries];
  }, [model, params, comparisonSeries]);

  const gelPoint = useMemo(() => {
    const data = MathModels.computeTimeSweep(model, params);
    for (let i = 0; i < data.length - 1; i++) {
      const d1 = data[i];
      const d2 = data[i + 1];
      if ((d1.Gprime - d1.GdoublePrime) * (d2.Gprime - d2.GdoublePrime) <= 0) {
        const t1 = d1.t;
        const t2 = d2.t;
        const diff1 = d1.Gprime - d1.GdoublePrime;
        const diff2 = d2.Gprime - d2.GdoublePrime;
        if (Math.abs(diff2 - diff1) < 1e-12) continue;
        const tCross = t1 - diff1 * (t2 - t1) / (diff2 - diff1);
        const gCross = d1.Gprime + (tCross - t1) * (d2.Gprime - d1.Gprime) / (t2 - t1);
        return { t: tCross, g: gCross };
      }
    }
    return null;
  }, [params, model]);

  const flowPoint = useMemo(() => {
    const data = MathModels.computeAmplitudeSweep(params);
    for (let i = 0; i < data.length - 1; i++) {
      const d1 = data[i];
      const d2 = data[i + 1];
      if ((d1.Gprime - d1.GdoublePrime) * (d2.Gprime - d2.GdoublePrime) <= 0) {
        const lx1 = Math.log10(d1.strain);
        const lx2 = Math.log10(d2.strain);
        const ly1p = Math.log10(d1.Gprime);
        const ly2p = Math.log10(d2.Gprime);
        const ly1pp = Math.log10(d1.GdoublePrime);
        const ly2pp = Math.log10(d2.GdoublePrime);
        const slopeP = (ly2p - ly1p) / (lx2 - lx1);
        const slopePP = (ly2pp - ly1pp) / (lx2 - lx1);
        const denom = slopeP - slopePP;
        if (Math.abs(denom) < 1e-10) continue;
        const lx = lx1 + (ly1pp - ly1p) / denom;
        const ly = ly1p + slopeP * (lx - lx1);
        return { x: Math.pow(10, lx), y: Math.pow(10, ly) };
      }
    }
    return null;
  }, [params]);

  const allTabs = [
    { id: 0, label: 'Flow Curves', icon: '〰️' },
    { id: 1, label: 'Freq. Sweep', icon: '📉' },
    { id: 2, label: 'Amp. Sweep', icon: '📈' },
    { id: 7, label: 'Step-Shear', icon: '⚡' },
    { id: 6, label: 'Temp. Sweep', icon: '🔥' },
    { id: 3, label: '3ITT Recovery', icon: '🩹' },
    { id: 4, label: 'Creep/Relax', icon: '🐌' },
    { id: 5, label: 'Time Sweep', icon: '⏳' }
  ];

  const visibleTabs = useMemo(() => {
    const allowedIds = MODEL_TAB_MAPPING[model] || [0, 6];
    return allTabs.filter(tab => allowedIds.includes(tab.id));
  }, [model]);

  useEffect(() => {
    if (!visibleTabs.some(t => t.id === activeTab)) {
      setActiveTab(visibleTabs[0]?.id ?? 0);
    }
  }, [visibleTabs, activeTab]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      <Sidebar 
        model={model} setModel={setModel} 
        params={params} setParams={updateParams} 
        onReset={handleReset}
        comparisonSeries={comparisonSeries}
        onAddSeries={addCurrentToComparison}
        onRemoveSeries={(id) => setComparisonSeries(c => c.filter(s => s.id !== id))}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex flex-col xl:flex-row items-center justify-between gap-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-5 shrink-0">
            <div className="relative w-14 h-14 bg-slate-950 rounded-[1.25rem] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/20"></div>
              <svg className="w-9 h-9 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C4 12 7 15 12 15C17 15 20 12 20 12" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M4 8C4 8 7 11 12 11C17 11 20 8 20 8" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M4 16C4 16 7 19 12 19C17 19 20 16 20 16" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Rheo<span className="text-blue-600">demo</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                Advanced Analysis Suite
              </p>
            </div>
          </div>

          <nav className="flex gap-2 p-2 bg-slate-100/60 rounded-[1.25rem] border border-slate-200/50 overflow-x-auto custom-scrollbar-h scroll-smooth max-w-full xl:max-w-2xl 2xl:max-w-4xl">
            {visibleTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${active ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-slate-200 scale-[1.03] z-10' : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'}`}
                >
                  <span className="text-sm leading-none">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {activeTab === 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ChartContainer 
                  title="Steady-State Flow (Viscosity)" defaultXAxisType="log" defaultYAxisType="log"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeFlowCurves(s.model, s.params);
                    return { x: data.map(d => d.gammaDot), y: data.map(d => d.eta), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3.5, shape: 'spline' }, name: s.name };
                  })} 
                  layout={{ xaxis: { title: { text: 'Shear Rate γ̇ [1/s]' } }, yaxis: { title: { text: 'Viscosity η [Pa·s]' } } }} 
                />
                <ChartContainer 
                  title="Steady-State Flow (Stress)" defaultXAxisType="log" defaultYAxisType="log"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeFlowCurves(s.model, s.params);
                    return { x: data.map(d => d.gammaDot), y: data.map(d => d.tau), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3.5, shape: 'spline' }, name: s.name };
                  })} 
                  layout={{ xaxis: { title: { text: 'Shear Rate γ̇ [1/s]' } }, yaxis: { title: { text: 'Shear Stress τ [Pa]' } } }} 
                />
              </div>
            )}

            {activeTab === 1 && (
              <ChartContainer 
                title="Dynamic Frequency Sweep" defaultXAxisType="log" defaultYAxisType="log"
                data={allPlottedSeries.flatMap((s) => {
                  const data = MathModels.computeOscillatory(s.model, s.params);
                  return [
                    { x: data.map(d => d.freq), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4.5 }, name: `${s.name} G'` },
                    { x: data.map(d => d.freq), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 2, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                })} 
                layout={{ xaxis: { title: { text: 'Frequency f [Hz]' } }, yaxis: { title: { text: 'Moduli G\', G\'\' [Pa]' } } }} 
              />
            )}

            {activeTab === 2 && (
              <ChartContainer 
                title="Amplitude Sweep (LVE Range)" defaultXAxisType="log" defaultYAxisType="log"
                data={allPlottedSeries.flatMap((s) => {
                  const data = MathModels.computeAmplitudeSweep(s.params);
                  const traces: any[] = [
                    { x: data.map(d => d.strain), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4.5 }, name: `${s.name} G'` },
                    { x: data.map(d => d.strain), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 2, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                  if (s.id === 'live' && flowPoint) {
                    traces.push({
                      x: [flowPoint.x], y: [flowPoint.y], type: 'scatter', mode: 'markers',
                      marker: { symbol: 'circle', size: 14, line: { color: '#000', width: 2.5 }, color: 'white' },
                      name: 'Yield Point', showlegend: false
                    });
                  }
                  return traces;
                })} 
                layout={{ 
                  xaxis: { title: { text: 'Strain γ [%]' } }, 
                  yaxis: { title: { text: 'Moduli G\', G\'\' [Pa]' } }
                }} 
              />
            )}

            {activeTab === 7 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ChartContainer 
                  title="Structural Regeneration" defaultXAxisType="linear" defaultYAxisType="log"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeStepShear(s.model, s.params);
                    return { x: data.map(d => d.t), y: data.map(d => d.eta), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3.5, shape: 'hv' }, name: s.name };
                  })} 
                  layout={{ xaxis: { title: { text: 'Time t [s]' } }, yaxis: { title: { text: 'Viscosity η [Pa·s]' } } }} 
                />
                <ChartContainer 
                  title="Structure Evolution (λ)" defaultXAxisType="linear" defaultYAxisType="linear"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeStepShear(s.model, s.params);
                    return { x: data.map(d => d.t), y: data.map(d => d.lambda), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3.5 }, name: s.name };
                  })} 
                  layout={{ xaxis: { title: { text: 'Time t [s]' } }, yaxis: { title: { text: 'λ (Network State)', range: [0, 1.1] } } }} 
                />
              </div>
            )}

            {activeTab === 6 && (
              <ChartContainer 
                title="Thermo-Rheological Behavior" defaultXAxisType="linear" defaultYAxisType="log"
                data={allPlottedSeries.flatMap((s) => {
                  const data = MathModels.computeTemperatureSweep(s.params);
                  return [
                    { x: data.map(d => d.temperature), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4.5 }, name: `${s.name} G'` },
                    { x: data.map(d => d.temperature), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 2, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                })} 
                layout={{ xaxis: { title: { text: 'Temperature T [°C]' } }, yaxis: { title: { text: 'Moduli G\', G\'\' [Pa]' } } }} 
              />
            )}

            {activeTab === 3 && (
              <ChartContainer 
                title="Interval Thixotropy Test (3ITT)" defaultXAxisType="linear" defaultYAxisType="log"
                data={allPlottedSeries.map((s) => {
                  const data = MathModels.computeSelfHealing(s.model, s.params);
                  return { x: data.map(d => d.t), y: data.map(d => d.eta), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3.5, shape: 'hv' }, name: s.name };
                })} 
                layout={{ xaxis: { title: { text: 'Time [s]' } }, yaxis: { title: { text: 'Viscosity η [Pa·s]' } } }} 
              />
            )}

            {activeTab === 4 && (
              <ChartContainer 
                title="Creep Compliance & Relaxation" defaultXAxisType="linear" defaultYAxisType="linear"
                data={allPlottedSeries.map((s) => {
                  const data = MathModels.computeCreepRecovery(s.model, s.params);
                  return { x: data.map(d => d.t), y: data.map(d => d.strain), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3.5 }, name: s.name };
                })} 
                layout={{ xaxis: { title: { text: 'Time t [s]' } }, yaxis: { title: { text: 'Strain γ [-]' } } }} 
              />
            )}

            {activeTab === 5 && (
              <ChartContainer 
                title="Kinetics of Gelation" defaultXAxisType="linear" defaultYAxisType="log"
                data={allPlottedSeries.flatMap((s) => {
                  const data = MathModels.computeTimeSweep(s.model, s.params);
                  const traces: any[] = [
                    { x: data.map(d => d.t), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4.5 }, name: `${s.name} G'` },
                    { x: data.map(d => d.t), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 2, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                  if (s.id === 'live' && gelPoint) {
                    traces.push({
                      x: [gelPoint.t], y: [gelPoint.g], type: 'scatter', mode: 'markers',
                      marker: { symbol: 'diamond', size: 14, color: '#3b82f6', line: { color: 'white', width: 2.5 } },
                      name: 'Sol-Gel Point', showlegend: false
                    });
                  }
                  return traces;
                })} 
                layout={{ 
                  xaxis: { title: { text: 'Time t [s]' } }, 
                  yaxis: { title: { text: 'Dynamic Moduli [Pa]' } }
                }} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
