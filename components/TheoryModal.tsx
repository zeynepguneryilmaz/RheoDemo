import React from 'react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-7xl max-h-[95vh] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
        
        {/* Header */}
        <div className="px-6 md:px-12 py-6 md:py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 flex items-center justify-center text-blue-400 shadow-lg">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight">RheoGuide <span className="text-blue-600 font-medium lowercase italic tracking-tight">Theory Hub</span></h2>
              <p className="text-[9px] md:text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Physics Methodology & Variable Blueprint</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 md:p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-500 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar space-y-16 bg-gradient-to-b from-white to-slate-50/20">
          
          {/* Section 1: Fluid Taxonomy */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">1. Fluid Classification (Viscosity η vs. Shear Rate γ̇)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Newtonian */}
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Newtonian</p>
                    <p className="text-xs text-slate-700 font-bold italic">η = Constant</p>
                  </div>
                  <svg className="w-20 h-14" viewBox="0 0 100 60">
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="10" y1="50" x2="10" y2="10" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="10" y1="30" x2="90" y2="30" stroke="#2563eb" strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">Viscosity remains constant regardless of the intensity of stirring. Examples include water and simple oils. Their internal structure is too simple to be oriented by flow.</p>
              </div>

              {/* Shear-Thinning */}
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Pseudoplastic</p>
                    <p className="text-xs text-slate-700 font-bold italic">n {'<'} 1 (Thinning)</p>
                  </div>
                  <svg className="w-20 h-14" viewBox="0 0 100 60">
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="10" y1="50" x2="10" y2="10" stroke="#cbd5e1" strokeWidth="1" />
                    <path d="M10,15 Q30,45 90,48" fill="none" stroke="#e11d48" strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">Long-chain molecules or particles untangle and align with the flow direction, reducing resistance. This is common in blood, shampoo, and liquid chocolate.</p>
              </div>

              {/* Dilatant */}
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Dilatant</p>
                    <p className="text-xs text-slate-700 font-bold italic">n {'>'} 1 (Thickening)</p>
                  </div>
                  <svg className="w-20 h-14" viewBox="0 0 100 60">
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="10" y1="50" x2="10" y2="10" stroke="#cbd5e1" strokeWidth="1" />
                    <path d="M10,48 Q60,45 90,15" fill="none" stroke="#059669" strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">Suspended particles 'jam' into one another as speed increases, creating a temporary solid block. The classic example is a cornstarch and water mix (Oobleck).</p>
              </div>

              {/* Bingham */}
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Bingham Plastic</p>
                    <p className="text-xs text-slate-700 font-bold italic">τ = τ₀ + ηₚγ̇</p>
                  </div>
                  <svg className="w-20 h-14" viewBox="0 0 100 60">
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="10" y1="50" x2="10" y2="10" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="10" y1="35" x2="90" y2="15" stroke="#d97706" strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">Acts as a solid until a specific 'Yield Stress' is reached. Once exceeded, it flows like a liquid. Perfect for toothpaste and heavy industrial grease.</p>
              </div>

              {/* Thixotropic */}
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Thixotropic</p>
                    <p className="text-xs text-slate-700 font-bold italic">Time-Thinning</p>
                  </div>
                  <svg className="w-20 h-14" viewBox="0 0 100 60">
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="10" y1="50" x2="10" y2="10" stroke="#cbd5e1" strokeWidth="1" />
                    <path d="M10,50 Q40,10 90,10 Q50,45 10,50" fill="rgba(79,70,229,0.1)" stroke="#4f46e5" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">Viscosity breaks down over time under constant stress and rebuilds structure during rest. Essential for paint that levels out flat without dripping.</p>
              </div>

              {/* Viscoelastic */}
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase mb-1">Viscoelastic</p>
                    <p className="text-xs text-slate-700 font-bold italic">G' vs G''</p>
                  </div>
                  <svg className="w-20 h-14" viewBox="0 0 100 60">
                    <path d="M10,30 Q20,10 30,30 T50,30 T70,30 T90,30" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2,1" />
                    <path d="M15,30 Q25,10 35,30 T55,30 T75,30 T95,30" fill="none" stroke="#0f172a" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">Simultaneously elastic (stores energy) and viscous (dissipates energy). The phase delay between stress and strain defines its solid-like or liquid-like character.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Variable Lexicon */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-purple-600 pl-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">2. Technical Lexicon</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">K</span> Consistency Index [Pa·sⁿ]
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">Represents the overall 'thickness' or viscosity of the material at a reference shear rate of 1 s⁻¹.</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center text-[10px]">n</span> Flow Behavior Index [-]
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">The degree of non-Newtonian behavior. n{'<'}1: Shear Thinning; n{'>'}1: Shear Thickening; n=1: Ideal Newtonian.</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center text-[10px]">τ₀</span> Yield Stress [Pa]
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">The minimum force required to initiate flow. Below this limit, the material behaves like an elastic solid (e.g. Toothpaste on a brush).</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">G'</span> Storage Modulus [Pa]
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">The elastic component of viscoelasticity. Measures the energy stored and recovered during a deformation cycle.</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-6 h-6 rounded bg-cyan-50 text-cyan-600 flex items-center justify-center text-[10px]">λ</span> Structural Maturity [0-1]
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">A dimensionless parameter representing the state of the internal network. 1.0 is a fully formed rest-state structure.</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">γy</span> Yield Strain [%]
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">The critical deformation limit. Beyond this strain level, the internal network fractures and flow starts.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Interpretation Guide */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-slate-900 pl-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">3. Data Interpretation Blueprint</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
                <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Steady-State Flow Curves</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Identifies the general viscosity fingerprint. Essential for sizing industrial pumps, piping, and determining mixing efficiency under different mechanical speeds.</p>
              </div>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
                <p className="text-[11px] font-black text-rose-400 uppercase tracking-widest">Oscillatory Dynamic Sweeps</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">The internal X-ray of the fluid. It separates elastic energy storage (G') from viscous dissipation (G''). Crucial for predicting shelf-life stability and phase transitions.</p>
              </div>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Structural Recovery (3ITT)</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Simulates real-world application cycles like spraying or coating. Measures how fast the viscosity 'heals' its internal network after high-energy stress events.</p>
              </div>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
                <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Creep & Temperature Profiling</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Predicts thermal stability and long-term deformation ('sagging') under gravity. Essential for automotive and structural coatings meant for variable environments.</p>
              </div>
            </div>
          </section>

        </div>

        <div className="px-6 md:px-12 py-6 md:py-8 border-t border-slate-100 bg-white flex justify-center">
          <button onClick={onClose} className="w-full md:w-auto px-12 md:px-24 py-4 md:py-5 bg-slate-900 text-white font-black text-[10px] md:text-[11px] rounded-2xl md:rounded-3xl hover:bg-blue-600 transition-all uppercase tracking-[0.3em] shadow-xl hover:shadow-blue-200">
            Exit Theory Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryModal;