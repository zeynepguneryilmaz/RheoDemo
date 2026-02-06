import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

interface ChartContainerProps {
  data: any[];
  layout: any;
  title: string;
  defaultXAxisType?: 'linear' | 'log';
  defaultYAxisType?: 'linear' | 'log';
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  data, layout, title, defaultXAxisType = 'linear', defaultYAxisType = 'linear' 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [xAxisType, setXAxisType] = useState<'linear' | 'log'>(defaultXAxisType);
  const [yAxisType, setYAxisType] = useState<'linear' | 'log'>(defaultYAxisType);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultLayout = {
    ...layout,
    autosize: true,
    height: isMobile ? 400 : 540,
    margin: { l: 65, r: 40, t: 80, b: 65 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(255,255,255,0.7)',
    font: { family: 'Inter, system-ui, sans-serif', size: 10 },
    title: {
      text: title,
      font: { size: 14, color: '#1e293b', weight: '900' },
      y: 0.95,
      x: 0.05,
      xanchor: 'left'
    },
    showlegend: true,
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1,
      font: { size: 9, weight: '700', color: '#475569' },
      bgcolor: 'rgba(255,255,255,0.6)'
    },
    xaxis: {
      ...layout.xaxis,
      type: xAxisType,
      gridcolor: '#f1f5f9',
      linecolor: '#cbd5e1',
      linewidth: 1,
      zeroline: false,
      tickfont: { size: 9, color: '#64748b', weight: '600' },
      title: {
        ...(layout.xaxis?.title || {}),
        font: { size: 10, color: '#334155', weight: '800' }
      }
    },
    yaxis: {
      ...layout.yaxis,
      type: yAxisType,
      gridcolor: '#f1f5f9',
      linecolor: '#cbd5e1',
      linewidth: 1,
      zeroline: false,
      tickfont: { size: 9, color: '#64748b', weight: '600' },
      title: {
        ...(layout.yaxis?.title || {}),
        font: { size: 10, color: '#334155', weight: '800' }
      }
    }
  };

  return (
    <div className="w-full bg-white/80 p-4 rounded-[2.5rem] shadow-xl border border-white overflow-hidden transition-all duration-300 relative group">
      {/* Axis Toggle Buttons */}
      <div className="absolute top-16 left-6 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex bg-white/90 backdrop-blur shadow-sm p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setXAxisType(t => t === 'linear' ? 'log' : 'linear')}
            className={`px-2 py-1 text-[8px] font-black uppercase tracking-tighter rounded ${xAxisType === 'log' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            X: {xAxisType}
          </button>
        </div>
        <div className="flex bg-white/90 backdrop-blur shadow-sm p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setYAxisType(t => t === 'linear' ? 'log' : 'linear')}
            className={`px-2 py-1 text-[8px] font-black uppercase tracking-tighter rounded ${yAxisType === 'log' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Y: {yAxisType}
          </button>
        </div>
      </div>

      <Plot
        data={data}
        layout={defaultLayout}
        useResizeHandler={true}
        className="w-full"
        config={{ 
          displaylogo: false, 
          responsive: true,
          modeBarButtonsToRemove: ['select2d', 'lasso2d'],
          toImageButtonOptions: {
            format: 'png',
            filename: 'rheology_data',
            height: 1000,
            width: 1400,
            scale: 2
          }
        }}
      />
    </div>
  );
};

export default ChartContainer;