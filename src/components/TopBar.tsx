import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';

interface TopBarProps {
  title: string;
  currentViewTitle: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, currentViewTitle }) => {
  return (
    <header className="h-12 bg-[#1A1A1A] text-white flex items-center justify-between px-4 z-20" id="top-nav">
      {/* Left Logos */}
      <div className="flex items-center gap-3 shrink-0" id="topbar-left">
        <div className="flex items-center gap-1.5 px-2" id="platform-logos">
          <div className="w-6 h-6 bg-[#A259FF] rounded flex items-center justify-center text-[10px] font-bold" title="Design">B</div>
          <div className="w-6 h-6 bg-[#4ade80] rounded flex items-center justify-center text-[10px] font-bold text-black" title="AI Assistant">AI</div>
        </div>
      </div>

      {/* Center Title */}
      <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors" id="topbar-center">
        <h1 className="text-sm font-medium tracking-tight" id="app-nav-title">{title}</h1>
        <ChevronDown size={14} className="text-slate-400" />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 shrink-0" id="topbar-right">
        <div className="flex items-center gap-3 text-slate-400" id="topbar-icons">
          <Search size={18} className="cursor-pointer hover:text-white transition-colors" />
          <HelpCircle size={18} className="cursor-pointer hover:text-white transition-colors" />
        </div>
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold border border-white/10 cursor-pointer shadow-lg" id="user-avatar">
          JD
        </div>
      </div>
    </header>
  );
};

export default TopBar;
