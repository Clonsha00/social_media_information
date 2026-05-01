import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import VideoCard from '../components/VideoCard';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setErrorMsg('');
      const supabase = getSupabaseClient();
      if (!supabase) {
        setErrorMsg("尚未設定 Supabase，請前往「系統設定」配置。");
        setLoading(false);
        return;
      }

      const targetTag = categoryName === 'all' ? null : categoryName;

      try {
        let query = supabase.from('video_bookmarks').select('*').order('created_at', { ascending: false });
        
        if (targetTag) {
          query = query.contains('tags', JSON.stringify([targetTag]));
        }

        const { data, error } = await query;
        
        if (error) throw error;
        setVideos(data || []);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [categoryName]);

  const title = categoryName === 'all' ? '所有影片' : categoryName;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
        <p className="text-slate-400 mt-2">共 {videos.length} 部影片</p>
      </header>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-blue-400 animate-pulse">
          <i className="fa-solid fa-circle-notch fa-spin"></i> 載入中...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(v => <VideoCard key={v.id} video={v} onDeleted={() => setVideos(prev => prev.filter(item => item.id !== v.id))} />)}
        </div>
      )}
    </div>
  );
}
