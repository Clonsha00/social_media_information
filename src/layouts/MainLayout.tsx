import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AddVideoModal from '../components/AddVideoModal';
import { getSupabaseClient } from '../lib/supabase';

export default function MainLayout() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [categories, setCategories] = useState<{ name: string, path: string, icon: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data, error } = await supabase.from('video_categories').select('*').order('created_at', { ascending: true });
      if (!error && data) {
        const dynamicLinks = data.map(c => ({
          name: c.name,
          path: `/category/${c.name}`,
          icon: c.icon || 'fa-solid fa-hashtag'
        }));
        setCategories(dynamicLinks);
      }
    };
    fetchCategories();
  }, []);

  const navLinks = [
    { name: '所有', path: '/category/all', icon: 'fa-solid fa-border-all' },
    ...categories
  ];

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* ---------- Mobile Header ---------- */}
      <header className="md:hidden bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-play text-white text-xs"></i>
          </div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            影片知識庫
          </h1>
        </div>
        <NavLink to="/settings" className={({isActive}) => `p-2 rounded-full transition-all ${isActive ? 'text-blue-400 bg-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
          <i className="fa-solid fa-gear text-lg"></i>
        </NavLink>
      </header>

      {/* ---------- Desktop Sidebar ---------- */}
      <aside className="hidden md:flex w-64 bg-slate-800 border-r border-slate-700 flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-play text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              影片知識庫
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider">Idea Inbox Extension</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="mx-4 mb-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
        >
          <i className="fa-solid fa-plus"></i> 新增影片
        </button>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              {link.icon?.startsWith('fa-') ? (
                <i className={`${link.icon} w-5 text-center text-lg`}></i>
              ) : (
                <span className="w-5 text-center text-lg">{link.icon || '📁'}</span>
              )}
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive ? 'bg-slate-700/50 text-blue-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`
            }
          >
            <i className="fa-solid fa-gear w-5 text-center"></i>
            系統設定
          </NavLink>
        </div>
      </aside>

      {/* ---------- Main Content Area ---------- */}
      <main className="flex-1 overflow-y-auto bg-[#0f172a] relative z-0">
        <Outlet />
      </main>

      {/* ---------- Mobile Floating Action Button ---------- */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgba(37,99,235,0.6)] flex items-center justify-center text-2xl z-30 hover:bg-blue-500 active:scale-90 transition-all border border-blue-400/30"
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      {/* ---------- Mobile Bottom Navigation ---------- */}
      <nav className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700 flex justify-around items-center px-2 py-3 shrink-0 z-20 pb-safe">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {link.icon?.startsWith('fa-') ? (
                  <i className={`${link.icon} text-xl mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : ''}`}></i>
                ) : (
                  <span className={`text-xl mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : ''}`}>{link.icon || '📁'}</span>
                )}
                <span className="text-[10px] font-bold">{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {isModalOpen && <AddVideoModal onClose={() => setIsModalOpen(false)} availableTags={categories.map(c => c.name)} />}
    </div>
  );
}
