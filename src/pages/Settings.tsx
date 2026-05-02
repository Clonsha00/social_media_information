import { useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';

export default function Settings() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data } = await supabase.from('video_categories').select('*').order('created_at', { ascending: true });
    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setLoading(true);
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.from('video_categories').insert([{ 
      name: newCatName.trim(),
      icon: newCatIcon.trim() || '📁'
    }]);
    if (error) {
      alert("新增失敗：" + error.message);
    } else {
      setNewCatName('');
      fetchCategories();
      alert("請重新整理網頁以更新側邊欄！");
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`確定要刪除「${name}」分類嗎？（已標籤的影片不受影響）`)) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.from('video_categories').delete().eq('id', id);
    if (error) {
      alert("刪除失敗：" + error.message);
    } else {
      fetchCategories();
      alert("請重新整理網頁以更新側邊欄！");
    }
  };

  return (
    <div className="max-w-3xl p-4 sm:p-8 space-y-8 pb-32">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">系統設定</h1>
      
      <div className="bg-slate-800 p-5 sm:p-8 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-tags text-blue-400"></i> 分類管理
        </h2>
        
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="flex gap-2 flex-1">
            <input 
              type="text" 
              placeholder="🐶" 
              className="w-16 sm:w-20 bg-slate-900 border border-slate-600 rounded-xl px-2 sm:px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 text-center text-xl"
              value={newCatIcon} 
              maxLength={2}
              onChange={e => setNewCatIcon(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="輸入新分類名稱..." 
              className="flex-1 min-w-0 bg-slate-900 border border-slate-600 rounded-xl px-3 sm:px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500"
              value={newCatName} 
              onChange={e => setNewCatName(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !newCatName.trim()}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 text-white w-full sm:w-auto"
          >
            {loading ? '處理中...' : '新增'}
          </button>
        </form>

        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 text-slate-200">
                {cat.icon?.startsWith('fa-') ? (
                  <i className={`${cat.icon} text-slate-400 w-5 text-center`}></i>
                ) : (
                  <span className="text-slate-400 w-5 text-center">{cat.icon || '📁'}</span>
                )}
                <span className="font-bold">{cat.name}</span>
              </div>
              <button 
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-slate-400 text-center py-4">目前沒有分類</p>}
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center space-y-4">
        <i className="fa-solid fa-shield-check text-5xl text-green-400 mb-4"></i>
        <h2 className="text-xl font-bold text-slate-100">金鑰已安全配置於雲端</h2>
        <p className="text-slate-400 leading-relaxed text-sm">
          為了安全起見，API Key 與資料庫金鑰已直接寫入後端環境變數 (Environment Variables)。<br/>
          您不需要再手動填寫任何設定即可使用。
        </p>
      </div>
    </div>
  );
}
