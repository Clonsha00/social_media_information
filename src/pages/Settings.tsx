export default function Settings() {
  return (
    <div className="max-w-2xl p-8">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">系統設定</h1>
      
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center space-y-4">
        <i className="fa-solid fa-shield-check text-5xl text-green-400 mb-4"></i>
        <h2 className="text-xl font-bold text-slate-100">金鑰已安全配置於雲端</h2>
        <p className="text-slate-400 leading-relaxed">
          為了安全起見，API Key 與資料庫金鑰已直接寫入後端環境變數 (Environment Variables)。<br/>
          您不需要再手動填寫任何設定即可使用。
        </p>
      </div>
    </div>
  );
}
