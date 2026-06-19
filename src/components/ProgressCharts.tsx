import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Custom dark mode tooltip matching our premium styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-xl shadow-xl">
        <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-cyan-400">Score: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function WeeklyPerformance({ data }: { data: { day: string; score: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6E56CF" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6E56CF" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#6E56CF" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorScore)" 
            dot={{ stroke: '#6E56CF', strokeWidth: 2, fill: '#fff', r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#22D3EE' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionRadial({ percent }: { percent: number }) {
  // SVG circular path variables
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="h-64 flex flex-col items-center justify-center relative">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Background Glow Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Gradient/Glow Progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-primary"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
              filter: 'drop-shadow(0px 2px 6px rgba(110,86,207,0.2))'
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{percent}%</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Progress</span>
        </div>
      </div>
      
      {/* Decorative legends */}
      <div className="flex justify-center gap-6 mt-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
          Completed
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-100 inline-block border border-slate-200"></span>
          Remaining
        </div>
      </div>
    </div>
  );
}
