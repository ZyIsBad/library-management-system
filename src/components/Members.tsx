import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar, UserPlus, Edit2 } from 'lucide-react';
import { Member } from '../types';
import { motion } from 'motion/react';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';

interface MembersProps {
  members: Member[];
  onAddMember: (member: { name: string; email: string; phone: string }) => void;
  onUpdateMember: (id: string, updatedFields: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
}

const Members: React.FC<MembersProps> = ({ members, onAddMember, onUpdateMember, onDeleteMember }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(search.toLowerCase()) || 
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditInitiate = (member: Member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      id="members-view"
    >
      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={onAddMember} 
      />

      <EditMemberModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        member={selectedMember} 
        onUpdate={onUpdateMember}
        onDelete={onDeleteMember}
      />

      <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-end sm:justify-between lg:mb-10" id="members-header">
        <div>
          <h2 className="font-serif text-4xl text-slate-900 mb-2 sm:text-5xl" id="members-title">Library Members</h2>
          <p className="text-slate-500 text-base font-outfit sm:text-lg" id="members-subtitle">Manage your library membership</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 bg-[#712A2A] text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-red-900/10 hover:bg-[#5d2222] transition-colors sm:w-auto" 
          id="add-member-btn"
        >
          <UserPlus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="mb-8 lg:mb-10" id="members-search-container">
        <div className="relative" id="member-search-wrapper">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search members..."
            className="w-full pl-12 pr-4 py-4 bg-[#F2ECE4] border-none rounded-xl focus:ring-2 focus:ring-[#712A2A] text-slate-700 font-medium transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="member-search"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="members-grid">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group relative sm:p-6" id={`member-card-${member.id}`}>
            <button 
              onClick={() => handleEditInitiate(member)}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-[#712A2A] hover:bg-red-50 rounded-lg transition-all"
              id={`edit-member-${member.id}`}
            >
              <Edit2 size={18} />
            </button>
            <div className="absolute top-16 right-5 text-slate-400 font-bold text-sm sm:right-6" id={`member-books-${member.id}`}>
              {member.borrowedCount} books
            </div>
            
            <div className="flex gap-4 items-start pr-20 sm:gap-6" id={`member-content-${member.id}`}>
              <div className="w-14 h-14 shrink-0 bg-[#F2ECE4] rounded-full flex items-center justify-center font-serif text-lg font-bold text-[#712A2A] sm:h-16 sm:w-16 sm:text-xl" id={`member-avatar-${member.id}`}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="min-w-0 space-y-3" id={`member-info-${member.id}`}>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-[#712A2A]">{member.name}</h3>
                  <span className={`inline-block px-3 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider mt-1 ${member.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    {member.status}
                  </span>
                </div>
                
                <div className="space-y-1.5 pt-2" id={`member-contact-${member.id}`}>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Mail size={16} />
                    <span className="min-w-0 break-words">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Phone size={16} />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Calendar size={16} />
                    <span>Joined {member.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Members;
