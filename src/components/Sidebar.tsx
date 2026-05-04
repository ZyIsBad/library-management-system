import React from 'react';
import { LayoutDashboard, BookOpen, Clock, Users, Library as LibraryIcon, LogOut } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'catalog', icon: BookOpen, label: 'Catalog' },
    { id: 'borrowed', icon: Clock, label: 'Borrowed Books' },
    { id: 'members', icon: Users, label: 'Members' },
  ];

  return (
    <aside className="w-64 bg-[#F2ECE4] border-r border-[#E2D9CF] flex flex-col h-full overflow-y-auto" id="sidebar">
      <div className="p-8 pt-10 pb-6" id="sidebar-header">
        <h1 className="font-serif text-[40px] text-[#0F172A] tracking-tight leading-none" id="sidebar-app-name">Library</h1>
        <p className="text-base text-[#64748B] font-outfit mt-2 leading-tight" id="sidebar-app-tagline">
          Management System
        </p>
      </div>

      <div className="border-t border-[#E2D9CF] mx-8 mb-8" id="sidebar-divider" />

      <nav className="flex-1 px-4 space-y-2" id="sidebar-nav">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full group outline-none ${isActive ? 'sidebar-item-active' : 'sidebar-item'}`}
            >
              <item.icon 
                size={22} 
                className={isActive ? 'text-white' : 'text-slate-800'} 
                strokeWidth={2}
              />
              <span className={`tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto" id="sidebar-footer">
        <div className="bg-[#EAE2D8] rounded-xl p-6" id="help-card">
          <h3 className="font-bold text-[#0F172A] text-lg mb-1.5">Need Help?</h3>
          <p className="text-sm text-[#475569] mb-6 leading-relaxed font-medium">
            Check out our <a href="#" className="text-[#712A2A] font-bold hover:underline">documentation</a> or contact support.
          </p>
          <button 
            onClick={() => onLogout?.()}
            className="text-sm font-bold text-[#712A2A] hover:underline flex items-center transition-all mt-4 w-full justify-start gap-2 pt-4 border-t border-[#EAE2D8]" 
            id="logout-link"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
