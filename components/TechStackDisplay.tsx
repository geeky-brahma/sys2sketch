import React from 'react';
import { TechStackItem } from '../types';

interface TechStackDisplayProps {
  stack: TechStackItem[];
}

export const TechStackDisplay: React.FC<TechStackDisplayProps> = ({ stack }) => {
  if (!stack || stack.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        Recommended Tech Stack
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stack.map((item, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-cyan-300 text-sm">{item.technology}</span>
              <span className="text-xs font-medium px-2 py-1 bg-slate-700 rounded text-slate-300">{item.component}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{item.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
