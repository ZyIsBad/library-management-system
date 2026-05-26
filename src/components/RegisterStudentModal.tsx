import React, { useState } from 'react';

interface RegisterStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (student: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    studentId: string;
  }) => void;
}

const RegisterStudentModal: React.FC<RegisterStudentModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    studentId: '',
    section: '',
    yearLevel: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onRegister(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl relative">
        <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Student Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" placeholder="First Name" className="w-full p-2 border rounded" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" className="w-full p-2 border rounded" value={form.lastName} onChange={handleChange} />
          <input name="username" placeholder="Username" className="w-full p-2 border rounded" value={form.username} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" value={form.password} onChange={handleChange} />
          <input name="studentId" placeholder="Student ID" className="w-full p-2 border rounded" value={form.studentId} onChange={handleChange} />
          <input name="section" placeholder="Section" className="w-full p-2 border rounded" value={form.section} onChange={handleChange} />
          <input name="yearLevel" placeholder="Year Level" className="w-full p-2 border rounded" value={form.yearLevel} onChange={handleChange} />
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-bold">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudentModal;
