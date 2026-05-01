import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AddVideoModal from '../components/AddVideoModal';

export default function MainLayout() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const navLinks = [
    { name: '所有影片', path: '/category/all', icon: 'fa-solid fa-border-all' },
    { name: '食譜', path: '/category/recipe', icon: 'fa-solid fa-utensils' },
    { name: '旅遊', path: '/category/travel', icon: 'fa-solid fa-plane' },
    { name: '人生規劃', path: '/category/planning', icon: 'fa-solid fa-bullseye' },
    { name: '有趣', path: '/category/funny', icon: 'fa-solid fa-face-laugh-squint' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            影片知識庫
          </h1>
          <p className="text-xs text-slate-400">Idea Inbox Extension</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="mx-4 mb-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
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
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <i className={`${link.icon} w-5 text-center`}></i>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive ? 'bg-slate-700 text-slate-200' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`
            }
          >
            <i className="fa-solid fa-gear w-5 text-center"></i>
            系統設定
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0f172a]">
        <Outlet />
      </main>

      {isModalOpen && <AddVideoModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
