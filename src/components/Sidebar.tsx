import React from 'react';
import { LayoutDashboard, BookOpen, Clock, Users, LogOut, X } from 'lucide-react';
import { View } from '../types';
import Logo from '../assets/SALogo.jpg';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout, isOpen = false, onClose }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'catalog', icon: BookOpen, label: 'Catalog' },
    { id: 'borrowed', icon: Clock, label: 'Borrowed Books' },
    { id: 'members', icon: Users, label: 'Members' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-2rem))] shrink-0 flex-col overflow-y-auto border-r border-[#E2D9CF] bg-[#F2ECE4] shadow-2xl shadow-slate-950/20 transition-transform duration-300 lg:static lg:h-full lg:w-64 lg:translate-x-0 lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      id="sidebar"
    >
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6 lg:block lg:p-8 lg:pt-10 lg:pb-6" id="sidebar-header">
        <div>
          <img src={Logo} alt="Library Logo" className="mb-4 h-16 w-16 rounded-xl object-cover shadow-sm ring-1 ring-[#E2D9CF]" />
          <p className="mb-3 max-w-[13rem] font-outfit text-[10px] font-bold uppercase leading-relaxed tracking-[0.18em] text-[#000096]">
            Cauayan City Stand-Alone Senior High School
          </p>
          <h1 className="font-serif text-3xl text-[#0F172A] tracking-tight leading-none lg:text-[40px]" id="sidebar-app-name">Library</h1>
          <p className="mt-2 text-sm text-[#64748B] font-outfit leading-tight lg:text-base" id="sidebar-app-tagline">
            Management System
          </p>
        </div>
        <button
          type="button"
          aria-label="Close navigation menu"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-[#EAE2D8] hover:text-[#000096] lg:hidden"
          onClick={onClose}
        >
          <X size={22} />
        </button>
      </div>

      <div className="hidden border-t border-[#E2D9CF] mx-8 mb-8 lg:block" id="sidebar-divider" />

      <nav className="flex flex-1 flex-col gap-2 px-4 pb-4 sm:px-6 lg:space-y-2 lg:px-4 lg:pb-0" id="sidebar-nav">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onViewChange(item.id as View)}
              className={`group w-full outline-none ${isActive ? 'sidebar-item-active' : 'sidebar-item'}`}
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

      <div className="p-5 mt-auto sm:p-6" id="sidebar-footer">
        <div className="bg-[#EAE2D8] rounded-xl p-6" id="help-card">
          <h3 className="font-bold text-[#0F172A] text-lg mb-1.5">Need Help?</h3>
          <p className="text-sm text-[#475569] mb-6 leading-relaxed font-medium">
            Check out our <a href="#" className="text-[#000096] font-bold hover:underline">documentation</a> or contact support.
          </p>
          <button 
            onClick={() => {
              onLogout?.();
              onClose?.();
            }}
            className="text-sm font-bold text-[#000096] hover:underline flex items-center transition-all mt-4 w-full justify-start gap-2 pt-4 border-t border-[#EAE2D8]" 
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
