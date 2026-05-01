import { useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';

interface AddVideoModalProps {
  onClose: () => void;
}

export default function AddVideoModal({ onClose }: AddVideoModalProps) {
  const [url, setUrl] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [highlight, setHighlight] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [meta, setMeta] = useState<any>(null);

  const availableTags = ['食譜', '旅遊', '規劃', '有趣', '學習'];

  const handleAnalyze = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3-flash-preview';
    if (!apiKey) return alert("Gemini API Key 未設定於環境變數");
    
    setIsAiThinking(true);
    try {
      setStatusMsg('🔍 正在爬取影片原始資訊...');
      const metaRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const metaData = await metaRes.json();
      
      const title = metaData.data?.title || '無標題';
      const desc = metaData.data?.description || '無描述';
      const imageUrl = metaData.data?.image?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
      setMeta({ originalTitle: title, thumbnail: imageUrl });

      setStatusMsg(`✨ 呼叫 ${model} 提煉重點中...`);
      const prompt = `請分析標題與描述，總結為「一句話亮點(10~20字)」。
並從中選出最合適的 1~2 個標籤：[${availableTags.join(', ')}]
標題：${title}\n描述：${desc}
嚴格遵守純JSON格式：{"highlight":"你的重點摘要","tags":["標籤1"]}`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const aiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });

      if (!aiRes.ok) throw new Error("API 呼叫失敗，請檢查模型名稱或金鑰");
      const aiData = await aiRes.json();
      const result = JSON.parse(aiData.candidates[0].content.parts[0].text);

      setHighlight(result.highlight);
      setSelectedTags(result.tags || []);
    } catch (err: any) {
      alert("分析失敗: " + err.message);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSave = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      alert("請先到系統設定填寫 Supabase 資訊！");
      return;
    }

    let platform = 'Unknown';
    if (url.includes('youtube') || url.includes('youtu.be')) platform = 'YouTube';
    else if (url.includes('instagram')) platform = 'Instagram';
    else if (url.includes('tiktok')) platform = 'TikTok';
    else if (url.includes('threads.net')) platform = 'Threads';

    const { error } = await supabase.from('video_bookmarks').insert([{
      url,
      highlight,
      tags: selectedTags,
      source_platform: platform,
      original_title: meta?.originalTitle || '未知標題',
      thumbnail_url: meta?.thumbnail || ''
    }]);

    if (error) {
      alert("儲存失敗: " + error.message);
    } else {
      onClose();
      window.location.reload(); // Simple refresh to show new data
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">新增影片收藏</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><i className="fa-solid fa-times text-xl"></i></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <input 
              type="text" placeholder="貼上 IG/TikTok/YT 連結..." 
              className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500"
              value={url} onChange={e => setUrl(e.target.value)}
            />
            <button onClick={handleAnalyze} disabled={isAiThinking} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
              {isAiThinking ? '分析中...' : 'Gemini 分析'}
            </button>
          </div>

          {isAiThinking && <div className="ai-shimmer py-4 text-center">{statusMsg}</div>}

          {!isAiThinking && highlight && (
            <div className="space-y-4 animate-fade-in">
              <textarea 
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 font-bold h-24"
                value={highlight} onChange={e => setHighlight(e.target.value)}
              />
              <div className="flex gap-2">
                {availableTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t=>t!==tag) : [...prev, tag])}
                    className={`px-3 py-1.5 rounded-full border text-sm ${selectedTags.includes(tag) ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'border-slate-600 text-slate-400'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {highlight && (
          <div className="p-6 bg-slate-800/50 border-t border-slate-700">
            <button onClick={handleSave} className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 rounded-xl shadow-lg transition-all">
              儲存至資料庫
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
