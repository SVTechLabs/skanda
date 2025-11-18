import React from 'react';
import { Zap, ImagePlus } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          <Zap className="w-8 h-8 text-indigo-500" />
          <span>MemeGen AI</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="hidden md:flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             By Skanda
          </span>
        </div>
      </div>
    </header>
  );
};