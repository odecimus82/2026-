
import React, { useState, useEffect } from 'react';
import { AppTab, RegistrationData } from './types';
import { CORSAIR_LOGO, LOCATIONS } from './constants';
import RegistrationForm from './components/RegistrationForm';
import PhotoGallery from './components/PhotoGallery';

const AdminDashboard: React.FC<{ registrations: RegistrationData[] }> = ({ registrations }) => {
  return (
    <div className="autumn-card rounded-[2.5rem] p-6 md:p-10 space-y-6 overflow-hidden animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-orange-100 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-800">报名管理后台</h2>
          <p className="text-sm text-zinc-500 font-medium">实时同步所有已提交的组员信息</p>
        </div>
        <div className="text-left sm:text-right bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
          <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">总计报名</p>
          <p className="text-2xl text-orange-600 font-black leading-none mt-1">
            {registrations.length} <span className="text-xs font-normal text-zinc-400">人次</span>
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-6 md:mx-0">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead>
            <tr className="bg-zinc-900 text-white uppercase text-[10px] tracking-widest font-black">
              <th className="px-6 py-4 rounded-l-xl">报名人</th>
              <th className="px-4 py-4">联系电话</th>
              <th className="px-4 py-4">人数 (成人/儿童)</th>
              <th className="px-4 py-4">倾向地点</th>
              <th className="px-4 py-4 rounded-r-xl">提交时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 italic font-medium">
                  目前还没有收到任何报名，快去邀请组员吧！
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-zinc-800">{reg.name}</td>
                  <td className="px-4 py-5 text-zinc-600 font-mono font-bold">{reg.phone}</td>
                  <td className="px-4 py-5 text-zinc-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold mr-1">{reg.adults} 成人</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold">{reg.children} 儿童</span>
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
      alert('密码错误！请核对后台访问密码。');
    }
  };

  return (
    <div className="min-h-screen pb-10 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(AppTab.INFO)}>
            {CORSAIR_LOGO}
            <h1 className="font-corsair text-xs md:text-lg font-black tracking-widest text-zinc-900 uppercase">
              CORSAIR <span className="text-orange-500">TEAM</span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: AppTab.INFO, label: '团建详情' },
              { id: AppTab.REGISTER, label: '报名' },
              { id: AppTab.GALLERY, label: '图库' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-5 py-2 text-[10px] md:text-sm font-black uppercase transition-all rounded-full ${
                  activeTab === tab.id 
                    ? 'corsair-gradient text-black shadow-lg shadow-yellow-200' 
                    : 'text-zinc-500 hover:text-orange-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            <div className="h-6 w-[1px] bg-zinc-200 mx-1 hidden xs:block"></div>
            
            {/* Highly Visible Admin Entry */}
            <button 
              onClick={() => setActiveTab(AppTab.ADMIN)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                activeTab === AppTab.ADMIN 
                  ? 'bg-zinc-900 text-yellow-400 border-zinc-900 shadow-xl' 
                  : 'bg-zinc-100 border-zinc-100 text-zinc-500 hover:border-yellow-400 hover:text-zinc-900'
              }`}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="hidden sm:inline text-xs font-black uppercase">后台</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-4 mt-4 md:mt-10 flex-grow">
        {activeTab === AppTab.INFO && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[420px] md:aspect-[21/9] flex items-center shadow-2xl shadow-orange-200/40">
              <div className="absolute inset-0 bg-zinc-900">
                <img 
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-60" 
                  alt="BBQ Feast" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
              
              <div className="relative z-10 w-full px-6 sm:px-12 py-10 flex flex-col items-center text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="font-corsair font-black text-white drop-shadow-2xl">
                    <span className="block text-4xl sm:text-5xl md:text-7xl tracking-tighter leading-none mb-2">CORSAIR</span>
                    <span className="text-yellow-400 block text-2xl sm:text-4xl md:text-6xl tracking-tight font-black uppercase">金秋野炊团建</span>
                  </h2>
                </div>
                
                <div className="bg-white/95 backdrop-blur-md px-6 py-3 md:px-10 md:py-4 rounded-full shadow-2xl border border-white/50 flex items-center gap-3">
                  <span className="text-xl md:text-2xl animate-bounce">🗓️</span>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-black text-sm md:text-xl">日期:</span>
                    <span className="text-zinc-800 font-black text-sm md:text-xl tracking-tight">2026年1月10日</span>
                  </div>
                </div>

                <p className="text-white/80 font-bold text-[10px] sm:text-sm tracking-[0.2em] uppercase max-w-lg leading-relaxed">
                  上午出发 · 东莞森林烧烤 · JOJO 备选方案
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
              {[
                { icon: "👨‍👩‍👧‍👦", title: "家属政策", desc: "大人费用自理，<span class='text-orange-600 font-black'>小朋友统统免费</span>！" },
                { icon: "📍", title: "精选地点", desc: "两处绝佳地点备选，投出你最心仪的一票。" },
                { icon: "🍢", title: "野炊美食", desc: "烧烤食材全包，亲近自然，下午结束尽兴而归。" }
              ].map((item, idx) => (
                <div key={idx} className="autumn-card p-6 md:p-8 rounded-[2rem] text-center space-y-3 hover:scale-[1.02] transition-transform duration-300">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="text-lg font-black text-zinc-800">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => setActiveTab(AppTab.REGISTER)}
                className="w-full sm:w-auto px-16 py-5 corsair-gradient text-black font-black uppercase text-lg rounded-2xl shadow-xl shadow-yellow-200/50 hover:shadow-yellow-400/50 transition-all transform active:scale-95"
              >
                前往报名页
              </button>
            </div>
          </div>
        )}

        {activeTab === AppTab.REGISTER && (
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
              <h2 className="text-3xl font-black text-zinc-800 uppercase tracking-tighter">报名登记表</h2>
              <p className="text-zinc-500 font-medium italic">请详细填写，JOJO 会根据人数采购物资</p>
            </div>
            <RegistrationForm onSubmit={handleRegistrationSubmit} />
          </div>
        )}

        {activeTab === AppTab.GALLERY && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PhotoGallery />
          </div>
        )}

        {activeTab === AppTab.ADMIN && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto autumn-card p-10 rounded-[2.5rem] shadow-2xl border-orange-100 mt-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-zinc-900 text-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 uppercase">Admin Access</h2>
                  <p className="text-xs text-zinc-400 font-black mt-2 tracking-widest">请输入 8 位管理密码</p>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-orange-50 border-2 border-orange-100 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400 text-center text-2xl tracking-[0.5em] font-black text-zinc-800"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-5 bg-zinc-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all shadow-xl"
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

      <footer className="mt-20 py-12 bg-zinc-900 text-zinc-400 border-t-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none"><path d="M20 5L35 30H5L20 5Z" fill="#000" /></svg>
            </div>
            <div>
              <span className="font-corsair text-white font-black tracking-[0.2em] uppercase text-sm block">Corsair BBQ</span>
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">Team Building 2026</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <button 
              onClick={() => setActiveTab(AppTab.ADMIN)}
              className="flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-yellow-400 uppercase tracking-widest transition-all px-4 py-2 bg-zinc-800 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              管理员控制中心
            </button>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">© 2024 Corsair Gaming Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
