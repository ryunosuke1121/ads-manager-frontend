'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard`)
      .then(r => r.json())
      .then(d => { setData(d.summary); setLoading(false); })
      .catch(e => { setMsg('エラー: ' + e.message); setLoading(false); });

    fetch(`${API_URL}/api/reports/daily`)
      .then(r => r.json())
      .then(r => setReports(r));
  }, []);

  const addTestData = async () => {
    setMsg('投入中...');
    try {
      await fetch(`${API_URL}/api/test-data`, { method: 'POST' });
      setMsg('✅ テストデータ投入完了');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      setMsg('❌ ' + e.message);
    }
  };

  const testSlack = async () => {
    setMsg('Slack送信中...');
    try {
      await fetch(`${API_URL}/api/test-slack`, { method: 'POST' });
      setMsg('✅ Slack送信完了');
    } catch (e: any) {
      setMsg('❌ ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">📊 Ads Manager</h1>
        <p className="text-slate-400 mb-8">Google Ads 管理ダッシュボード</p>

        {msg && <div className="mb-6 p-4 bg-blue-900 rounded">{msg}</div>}

        <div className="flex gap-4 mb-8">
          <button onClick={addTestData} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            📥 テストデータ投入
          </button>
          <button onClick={testSlack} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded">
            📨 Slack テスト
          </button>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded">
            🔄 更新
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">読み込み中...</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800 p-6 rounded border border-slate-700">
                <p className="text-slate-400 text-sm">総クリック</p>
                <p className="text-3xl font-bold mt-2">{data.totalClicks?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded border border-slate-700">
                <p className="text-slate-400 text-sm">総コスト</p>
                <p className="text-3xl font-bold mt-2">¥{data.totalCost?.toLocaleString('ja-JP', {maximumFractionDigits: 0})}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded border border-slate-700">
                <p className="text-slate-400 text-sm">総CV</p>
                <p className="text-3xl font-bold mt-2">{data.totalConversions?.toLocaleString()}</p>
              </div>
            </div>

            {reports.length > 0 && (
              <div className="bg-slate-800 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left">日付</th>
                      <th className="px-4 py-3 text-right">インプレッション</th>
                      <th className="px-4 py-3 text-right">クリック</th>
                      <th className="px-4 py-3 text-right">コスト</th>
                      <th className="px-4 py-3 text-right">CV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 10).map((r: any) => (
                      <tr key={r.id} className="border-t border-slate-700">
                        <td className="px-4 py-3">{r.report_date}</td>
                        <td className="px-4 py-3 text-right">{r.impressions?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{r.clicks?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">¥{parseInt(r.cost)?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{r.conversions?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-800 p-8 rounded text-center">データなし。テストデータを投入してください</div>
        )}
      </div>
    </div>
  );
}
