'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell } from 'recharts';
import { Plus, Settings, Filter, TrendingUp, AlertCircle, CheckCircle, Clock, Zap, Search, Download, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('month');

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
          ctr: summary.ctr || 0
        });

        setCampaigns(campList);

        const monthlyFormatted = (Array.isArray(monthly) ? monthly : []).map((m: any) => ({
          month: m?.month ? m.month.split('-')[1] + '月' : '計測中',
          impressions: m?.impressions || 0,
          clicks: m?.clicks || 0,
          cost: m?.cost || 0,
          conversions: m?.conversions || 0,
          ctr: m?.clicks && m?.impressions ? (((m.clicks / m.impressions) * 100).toFixed(2)) : '0.00',
          cpa: m?.conversions && m?.cost ? (m.cost / m.conversions).toFixed(0) : '0'
        }));

        setMonthlyData(monthlyFormatted);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white"><p className="text-lg text-gray-900">読み込み中...</p></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold">G</div>
              <div>
                <h1 className="text-2xl font-bold">Google Ads リスティング管理</h1>
                <p className="text-xs text-gray-500">完全自動化ダッシュボード</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded font-medium text-sm hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} /> レポート出力
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 flex items-center gap-2">
                <Plus size={16} /> キャンペーン作成
              </button>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-0">
            {[
              { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
              { id: 'campaigns', label: 'キャンペーン管理', icon: '🎯' },
              { id: 'reports', label: 'レポート', icon: '📈' },
              { id: 'keywords', label: 'キーワード', icon: '🔑' },
              { id: 'rules', label: '自動ルール', icon: '⚙️' },
              { id: 'abtest', label: 'A/Bテスト', icon: '🧪' },
              { id: 'settings', label: '設定', icon: '⚡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* ダッシュボード */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* メトリクスカード */}
            <div className="grid grid-cols-6 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-600 text-xs font-medium uppercase">消費金額</p>
                <p className="text-3xl font-bold mt-2">¥{Math.round((data?.spend || 0) / 1000)}K</p>
                <p className="text-green-600 text-xs mt-2">📈 前月比 +12%</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-600 text-xs font-medium uppercase">インプレッション</p>
                <p className="text-3xl font-bold mt-2">{Math.round((data?.impressions || 0) / 1000)}K</p>
                <p className="text-green-600 text-xs mt-2">📈 前月比 +8%</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-600 text-xs font-medium uppercase">クリック</p>
                <p className="text-3xl font-bold mt-2">{(data?.clicks || 0).toLocaleString()}</p>
                <p className="text-gray-600 text-xs mt-2">CTR {data?.ctr || 0}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-600 text-xs font-medium uppercase">コンバージョン</p>
                <p className="text-3xl font-bold mt-2 text-blue-600">{data?.conversions || 0}</p>
                <p className="text-gray-600 text-xs mt-2">CVR {data?.ctr || 0}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-600 text-xs font-medium uppercase">CPA</p>
                <p className="text-3xl font-bold mt-2">¥{Math.round(data?.cpa || 0).toLocaleString()}</p>
                <p className="text-green-600 text-xs mt-2">✓ 目標以下</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-600 text-xs font-medium uppercase">ROAS</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{(data?.roas || 0).toFixed(1)}x</p>
                <p className="text-gray-600 text-xs mt-2">目標 3.0x</p>
              </div>
            </div>

            {/* グラフ */}
            {monthlyData.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">💹 月別パフォーマンス推移</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="conversions" fill="#3b82f6" name="コンバージョン" />
                      <Line yAxisId="right" type="monotone" dataKey="cpa" stroke="#ef4444" strokeWidth={2} name="CPA" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">📊 クリック & CTR 推移</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="clicks" fill="#f59e0b" name="クリック" />
                      <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#10b981" strokeWidth={2} name="CTR %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 推奨事項 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><TrendingUp size={20} /> 推奨事項</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-sm text-blue-800">Brand キャンペーンの予算を 50% 増加 (ROAS 5.2x)</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <AlertCircle size={16} className="text-orange-600 mt-1 flex-shrink-0" />
                    <p className="text-sm text-blue-800">5 個のキーワードで CPA が目標の 2倍以上</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-sm text-blue-800">「Ableton Live チュートリアル」新規追加を推奨</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><Zap size={20} /> 改善機会</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-900">最適化スコア</p>
                    <p className="text-2xl font-bold text-green-600">68%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-900">業界平均との比較</p>
                    <p className="text-2xl font-bold text-green-600">+18%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-900">推奨予算削減</p>
                    <p className="text-2xl font-bold text-red-600">¥65K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* キャンペーン管理 */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="キャンペーン検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全て</option>
                <option value="ENABLED">有効</option>
                <option value="PAUSED">一時停止</option>
              </select>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {filteredCampaigns.map((camp: any) => (
                <div key={camp?.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm flex-1">{camp?.name || 'N/A'}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${camp?.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {camp?.status === 'ENABLED' ? '有効' : '停止'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">コンバージョン</p>
                      <p className="text-2xl font-bold text-blue-600">{camp?.conversions || 0}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">CPA</p>
                        <p className="font-bold">¥{Math.round(camp?.cpa || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ROAS</p>
                        <p className="font-bold">{(camp?.roas || 0).toFixed(1)}x</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* レポート */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">📋 詳細レポート</h3>
            {campaigns.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">キャンペーン</th>
                      <th className="px-4 py-3 text-center text-gray-700 font-semibold">ステータス</th>
                      <th className="px-4 py-3 text-right text-gray-700 font-semibold">消費</th>
                      <th className="px-4 py-3 text-right text-gray-700 font-semibold">クリック</th>
                      <th className="px-4 py-3 text-right text-gray-700 font-semibold">CV</th>
                      <th className="px-4 py-3 text-right text-gray-700 font-semibold">CPA</th>
                      <th className="px-4 py-3 text-right text-gray-700 font-semibold">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((camp: any) => (
                      <tr key={camp?.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{camp?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-center"><span className={`px-3 py-1 rounded-full text-xs font-medium ${camp?.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{camp?.status === 'ENABLED' ? '有効' : '停止'}</span></td>
                        <td className="px-4 py-3 text-right text-gray-600">¥{Math.round((camp?.spend || 0) / 1000)}K</td>
                        <td className="px-4 py-3 text-right text-gray-600">{(camp?.clicks || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-blue-600 font-medium">{camp?.conversions || 0}</td>
                        <td className="px-4 py-3 text-right text-gray-600">¥{Math.round(camp?.cpa || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium">{(camp?.roas || 0).toFixed(1)}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* キーワード */}
        {activeTab === 'keywords' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">🔑 キーワード分析</h3>
            <p className="text-gray-600">キーワードパフォーマンス詳細データが表示されます</p>
          </div>
        )}

        {/* 自動ルール */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap size={20} /> 自動最適化ルール</h3>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">CPA が目標を超える場合は入札額を 10% 減少</h4>
                      <p className="text-sm text-gray-600 mt-1">条件: CPA > ¥20,000</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ 有効</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">CTR が 1% 以下の場合は自動一時停止</h4>
                      <p className="text-sm text-gray-600 mt-1">条件: CTR < 1%</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ 有効</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">ROAS が 3.0x 以上の場合は予算を 20% 増加</h4>
                      <p className="text-sm text-gray-600 mt-1">条件: ROAS > 3.0x</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">一時停止</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* A/B テスト */}
        {activeTab === 'abtest' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">🧪 A/B テスト管理</h3>
            <p className="text-gray-600 mb-4">進行中のテスト: 3 件</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: '広告コピー A vs B', status: '進行中', conv_a: 45, conv_b: 52, winner: 'B' },
                { name: 'ランディングページ最適化', status: '進行中', conv_a: 38, conv_b: 41, winner: '近い' },
                { name: '入札戦略テスト', status: '完了', conv_a: 125, conv_b: 118, winner: 'A' }
              ].map((test, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">{test.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{test.status}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>A: {test.conv_a} CV</span>
                      <span>B: {test.conv_b} CV</span>
                    </div>
                    <div className="text-xs text-green-600 font-bold">勝者: {test.winner}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 設定 */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Settings size={20} /> Slack 通知設定</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-900">CPA が目標を超えた場合に通知</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-900">毎日 10:00 に日次サマリーを送信</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-900">エラーが発生した場合に通知</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">🔐 API キー管理</h3>
              <p className="text-sm text-gray-600 mb-4">Google Ads API 認証キー</p>
              <button className="px-4 py-2 border border-gray-300 rounded font-medium text-sm hover:bg-gray-50">再認証</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
