
import React, { useState } from 'react';
import { RheologyModel, RheologyParams, ComparisonSeries } from '../types.ts';
import { SERIES_COLORS, MATERIAL_PROFILES, DEFAULT_PARAMS } from '../constants.ts';
import TheoryModal from './TheoryModal.tsx';

interface SidebarProps {
  model: RheologyModel;
  setModel: (m: RheologyModel) => void;
  params: RheologyParams;
  setParams: (p: Partial<RheologyParams>) => void;
  onReset: () => void;
  comparisonSeries: ComparisonSeries[];
  onAddSeries: () => void;
  onRemoveSeries: (id: string) => void;
}

const PARAM_METADATA: any = {
  K: { desc: "Consistency Index: Higher K indicates a 'thicker' fluid at 1s⁻¹ shear rate.", unit: "Pa·sⁿ" },
  n: { desc: "Flow Index: n < 1 (Pseudoplastic/Thinning), n = 1 (Newtonian), n > 1 (Dilatant/Thickening).", unit: "[-]" },
  tau0: { desc: "Yield Stress (τ₀): The minimum threshold force required to initiate flow.", unit: "Pa" },
  eta0: { desc: "Zero-Shear Viscosity (η₀): Maximum plateau viscosity at extremely low flow speeds.", unit: "Pa·s" },
  etaInf: { desc: "Infinite-Shear Viscosity (η∞): Minimum plateau viscosity at extremely high flow speeds.", unit: "Pa·s" },
  kCross: { desc: "Cross Constant: Controls the specific shear rate where thinning begins.", unit: "s" },
  mCross: { desc: "Cross Exponent: Slope of the viscosity drop-off region.", unit: "[-]" },
  lambdaCarreau: { desc: "Relaxation Time (λ): Time constant for the transition to shear thinning.", unit: "s" },
  G0: { desc: "Storage Modulus (G₀): Represents internal stiffness and structural elastic energy storage.", unit: "Pa" },
  tauR: { desc: "Relaxation Time (τR): Characteristic time for stress dissipation in liquids.", unit: "s" },
  gammaY: { desc: "Yield Strain (γy): Limit of structural elasticity; flow starts beyond this strain.", unit: "%" },
  kb: { desc: "Breakdown Rate: Kinetics of structural destruction under mechanical shear.", unit: "s⁻¹" },
  kr: { desc: "Recovery Rate: Kinetics of structural regeneration (self-healing) at rest.", unit: "s⁻¹" },
  currentTemp: { desc: "Temperature: Simulation of environmental thermal effects on viscosity.", unit: "°C" },
  tempSensitivity: { desc: "Thermal Sensitivity: Determines how rapidly properties decay with heat.", unit: "K⁻¹" }
};

const Sidebar: React.FC<SidebarProps> = ({ 
  model, setModel, params, setParams, onReset, 
  comparisonSeries, onAddSeries, onRemoveSeries 
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'parameters' | 'examples'>('parameters');

  const ControlRow = (props: any) => {
    const { label, value, min, max, step, paramKey, log = false } = props;
    const sliderValue = log ? Math.log10(value) : value;
    const sliderMin = log ? Math.log10(min) : min;
    const sliderMax = log ? Math.log10(max) : max;
    const meta = PARAM_METADATA[paramKey] || { desc: "Parameter value", unit: "" };

    return (
      <div className="mb-8 relative group/row">
        <div className="flex justify-between items-center mb-2.5">
          <div className="relative flex items-center gap-2 cursor-help group/label">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/label:text-slate-900 transition-colors">
              {label}
            </label>
            <span className="text-[9px] text-slate-300 font-bold lowercase italic">{meta.unit}</span>
            <div className="absolute bottom-full left-0 mb-4 w-72 opacity-0 group-hover/label:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover/label:translate-y-0 z-50">
              <div className="bg-slate-900 text-white text-[11px] p-5 rounded-3xl shadow-2xl border border-slate-700 leading-relaxed font-medium backdrop-blur-xl">
                <div className="mb-2.5 text-blue-400 font-black uppercase tracking-widest text-[9px] border-b border-white/10 pb-2">Physics Insight</div>
                {meta.desc}
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase tracking-tighter text-[9px]">Units</span>
                  <span className="text-white font-black font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-md">{meta.unit}</span>
                </div>
              </div>
              <div className="w-3 h-3 bg-slate-900 rotate-45 -mt-1.5 ml-4 border-r border-b border-slate-700"></div>
            </div>
          </div>
          <span className="font-mono text-[11px] text-blue-600 font-black bg-blue-50/50 px-2.5 py-0.5 rounded-lg border border-blue-100/50">
            {typeof value === 'number' ? value.toFixed(value < 0.01 ? 4 : value < 0.1 ? 3 : 2) : value}
          </span>
        </div>
        <div className="relative flex items-center h-4">
            <div className="absolute w-full h-1.5 bg-slate-100 rounded-full"></div>
            <input
              type="range" min={sliderMin} max={sliderMax} step={step || (log ? 0.01 : (max - min) / 100)}
              value={sliderValue}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setParams({ [paramKey]: log ? Math.pow(10, val) : val });
              }}
              className="w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-blue-600 transition-all z-10"
            />
        </div>
      </div>
    );
  };

  return (
    <>
      <aside className="w-full lg:w-[400px] h-full overflow-y-auto bg-white border-r border-slate-200 flex flex-col custom-scrollbar shrink-0 z-20">
        <div className="flex border-b border-slate-100 shrink-0 p-2 bg-slate-50/50">
          <button onClick={() => setSidebarMode('parameters')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${sidebarMode === 'parameters' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Parameters</button>
          <button onClick={() => setSidebarMode('examples')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${sidebarMode === 'examples' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Material Lib</button>
        </div>

        <div className="p-10 space-y-12 flex-1 overflow-y-auto custom-scrollbar">
          {sidebarMode === 'examples' ? (
            <section className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="mb-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 italic">Industry Library</h3>
                <p className="text-sm font-bold text-slate-900 uppercase">Preset Material Data</p>
              </div>
              <div className="space-y-4">
                {MATERIAL_PROFILES.map((profile) => {
                  const isActive = model === profile.model && Math.abs(params.K - (profile.params.K || 0)) < 0.001;
                  return (
                    <button key={profile.name} onClick={() => { setModel(profile.model); setParams(profile.params); }} className={`w-full text-left p-5 rounded-[1.5rem] border transition-all relative group/btn ${isActive ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.02]' : 'border-slate-100 hover:border-slate-300 bg-slate-50/30'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-black uppercase tracking-tight">{profile.name}</span>
                        <svg className={`w-4 h-4 transition-transform group-hover/btn:translate-x-1 ${isActive ? 'text-blue-400' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                      </div>
                      <p className={`text-[10px] leading-relaxed line-clamp-2 font-medium ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>{profile.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="relative group/select mb-12">
                <div className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-black text-blue-600 uppercase tracking-widest z-10">Fluid Model</div>
                <select value={model} onChange={(e) => setModel(e.target.value as RheologyModel)} className="w-full p-5 bg-white border-2 border-slate-100 hover:border-blue-500 text-[12px] font-black rounded-2xl outline-none cursor-pointer transition-all appearance-none shadow-sm">
                  {Object.values(RheologyModel).map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-emerald-600 rounded-full"></span> Environmental
                  </h3>
                  <ControlRow label="Temperature" value={params.currentTemp} min={params.tempMin} max={params.tempMax} step={1} paramKey="currentTemp" />
                  <ControlRow label="Thermal Sens." value={params.tempSensitivity} min={0} max={0.2} step={0.001} paramKey="tempSensitivity" />
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span> Viscosity Profile
                  </h3>
                  {(model === RheologyModel.CROSS || model === RheologyModel.CARREAU) ? (
                    <>
                      <ControlRow label="Zero-Shear η₀" value={params.eta0} min={1} max={10000} paramKey="eta0" log={true} />
                      <ControlRow label="Inf-Shear η∞" value={params.etaInf} min={0.001} max={10} paramKey="etaInf" log={true} />
                      {model === RheologyModel.CROSS && <ControlRow label="Cross Constant k" value={params.kCross} min={0.01} max={10} paramKey="kCross" log={true} />}
                      {model === RheologyModel.CARREAU && <ControlRow label="Relaxation λ" value={params.lambdaCarreau} min={0.01} max={10} paramKey="lambdaCarreau" log={true} />}
                      <ControlRow label="Power Index n" value={params.n} min={0.1} max={1.0} step={0.01} paramKey="n" />
                    </>
                  ) : (
                    <>
                      <ControlRow label="Consistency K" value={params.K} min={0.001} max={1000} paramKey="K" log={true} />
                      <ControlRow label="Flow Index n" value={params.n} min={0.05} max={3.0} step={0.01} paramKey="n" />
                      {(model.includes('Yield') || model.includes('Bingham') || model.includes('Herschel') || model.includes('Casson')) && <ControlRow label="Yield Stress τ₀" value={params.tau0} min={0} max={500} paramKey="tau0" />}
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-purple-600 rounded-full"></span> Network Stiffness
                  </h3>
                  <ControlRow label="Modulus G₀" value={params.G0} min={1} max={100000} paramKey="G0" log={true} />
                  <ControlRow label="Critical Strain γY" value={params.gammaY} min={0.01} max={500} paramKey="gammaY" log={true} />
                </div>
              </div>
            </section>
          )}

          <section className="pt-10 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Trace Registry</h3>
            <button 
              onClick={onAddSeries} 
              disabled={comparisonSeries.length >= 7}
              className="w-full py-4.5 bg-white border-2 border-slate-900 text-slate-900 text-[11px] font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest active:scale-95 flex items-center justify-center gap-3 group/store disabled:opacity-30 disabled:pointer-events-none mb-6"
            >
              <svg className="w-4 h-4 group-hover/store:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              Save Current Trace ({comparisonSeries.length}/7)
            </button>
            
            <div className="space-y-2">
              {comparisonSeries.map((series) => (
                <div key={series.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: series.color }}></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{series.name}</span>
                  </div>
                  <button onClick={() => onRemoveSeries(series.id)} className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {comparisonSeries.length === 0 && (
                <p className="text-center text-[9px] font-bold text-slate-300 uppercase italic py-4">No snapshots saved</p>
              )}
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          <button onClick={onReset} className="flex-1 py-4.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 text-[11px] font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest">Reset Knobs</button>
          <button onClick={() => setIsGuideOpen(true)} className="flex-[2] py-4.5 bg-blue-600 text-white text-[11px] font-black rounded-2xl hover:bg-blue-700 uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-200 active:scale-95">Theory Hub</button>
        </div>
      </aside>
      <TheoryModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
};

export default Sidebar;
