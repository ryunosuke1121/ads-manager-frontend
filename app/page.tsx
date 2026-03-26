'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { ChevronDown, Calendar, Filter, TrendingUp, AlertCircle, CheckCircle, Search, Download, Eye, Settings } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({ start: '2025-12-16', end: '2026-03-25' });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch(`${API_URL}/api/dashboard`).catch(() => ({ json: () => ({ summary: {} }) })),
          fetch(`${API_URL}/api/campaigns`).catch(() => ({ json: () => ({ campaigns: [] }) })),
          fetch(`${API_URL}/api/reports/monthly`).catch(() => ({ json: () => [] }))
        ]);

        const dash = await responses[0].json();
        const camps = await responses[1].json();
        const monthly = await responses[2].json();

        const summary = dash.summary || {};
        const campList = camps.campaigns || [];
        
        setData({
          spend: summary.spend || 0,
          impressions: summary.impressions || 0,
          clicks: summary.clicks || 0,
          conversions: summary.conversions || 0,
          cpa: summary.cpa || 0,
          roas: summary.roas || 0,
          ctr: summary.ctr || 0,
          cpc: 0,
          reach: 0,
          frequency: 0,
          cpm: 0
        });

        setCampaigns(campList);

        const monthlyFormatted = (Array.isArray(monthly) ? monthly : []).map((m: any) => ({
          month: m?.month ? m.month.split('-')[1] + '月' : '計測中',
          impressions: m?.impressions || 0,
          clicks: m?.clicks || 0,
          cost: m?.cost || 0,
          conversions: m?.conversions || 0,
          ctr: m?.clicks && m?.impressions ? (((m.clicks / m.impressions) * 100).toFixed(2)) : '0.00',
          cpa: m?.conversions && m?.cost ? (m.cost / m.conversions).toFixed(0) : '0',
          cpc: m?.clicks ? ((m.cost / m.clicks).toFixed(0)) : '0'
        }));

        setMonthlyData(monthlyFormatted);

        // 週別データシミュレーション
        const weeks = ['2025-W51', '2025-W52', '2026-W01', '2026-W02', '2026-W03', '2026-W04', '2026-W05', '2026-W06', '2026-W07', '2026-W08', '2026-W09', '2026-W10', '2026-W11', '2026-W12'];
        const weeklyFormatted = weeks.map((w, i) => ({
          week: w,
          period: `${w.split('-')[0]}-${w.split('W')[1]}`,
          impressions: Math.floor(Math.random() * 50000) + 10000,
          clicks: Math.floor(Math.random() * 2000) + 200,
          conversions: Math.floor(Math.random() * 50) + 5,
          cost: Math.floor(Math.random() * 200000) + 50000,
          ctr: (Math.random() * 3 + 0.5).toFixed(2),
          cpc: Math.floor(Math.random() * 1000) + 500,
          cpa: Math.floor(Math.random() * 20000) + 10000,
          cvr: (Math.random() * 5 + 1).toFixed(2)
        }));

        setWeeklyData(weeklyFormatted);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50"><p className="text-lg">読み込み中...</p></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* サイドバー */}
        <div className="w-56 bg-gray-900 text-white min-h-screen fixed">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-bold text-sm mb-1">占部臨2介 (管理者)</h2>
            <p className="text-xs text-gray-400">最終更新: 2026/3/26</p>
          </div>

          <nav className="space-y-1 p-2">
            {[
              { id: 'summary', label: 'サマリー', icon: '📊' },
              { id: 'monthly', label: '月別レポート', icon: '📅' },
              { id: 'weekly', label: '週別レポート', icon: '📆' },
              { id: 'daily', label: '日別レポート', icon: '📋' },
              { id: 'improvements', label: '改善アクション', icon: '⚡' },
              { id: 'abtest', label: 'A/Bテスト', icon: '🧪' },
              { id: 'account', label: 'アカウント構成', icon: '⚙️' },
              { id: 'rules', label: '自動ルール', icon: '🔄' },
              { id: 'schedule', label: 'スケジュール配信', icon: '⏰' },
              { id: 'predictions', label: '自動予算調整', icon: '🎯' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* メインコンテンツ */}
        <div className="ml-56 flex-1">
          {/* ヘッダー */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-3 flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {activeTab === 'summary' && '📊 サマリー'}
                {activeTab === 'monthly' && '📅 月別レポート'}
                {activeTab === 'weekly' && '📆 週別レポート'}
                {activeTab === 'daily' && '📋 日別レポート'}
                {activeTab === 'improvements' && '⚡ 改善アクション'}
                {activeTab === 'abtest' && '🧪 A/Bテスト'}
                {activeTab === 'account' && '⚙️ アカウント構成'}
                {activeTab === 'rules' && '🔄 自動ルール'}
                {activeTab === 'schedule' && '⏰ スケジュール配信'}
                {activeTab === 'predictions' && '🎯 自動予算調整'}
              </h1>

              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-2 border rounded">
                    <option value="4week">直近4週</option>
                    <option value="8week">直近8週</option>
                    <option value="month">直近1か月</option>
                    <option value="3month">直近3か月</option>
                  </select>
                </div>
                <button className="px-3 py-2 border rounded hover:bg-gray-50"><Download size={18} /></button>
                <button className="px-3 py-2 border rounded hover:bg-gray-50"><Settings size={18} /></button>
              </div>
            </div>

            {/* 日付範囲 */}
            <div className="px-6 py-2 bg-gray-50 text-sm flex items-center gap-4">
              <span className="text-gray-600">自動運用:</span>
              <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="px-2 py-1 border rounded" />
              <span>～</span>
              <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="px-2 py-1 border rounded" />
              <span className="text-gray-500">(16日間) 2025-12-16 ~ 2026-03-25</span>
            </div>
          </div>

          <div className="p-6">
            {/* サマリータブ */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                {/* メトリクスカード */}
                <div className="grid grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <p className="text-xs text-gray-600 uppercase">消費金額</p>
                    <p className="text-3xl font-bold mt-2">¥5,651,950円</p>
                    <p className="text-xs text-gray-500 mt-1">対象: 3,959,848円</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-xs text-gray-600 uppercase">CV数</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">264件</p>
                    <p className="text-xs text-gray-500 mt-1">目標数: +11</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-xs text-gray-600 uppercase">CPA</p>
                    <p className="text-3xl font-bold mt-2">¥21,030円</p>
                    <p className="text-xs text-gray-500 mt-1">目標: 25,000円</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-xs text-gray-600 uppercase">CTR</p>
                    <p className="text-3xl font-bold mt-2">2.25%</p>
                    <p className="text-xs text-gray-500 mt-1">業界平均: 1.9%</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-xs text-gray-600 uppercase">CVR</p>
                    <p className="text-3xl font-bold mt-2">4.33%</p>
                    <p className="text-xs text-gray-500 mt-1">業界平均: 3.2%</p>
                  </div>
                </div>

                {/* 予算状況 */}
                <div className="bg-white p-6 rounded border">
                  <h3 className="font-bold text-gray-900 mb-4">予算消化状況</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-6">
                        <div className="bg-blue-600 h-6 rounded-full" style={{width: '73.6%'}}></div>
                      </div>
                    </div>
                    <p className="text-lg font-bold">73.6%</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">1,104,152円 / 1,500,000円</p>
                </div>

                {/* 当月サブ指標 */}
                <div className="bg-white p-6 rounded border">
                  <h3 className="font-bold text-gray-900 mb-4">当月サブ指標</h3>
                  <div className="grid grid-cols-6 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">IMP</p>
                      <p className="text-xl font-bold">42,467</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">リンククリック</p>
                      <p className="text-xl font-bold">993</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CPC</p>
                      <p className="text-xl font-bold">¥1,112円</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">リーチ</p>
                      <p className="text-xl font-bold">15,762</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Freq</p>
                      <p className="text-xl font-bold">2.7</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CPM</p>
                      <p className="text-xl font-bold">¥26,000円</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 月別レポートタブ */}
            {activeTab === 'monthly' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded border">
                  <h3 className="font-bold text-gray-900 mb-4">月別レポート</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left">月</th>
                          <th className="px-4 py-3 text-right">IMP</th>
                          <th className="px-4 py-3 text-right">Click</th>
                          <th className="px-4 py-3 text-right">CTR(%)</th>
                          <th className="px-4 py-3 text-right">CPC(円)</th>
                          <th className="px-4 py-3 text-right">CV</th>
                          <th className="px-4 py-3 text-right">CVR(%)</th>
                          <th className="px-4 py-3 text-right">CPA(円)</th>
                          <th className="px-4 py-3 text-right">消化金額(円)</th>
                          <th className="px-4 py-3 text-right">リーチ</th>
                          <th className="px-4 py-3 text-right">Freq</th>
                          <th className="px-4 py-3 text-right">CPM(円)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((m, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{m.month}</td>
                            <td className="px-4 py-3 text-right">{m.impressions.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">{m.clicks.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">{m.ctr}%</td>
                            <td className="px-4 py-3 text-right">¥{m.cpc}</td>
                            <td className="px-4 py-3 text-right text-blue-600 font-bold">{Math.round(m.cost / (Number(m.cpa) || 1))}</td>
                            <td className="px-4 py-3 text-right">{((Math.round(m.cost / (Number(m.cpa) || 1)) / m.clicks) * 100).toFixed(2)}%</td>
                            <td className="px-4 py-3 text-right">¥{m.cpa}</td>
                            <td className="px-4 py-3 text-right">¥{m.cost.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">{Math.floor(m.impressions * 0.4)}</td>
                            <td className="px-4 py-3 text-right">1.2</td>
                            <td className="px-4 py-3 text-right">¥{Math.floor((m.cost / m.impressions) * 1000)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* グラフ */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded border">
                    <h3 className="font-bold text-gray-900 mb-4">CV & CPA推移</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="conversions" fill="#3b82f6" name="CV" />
                        <Line yAxisId="right" type="monotone" dataKey="cpa" stroke="#ef4444" strokeWidth={2} name="CPA" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white p-6 rounded border">
                    <h3 className="font-bold text-gray-900 mb-4">CTR & CPC推移</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="clicks" fill="#f59e0b" name="Click" />
                        <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#10b981" strokeWidth={2} name="CTR %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 週別レポートタブ */}
            {activeTab === 'weekly' && (
              <div className="bg-white p-6 rounded border">
                <h3 className="font-bold text-gray-900 mb-4">週別レポート</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">週</th>
                        <th className="px-4 py-3 text-right">IMP</th>
                        <th className="px-4 py-3 text-right">Click</th>
                        <th className="px-4 py-3 text-right">CTR(%)</th>
                        <th className="px-4 py-3 text-right">CPC(円)</th>
                        <th className="px-4 py-3 text-right">CV</th>
                        <th className="px-4 py-3 text-right">CVR(%)</th>
                        <th className="px-4 py-3 text-right">CPA(円)</th>
                        <th className="px-4 py-3 text-right">消化金額(円)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyData.map((w, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{w.period}</td>
                          <td className="px-4 py-3 text-right">{w.impressions.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{w.clicks.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{w.ctr}%</td>
                          <td className="px-4 py-3 text-right">¥{w.cpc}</td>
                          <td className="px-4 py-3 text-right text-blue-600 font-bold">{w.conversions}</td>
                          <td className="px-4 py-3 text-right">{w.cvr}%</td>
                          <td className="px-4 py-3 text-right">¥{w.cpa.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">¥{w.cost.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 改善アクションタブ */}
            {activeTab === 'improvements' && (
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-red-900">リード-50PC~ 新LP -画像 -資産5500万円のフリーエージェント法（1.3）</h4>
                      <p className="text-sm text-red-800 mt-1">リード-50PC~ 新LP -画像 -資産5500万円のフリーエージェントに注力しています。課題を管理したいですが、今後の推移を注視してください。</p>
                      <p className="text-xs text-red-700 mt-2">対応期間: 2026/04/02  効果期間5: 日</p>
                      <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">✓ 対応する</button>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-green-900">予算の削減方法（効果の良い広告セットに集中）</h4>
                      <p className="text-sm text-green-800 mt-1">リード-50PC~ 新LP -画像 -資産500万円に、CPA 20,888円と9倍の差があります。効果の良い広告セットで予算を確保することで。</p>
                      <p className="text-xs text-green-700 mt-2">対応期間: 2026/04/09  効果期間5: 14 日</p>
                      <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">✓ 対応する</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* A/Bテストタブ */}
            {activeTab === 'abtest' && (
              <div className="bg-white p-6 rounded border">
                <h3 className="font-bold text-gray-900 mb-4">A/Bテスト分析</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">広告名</th>
                        <th className="px-4 py-3 text-right">IMP</th>
                        <th className="px-4 py-3 text-right">クリック</th>
                        <th className="px-4 py-3 text-right">CTR(%)</th>
                        <th className="px-4 py-3 text-right">CV</th>
                        <th className="px-4 py-3 text-right">CVR(%)</th>
                        <th className="px-4 py-3 text-right">CPA(円)</th>
                        <th className="px-4 py-3 text-right">CPC(円)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'リード-50PC~ -新LP -画像 -新LP', imp: 11038, click: 434, ctr: 3.93, cv: 16, cvr: 3.69, cpa: 17512, cpc: 646 },
                        { name: 'リード-50PC~ -新LP -画像の女優を出し', imp: 1291, click: 246, ctr: 19.04, cv: 19, cvr: 19.64, cpa: 3828, cpc: 762 },
                        { name: 'リード-50PC~ -新LP -画像 -列で受け取り', imp: 2691, click: 85, ctr: 3.16, cv: 11, cvr: 12.94, cpa: 6231, cpc: 806 },
                      ].map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{row.name}</td>
                          <td className="px-4 py-3 text-right">{row.imp.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{row.click}</td>
                          <td className="px-4 py-3 text-right">{row.ctr}%</td>
                          <td className="px-4 py-3 text-right text-blue-600 font-bold">{row.cv}</td>
                          <td className="px-4 py-3 text-right">{row.cvr}%</td>
                          <td className="px-4 py-3 text-right">¥{row.cpa.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">¥{row.cpc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* その他タブ */}
            {!['summary', 'monthly', 'weekly', 'improvements', 'abtest'].includes(activeTab) && (
              <div className="bg-white p-6 rounded border text-center text-gray-600">
                <p className="text-lg">このセクションはデータ取得中です...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
