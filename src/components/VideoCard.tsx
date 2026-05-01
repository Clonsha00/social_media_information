import { getSupabaseClient } from '../lib/supabase';

export default function VideoCard({ video, onDeleted }: { video: any, onDeleted?: () => void }) {
  let icon = 'fa-solid fa-link text-gray-400';
  if (video.source_platform === 'YouTube') icon = 'fa-brands fa-youtube text-red-500';
  else if (video.source_platform === 'Instagram') icon = 'fa-brands fa-instagram text-pink-500';
  else if (video.source_platform === 'TikTok') icon = 'fa-brands fa-tiktok text-slate-100';
  else if (video.source_platform === 'Threads') icon = 'fa-brands fa-threads text-slate-100';

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("確定要刪除這筆收藏嗎？")) return;
    
    const supabase = getSupabaseClient();
    if (!supabase) return;
    
    const { error } = await supabase.from('video_bookmarks').delete().eq('id', video.id);
    if (!error && onDeleted) {
      onDeleted();
    } else if (error) {
      alert("刪除失敗：" + error.message);
    }
  };

  return (
    <a 
      href={video.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all shadow-xl hover:-translate-y-1 block"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-700 scale-105 group-hover:scale-100 grayscale group-hover:grayscale-0" 
        style={{ backgroundImage: `url(${video.thumbnail_url})` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900" />
      
      {/* 視覺提示：懸浮顯示前往觀看 */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold text-white z-10">
        <i className="fa-solid fa-arrow-up-right-from-square"></i> 前往觀看
      </div>

      {/* 刪除按鈕 */}
      <button 
        onClick={handleDelete}
        className="absolute top-4 left-4 bg-black/40 hover:bg-red-500/80 backdrop-blur-md w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white z-20"
        title="刪除"
      >
        <i className="fa-solid fa-times"></i>
      </button>

      <div className="relative p-6 flex flex-col h-full min-h-[240px] justify-between z-0">
        <div className="flex flex-wrap gap-2 mb-4 mt-4">
          {(video.tags || []).map((tag: string) => (
             <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-bold border bg-slate-800/80 border-slate-600 text-slate-300">
               #{tag}
             </span>
          ))}
        </div>
        <h3 className="text-xl font-bold text-slate-100 leading-relaxed mb-4 group-hover:text-blue-300 transition-colors drop-shadow-md">
          {video.highlight}
        </h3>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto pt-4 border-t border-slate-700/50">
          <i className={`${icon} text-lg`}></i>
          <span className="truncate">{video.original_title}</span>
        </div>
      </div>
    </a>
  );
}
