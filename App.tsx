
import React, { useState, useEffect } from 'react';
import { AppTab, RegistrationData } from './types.ts';
import { CORSAIR_LOGO, LOCATIONS } from './constants.tsx';
import RegistrationForm from './components/RegistrationForm.tsx';
import PhotoGallery from './components/PhotoGallery.tsx';

const AdminDashboard: React.FC<{ registrations: RegistrationData[] }> = ({ registrations }) => {
  return (
    <div className="autumn-card rounded-[2.5rem] p-6 md:p-10 space-y-6 overflow-hidden animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-orange-100 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-800">报名管理后台</h2>
          <p className="text-sm text-zinc-500 font-medium">查看并管理 Corsair 团建报名数据</p>
        </div>
        <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 min-w-[120px]">
          <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">当前报名</p>
          <p className="text-2xl text-orange-600 font-black leading-none mt-1">
            {registrations.length} <span className="text-xs font-normal text-zinc-400">人</span>
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-6 md:mx-0">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead>
            <tr className="bg-zinc-900 text-white uppercase text-[10px] tracking-widest font-black">
              <th className="px-6 py-4 rounded-l-xl">姓名</th>
              <th className="px-4 py-4">电话</th>
              <th className="px-4 py-4">人数 (成人/儿童)</th>
              <th className="px-4 py-4">投票地点</th>
              <th className="px-4 py-4 rounded-r-xl">提交时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 italic font-medium">
                  暂无报名信息。
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-zinc-800">{reg.name}</td>
                  <td className="px-4 py-5 text-zinc-600 font-mono font-bold">{reg.phone}</td>
                  <td className="px-4 py-5 text-zinc-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold mr-1">{reg.adults} 成</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold">{reg.children} 孩</span>
                  </td>
                  <td className="px-4 py-5">
                    <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-[10px] font-black uppercase">
                      {LOCATIONS.find(l => l.id === reg.preferredLocation)?.name || reg.preferredLocation}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-zinc-400 text-[11px] font-medium">{reg.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INFO);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('corsair_registrations');
    if (saved) {
      setRegistrations(JSON.parse(saved));
    }
  }, []);

  const handleRegistrationSubmit = (data: RegistrationData) => {
    const newReg = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false })
    };
    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('corsair_registrations', JSON.stringify(updated));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '98765432') {
      setIsAdminLoggedIn(true);
    } else {
      alert('密码错误！');
    }
  };

  return (
    <div className="min-h-screen pb-10 flex flex-col bg-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(AppTab.INFO)}>
            {CORSAIR_LOGO}
            <div className="flex flex-col">
              <h1 className="font-corsair text-[10px] md:text-sm font-black tracking-widest text-zinc-900 leading-none">
                CORSAIR
              </h1>
              <span className="text-orange-500 font-black text-[10px] uppercase tracking-tighter">Team Building</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: AppTab.INFO, label: '主页' },
              { id: AppTab.REGISTER, label: '报名' },
              { id: AppTab.GALLERY, label: '相册' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-5 py-2 text-[10px] md:text-sm font-black uppercase transition-all rounded-full ${
                  activeTab === tab.id 
                    ? 'corsair-gradient text-black shadow-lg shadow-yellow-200 scale-105' 
                    : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            <div className="h-4 w-[1px] bg-zinc-200 mx-1"></div>
            
            <button 
              onClick={() => setActiveTab(AppTab.ADMIN)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                activeTab === AppTab.ADMIN 
                  ? 'bg-zinc-900 text-yellow-400 border-zinc-900 shadow-xl' 
                  : 'bg-zinc-800 border-zinc-800 text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">后台</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-4 mt-6 flex-grow flex flex-col items-center">
        {activeTab === AppTab.INFO && (
          <div className="w-full space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[380px] md:h-[450px] w-full flex items-center justify-center shadow-2xl shadow-orange-200/40">
              <div className="absolute inset-0 bg-zinc-900">
                <img 
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-60" 
                  alt="BBQ" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              <div className="relative z-10 w-full px-6 py-10 flex flex-col items-center text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-corsair font-black text-white">
                    <span className="block text-5xl sm:text-6xl md:text-8xl tracking-tighter leading-none mb-2">CORSAIR</span>
                    <span className="text-yellow-400 block text-2xl sm:text-4xl md:text-5xl tracking-tight font-black uppercase">东莞团建·烧烤之旅</span>
                  </h2>
                </div>
                
                <div className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-white/50 flex items-center gap-3">
                  <span className="text-2xl animate-pulse">🔥</span>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-black text-sm md:text-xl">1月10日</span>
                    <span className="text-zinc-800 font-black text-sm md:text-xl">上午出发</span>
                  </div>
                </div>

                <p className="text-white/80 font-bold text-[10px] sm:text-xs tracking-[0.3em] uppercase max-w-lg leading-relaxed">
                  烧烤野炊 · 亲子友好 · 团队欢聚
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {[
                { icon: "👨‍👩‍👧‍👦", title: "带上家属", desc: "大人费用自理，<span class='text-orange-600 font-black'>小朋友统统免费</span>！" },
                { icon: "📍", title: "地点投票", desc: "JOJO 精选松山湖与大岭山两处胜地供君选。" },
                { icon: "🍢", title: "上午至下午", desc: "上午出发享受美食，下午活动结束各自归家。" }
              ].map((item, idx) => (
                <div key={idx} className="autumn-card p-8 rounded-[2.5rem] text-center space-y-4 hover:scale-[1.02] transition-transform duration-300">
                  <div className="text-4xl">{item.icon}</div>
                  <h3 className="text-xl font-black text-zinc-800">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                </div>
              ))}
            </div>

            <div className="flex justify-center pb-12">
              <button 
                onClick={() => setActiveTab(AppTab.REGISTER)}
                className="px-20 py-5 corsair-gradient text-black font-black uppercase text-xl rounded-2xl shadow-xl shadow-yellow-300/40 hover:scale-105 active:scale-95 transition-all"
              >
                开始报名
              </button>
            </div>
          </div>
        )}

        {activeTab === AppTab.REGISTER && (
          <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
              <h2 className="text-3xl font-black text-zinc-800 uppercase tracking-tighter">报名登记</h2>
              <p className="text-zinc-500 font-medium italic mt-2">请由各部门统计或个人直接提交</p>
            </div>
            <RegistrationForm onSubmit={handleRegistrationSubmit} />
          </div>
        )}

        {activeTab === AppTab.GALLERY && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PhotoGallery />
          </div>
        )}

        {activeTab === AppTab.ADMIN && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto autumn-card p-12 rounded-[2.5rem] shadow-2xl border-orange-100">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-zinc-900 text-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-widest">Admin Access</h2>
                  <p className="text-[10px] text-zinc-400 font-black mt-2 uppercase">请输入管理后台访问密码</p>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-orange-50 border-2 border-orange-100 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400 text-center text-2xl tracking-[0.5em] font-black text-zinc-800"
                    placeholder="••••••••"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full py-5 bg-zinc-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                  >
                    解锁后台数据
                  </button>
                </form>
              </div>
            ) : (
              <AdminDashboard registrations={registrations} />
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 py-16 bg-zinc-900 text-zinc-400 border-t-8 border-yellow-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400 rounded-2xl">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><path d="M20 5L35 30H5L20 5Z" fill="#000" /></svg>
            </div>
            <div>
              <span className="font-corsair text-white font-black tracking-[0.3em] uppercase text-sm block">Corsair BBQ 2026</span>
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 block">Dongguan Team Building Event</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <button 
              onClick={() => setActiveTab(AppTab.ADMIN)}
              className="px-6 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-yellow-400 hover:bg-zinc-700 transition-all border border-zinc-700 flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              管理端登录
            </button>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em]">© 2024 Corsair Gaming Inc. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
