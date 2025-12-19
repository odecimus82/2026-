
import React, { useState } from 'react';
import { RegistrationData } from '../types';
import { LOCATIONS } from '../constants';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    adults: 1,
    children: 0,
    preferredLocation: 'location_a',
    phone: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' ? parseInt(value) || 0 : value
    }));
  };

  const handleLocationSelect = (id: 'location_a' | 'location_b') => {
    setFormData(prev => ({ ...prev, preferredLocation: id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('请填写姓名和联系电话！');
      return;
    }
    onSubmit(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="autumn-card rounded-3xl p-12 text-center border-2 border-orange-200">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-3xl font-black text-zinc-800 mb-4">报名已确认！</h3>
        <p className="text-zinc-500 font-medium mb-8 text-lg">期待与你在东莞的秋日森林相遇。</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors shadow-lg"
        >
          再填一份
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="autumn-card p-8 md:p-10 rounded-[2.5rem] space-y-10 shadow-2xl shadow-orange-100 border-orange-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs uppercase font-black text-orange-500 tracking-widest ml-1">姓名</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white/50 border-2 border-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-200 text-zinc-800 transition-all font-medium"
            placeholder="填写您的真名"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-black text-orange-500 tracking-widest ml-1">手机号码</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-white/50 border-2 border-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 text-zinc-800 font-bold tracking-wider"
            placeholder="方便活动当天联系"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-black text-orange-500 tracking-widest ml-1">成人人数 (费用自理)</label>
          <input
            type="number"
            name="adults"
            min="1"
            value={formData.adults}
            onChange={handleChange}
            className="w-full bg-white/50 border-2 border-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-200 text-zinc-800 transition-all font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-black text-orange-500 tracking-widest ml-1">儿童人数 (全部免费)</label>
          <input
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleChange}
            className="w-full bg-white/50 border-2 border-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-200 text-zinc-800 transition-all font-bold"
          />
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-xs uppercase font-black text-orange-500 tracking-widest block ml-1">方案投票 (由 JOJO 踩点选址)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LOCATIONS.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => handleLocationSelect(loc.id)}
              className={`cursor-pointer group relative overflow-hidden rounded-[2rem] border-4 transition-all duration-300 ${
                formData.preferredLocation === loc.id 
                  ? 'border-yellow-400 scale-[1.03] shadow-xl' 
                  : 'border-white hover:border-orange-100 shadow-sm'
              }`}
            >
              <img src={loc.imageUrl} alt={loc.name} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="p-5 bg-white">
                <h4 className="font-black text-zinc-800 text-lg mb-1">{loc.name}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-3">{loc.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {loc.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-bold">#{tag}</span>
                  ))}
                </div>
              </div>
              {formData.preferredLocation === loc.id && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-black rounded-full p-2 shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-5 corsair-gradient text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-yellow-200"
      >
        立即提交报名
      </button>
    </form>
  );
};

export default RegistrationForm;
