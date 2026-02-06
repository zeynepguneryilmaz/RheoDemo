
import React, { useState, useMemo } from 'react';
import { RheologyModel, RheologyParams, ComparisonSeries } from './types.ts';
import { DEFAULT_PARAMS, SERIES_COLORS } from './constants.ts';
import Sidebar from './components/Sidebar.tsx';
import ChartContainer from './components/ChartContainer.tsx';
import * as MathModels from './models/rheologyCalculations.ts';

const App: React.FC = () => {
  const [model, setModel] = useState<RheologyModel>(RheologyModel.POWER_LAW);
  const [params, setParams] = useState<RheologyParams>(JSON.parse(JSON.stringify(DEFAULT_PARAMS)));
  const [activeTab, setActiveTab] = useState(0);
  const [comparisonSeries, setComparisonSeries] = useState<ComparisonSeries[]>([]);

  const updateParams = (newParams: Partial<RheologyParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleReset = () => {
    // Use deep clone to ensure default is never mutated
    setParams(JSON.parse(JSON.stringify(DEFAULT_PARAMS)));
    setModel(RheologyModel.POWER_LAW);
  };

  const clearAllSeries = () => {
    setComparisonSeries([]);
  };

  const addCurrentToComparison = () => {
    if (comparisonSeries.length >= SERIES_COLORS.length - 1) return;
    const id = Math.random().toString(36).substring(2, 9);
    // Find the next available color
    const color = SERIES_COLORS[comparisonSeries.length + 1];
    const newSeries: ComparisonSeries = {
      id,
      name: `Trace ${comparisonSeries.length + 1}`,
      model,
      params: JSON.parse(JSON.stringify(params)), // Deep copy of current state
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

  const tabs = [
    { id: 0, label: 'Flow Curves', icon: '〰️' },
    { id: 1, label: 'Freq. Sweep', icon: '📉' },
    { id: 2, label: 'Amp. Sweep', icon: '📈' },
    { id: 7, label: 'Step-Shear', icon: '⚡' },
    { id: 6, label: 'Temp. Sweep', icon: '🔥' },
    { id: 3, label: '3ITT Recovery', icon: '🩹' },
    { id: 4, label: 'Creep/Relax', icon: '🐌' },
    { id: 5, label: 'Time Sweep', icon: '⏳' }
  ];

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
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex flex-col xl:flex-row items-center justify-between gap-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400 shadow-xl shadow-slate-100 transform -rotate-2 hover:rotate-0 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">
                Rheology <span className="text-blue-600 font-medium italic lowercase tracking-normal">Playground</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Analysis Engine Live
              </p>
            </div>
          </div>

          <nav className="flex gap-1.5 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${active ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200 scale-105 z-10' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                >
                  <span className="text-sm leading-none">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ChartContainer 
                  title="Steady-State Flow (Viscosity)" defaultXAxisType="log" defaultYAxisType="log"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeFlowCurves(s.model, s.params);
                    return { x: data.map(d => d.gammaDot), y: data.map(d => d.eta), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3, shape: 'spline' }, name: s.name };
                  })} 
                  layout={{ xaxis: { title: { text: 'Shear Rate γ̇ [1/s]' } }, yaxis: { title: { text: 'Viscosity η [Pa·s]' } } }} 
                />
                <ChartContainer 
                  title="Steady-State Flow (Stress)" defaultXAxisType="log" defaultYAxisType="log"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeFlowCurves(s.model, s.params);
                    return { x: data.map(d => d.gammaDot), y: data.map(d => d.tau), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3, shape: 'spline' }, name: s.name };
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
                    { x: data.map(d => d.freq), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4 }, name: `${s.name} G'` },
                    { x: data.map(d => d.freq), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 1.5, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                })} 
                layout={{ xaxis: { title: { text: 'Frequency f [Hz]' } }, yaxis: { title: { text: 'Moduli G\', G\'\' [Pa]' } } }} 
              />
            )}

            {activeTab === 2 && (
              <ChartContainer 
                title="Amplitude Sweep (Structural Limits)" defaultXAxisType="log" defaultYAxisType="log"
                data={allPlottedSeries.flatMap((s) => {
                  const data = MathModels.computeAmplitudeSweep(s.params);
                  const traces: any[] = [
                    { x: data.map(d => d.strain), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4 }, name: `${s.name} G'` },
                    { x: data.map(d => d.strain), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 1.5, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                  if (s.id === 'live' && flowPoint) {
                    traces.push({
                      x: [flowPoint.x], y: [flowPoint.y], type: 'scatter', mode: 'markers',
                      marker: { symbol: 'circle', size: 14, line: { color: '#000', width: 2.5 }, color: 'white' },
                      name: 'Flow Point', showlegend: false
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
                  title="Step-Shear Structural Recovery" defaultXAxisType="linear" defaultYAxisType="log"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeStepShear(s.model, s.params);
                    return { x: data.map(d => d.t), y: data.map(d => d.eta), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3, shape: 'hv' }, name: s.name };
                  })} 
                  layout={{ xaxis: { title: { text: 'Time t [s]' } }, yaxis: { title: { text: 'Viscosity η [Pa·s]' } } }} 
                />
                <ChartContainer 
                  title="Structural Parameter (λ)" defaultXAxisType="linear" defaultYAxisType="linear"
                  data={allPlottedSeries.map((s) => {
                    const data = MathModels.computeStepShear(s.model, s.params);
                    return { x: data.map(d => d.t), y: data.map(d => d.lambda), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3 }, name: s.name };
                  })} 
                  layout={{ xaxis: { title: { text: 'Time t [s]' } }, yaxis: { title: { text: 'λ (Structure Level)', range: [0, 1.1] } } }} 
                />
              </div>
            )}

            {activeTab === 6 && (
              <ChartContainer 
                title="Temperature Sensitivity" defaultXAxisType="linear" defaultYAxisType="log"
                data={allPlottedSeries.flatMap((s) => {
                  const data = MathModels.computeTemperatureSweep(s.params);
                  return [
                    { x: data.map(d => d.temperature), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4 }, name: `${s.name} G'` },
                    { x: data.map(d => d.temperature), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 1.5, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                })} 
                layout={{ xaxis: { title: { text: 'Temperature T [°C]' } }, yaxis: { title: { text: 'Moduli G\', G\'\' [Pa]' } } }} 
              />
            )}

            {activeTab === 3 && (
              <ChartContainer 
                title="3-Interval Thixotropy Test (3ITT)" defaultXAxisType="linear" defaultYAxisType="log"
                data={allPlottedSeries.map((s) => {
                  const data = MathModels.computeSelfHealing(s.model, s.params);
                  return { x: data.map(d => d.t), y: data.map(d => d.eta), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3, shape: 'hv' }, name: s.name };
                })} 
                layout={{ xaxis: { title: { text: 'Time [s]' } }, yaxis: { title: { text: 'Viscosity η [Pa·s]' } } }} 
              />
            )}

            {activeTab === 4 && (
              <ChartContainer 
                title="Creep & Recovery Analysis" defaultXAxisType="linear" defaultYAxisType="linear"
                data={allPlottedSeries.map((s) => {
                  const data = MathModels.computeCreepRecovery(s.model, s.params);
                  return { x: data.map(d => d.t), y: data.map(d => d.strain), type: 'scatter', mode: 'lines', line: { color: s.color, width: 3 }, name: s.name };
                })} 
                layout={{ xaxis: { title: { text: 'Time t [s]' } }, yaxis: { title: { text: 'Strain ε [-]' } } }} 
              />
            )}

            {activeTab === 5 && (
              <ChartContainer 
                title="Aging & Gelation (Time Sweep)" defaultXAxisType="linear" defaultYAxisType="log"
                data={allPlottedSeries.flatMap((s) => {
                  const data = MathModels.computeTimeSweep(s.model, s.params);
                  const traces: any[] = [
                    { x: data.map(d => d.t), y: data.map(d => d.Gprime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 4 }, name: `${s.name} G'` },
                    { x: data.map(d => d.t), y: data.map(d => d.GdoublePrime), type: 'scatter', mode: 'lines', line: { color: s.color, width: 1.5, dash: 'dot' }, name: `${s.name} G''` }
                  ];
                  if (s.id === 'live' && gelPoint) {
                    traces.push({
                      x: [gelPoint.t], y: [gelPoint.g], type: 'scatter', mode: 'markers',
                      marker: { symbol: 'diamond', size: 14, color: '#2563eb', line: { color: 'white', width: 2 } },
                      name: 'Gel Point', showlegend: false
                    });
                  }
                  return traces;
                })} 
                layout={{ 
                  xaxis: { title: { text: 'Time t [s]' } }, 
                  yaxis: { title: { text: 'Moduli G\', G\'\' [Pa]' } }
                }} 
              />
            )}
          </div>
        </div>

        <div className="absolute bottom-6 right-8 pointer-events-none select-none hidden lg:block">
          <div className="flex flex-col items-end gap-1 opacity-20">
             <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Laboratory Data Stream</div>
             <div className="flex gap-1.5 mt-1">
                {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
