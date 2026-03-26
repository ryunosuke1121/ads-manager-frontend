'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { ChevronDown, Calendar, Filter, TrendingUp, AlertCircle, CheckCircle, Search, Download, Eye, Settings, AlertTriangle, Info, Lock, Unlock, X, Plus, Edit2, Trash2, Copy, Share2, ExternalLink, Zap, Target, BarChart3, PieChart as PieChartIcon, TrendingDown, Lightbulb } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['alerts', 'quality', 'device']));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch(`${API_URL}/api/dashboard`).catch(() => ({ json: () => ({ summary: {} }) })),
          fetch(`${API_URL}/api/campaigns`).catch(() => ({ json: () => ({ campaigns: [] }) }))
        ]);

        const dash = await responses[0].json();
        const camps = await responses[1].json();

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
          avgQualityScore: 7.2,
          impressionShare: 68.5,
          topPosition: 42.1,
          absoluteTopPosition: 28.3
        });

        setCampaigns(campList);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50"><p>読み込み中...</p></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-screen">
        {/* サイドバー */}
        <div className="w-64 bg-gray-900 text-white overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded text-white flex items-center justify-center font-bold text-sm">G</div>
              <div>
                <p className="font-bold text-sm">Google Ads</p>
                <p className="text-xs text-gray-400">リスティング管理</p>
              </div>
            </div>
            <button className="w-full px-3 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1">
              <Plus size={14} /> キャンペーン新規
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
              { id: 'keywords', label: 'キーワード', icon: '🔑' },
              { id: 'quality', label: '品質スコア', icon: '⭐' },
              { id: 'bidding', label: '入札戦略', icon: '💰' },
              { id: 'ads', label: '広告', icon: '📢' },
              { id: 'device', label: 'デバイス別', icon: '📱' },
              { id: 'schedule', label: '時間帯別', icon: '⏰' },
              { id: 'search', label: '検索語句', icon: '🔍' },
              { id: 'excludes', label: '除外キーワード', icon: '🚫' },
              { id: 'automation', label: '自動ルール', icon: '🤖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  activeTab === tab.id ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {/* ヘッダー */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {activeTab === 'dashboard' && '📊 ダッシュボード'}
              {activeTab === 'keywords' && '🔑 キーワード管理'}
              {activeTab === 'quality' && '⭐ 品質スコア分析'}
              {activeTab === 'bidding' && '💰 入札戦略分析'}
              {activeTab === 'ads' && '📢 広告パフォーマンス'}
              {activeTab === 'device' && '📱 デバイス別分析'}
              {activeTab === 'schedule' && '⏰ 時間帯別分析'}
              {activeTab === 'search' && '🔍 検索語句レポート'}
              {activeTab === 'excludes' && '🚫 除外キーワード'}
              {activeTab === 'automation' && '🤖 自動化ルール'}
            </h1>
            <div className="flex gap-2">
              <button className="px-3 py-2 border rounded hover:bg-gray-50 flex items-center gap-1 text-sm">
                <Download size={16} /> 出力
              </button>
              <button className="px-3 py-2 border rounded hover:bg-gray-50 flex items-center gap-1 text-sm">
                <Settings size={16} /> 設定
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* ダッシュボード */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* 重要アラート */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-4">
                  <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900">品質スコア低下: 「テクノ プロダクション」</h3>
                    <p className="text-sm text-red-800 mt-1">品質スコア 7→5 に低下。ランディングページの改善が必要です。</p>
                    <button className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium">詳細を表示 →</button>
                  </div>
                </div>

                {/* メトリクスグリッド */}
                <div className="grid grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">消費金額</p>
                    <p className="text-3xl font-bold mt-2">¥{Math.round((data?.spend || 0) / 1000)}K</p>
                    <p className="text-xs text-green-600 mt-2">📈 前月 +12%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">IMP</p>
                    <p className="text-3xl font-bold mt-2">{Math.round((data?.impressions || 0) / 1000)}K</p>
                    <p className="text-xs text-gray-600 mt-2">CTR {data?.ctr || 0}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">Click</p>
                    <p className="text-3xl font-bold mt-2">{(data?.clicks || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-2">CPC 目標達成</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">CV</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{data?.conversions || 0}</p>
                    <p className="text-xs text-gray-600 mt-2">CPA ¥{Math.round(data?.cpa || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">ROAS</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{(data?.roas || 0).toFixed(1)}x</p>
                    <p className="text-xs text-gray-600 mt-2">目標 3.0x</p>
                  </div>
                </div>

                {/* 品質スコア & インプレッション シェア */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">品質スコア</h3>
                        <p className="text-xs text-gray-500">平均 {data?.avgQualityScore}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-yellow-600">{data?.avgQualityScore}</p>
                        <p className="text-xs text-gray-500 mt-1">/ 10</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">スコア 8-10</span>
                          <span className="text-xs font-bold">34%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2"><div className="bg-green-600 h-2 rounded" style={{width: '34%'}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">スコア 5-7</span>
                          <span className="text-xs font-bold">58%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2"><div className="bg-yellow-600 h-2 rounded" style={{width: '58%'}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">スコア 1-4</span>
                          <span className="text-xs font-bold">8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2"><div className="bg-red-600 h-2 rounded" style={{width: '8%'}}></div></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">インプレッション シェア</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">インプレッション シェア</span>
                          <span className="text-sm font-bold">{data?.impressionShare || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2"><div className="bg-blue-600 h-2 rounded" style={{width: `${data?.impressionShare || 0}%`}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">上位の推定シェア</span>
                          <span className="text-sm font-bold">{data?.topPosition || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2"><div className="bg-purple-600 h-2 rounded" style={{width: `${data?.topPosition || 0}%`}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">最上位の推定シェア</span>
                          <span className="text-sm font-bold">{data?.absoluteTopPosition || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2"><div className="bg-pink-600 h-2 rounded" style={{width: `${data?.absoluteTopPosition || 0}%`}}></div></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 推奨事項 */}
                <div>
                  <button onClick={() => toggleSection('recommendations')} className="flex items-center gap-2 mb-3 font-bold text-lg">
                    {expandedSections.has('recommendations') ? '▼' : '▶'} 💡 推奨事項
                  </button>
                  {expandedSections.has('recommendations') && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
                        <Lightbulb className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <h4 className="font-bold text-blue-900">入札戦略を最適化</h4>
                          <p className="text-sm text-blue-800 mt-1">「Brand キャンペーン」は ROAS 5.2x で優秀。自動入札（目標ROAS）で 15-20% 改善予測。</p>
                          <button className="mt-2 text-sm text-blue-700 hover:text-blue-900 font-medium">実装する →</button>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3">
                        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <h4 className="font-bold text-yellow-900">低品質キーワードを除外</h4>
                          <p className="text-sm text-yellow-800 mt-1">「テクノ」(BROAD) の CTR 1.4% は業界平均 (2.1%) 以下。部分一致の除外キーワードを追加。</p>
                          <button className="mt-2 text-sm text-yellow-700 hover:text-yellow-900 font-medium">追加する →</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* キーワード管理 */}
            {activeTab === 'keywords' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">キーワード一覧</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm">
                    <Plus size={16} /> キーワード追加
                  </button>
                </div>

                <div className="flex gap-4 mb-4">
                  <input type="text" placeholder="キーワード検索..." className="flex-1 px-3 py-2 border rounded" />
                  <select className="px-3 py-2 border rounded"><option>全て</option><option>有効</option><option>停止</option></select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">キーワード</th>
                        <th className="px-4 py-3 text-center">マッチ</th>
                        <th className="px-4 py-3 text-right">IMP</th>
                        <th className="px-4 py-3 text-right">Click</th>
                        <th className="px-4 py-3 text-right">CTR</th>
                        <th className="px-4 py-3 text-center">品質</th>
                        <th className="px-4 py-3 text-center">推奨</th>
                        <th className="px-4 py-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { kw: 'ryunosuke テクノ', match: 'EXACT', imp: 15000, click: 600, ctr: 4.0, score: 9, action: '✓' },
                        { kw: 'テクノ プロダクション', match: 'EXACT', imp: 8000, click: 200, ctr: 2.5, score: 5, action: '⚠️' },
                        { kw: 'テクノ', match: 'BROAD', imp: 28000, click: 380, ctr: 1.4, score: 4, action: '❌' }
                      ].map((item, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{item.kw}</td>
                          <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{item.match}</span></td>
                          <td className="px-4 py-3 text-right">{item.imp.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{item.click}</td>
                          <td className="px-4 py-3 text-right">{item.ctr}%</td>
                          <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${item.score >= 8 ? 'bg-green-100 text-green-700' : item.score >= 6 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>⭐{item.score}</span></td>
                          <td className="px-4 py-3 text-center">{item.action}</td>
                          <td className="px-4 py-3 text-center"><button className="text-gray-600 hover:text-gray-900"><Edit2 size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* デバイス別分析 */}
            {activeTab === 'device' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { device: 'PC', imp: 78000, click: 1800, ctr: 2.3, cpa: 14500, conv: 45 },
                    { device: 'モバイル', imp: 45000, click: 1100, ctr: 2.4, cpa: 16200, conv: 22 },
                    { device: 'タブレット', imp: 7278, click: 148, ctr: 2.0, cpa: 18900, conv: 4 }
                  ].map((device, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-4">{device.device}</h3>
                      <div className="space-y-3">
                        <div><p className="text-xs text-gray-600">IMP</p><p className="text-2xl font-bold">{device.imp.toLocaleString()}</p></div>
                        <div><p className="text-xs text-gray-600">Click</p><p className="text-2xl font-bold">{device.click}</p></div>
                        <div><p className="text-xs text-gray-600">CTR</p><p className="text-2xl font-bold">{device.ctr}%</p></div>
                        <div><p className="text-xs text-gray-600">CV</p><p className="text-2xl font-bold text-blue-600">{device.conv}</p></div>
                        <div><p className="text-xs text-gray-600">CPA</p><p className="text-2xl font-bold">¥{device.cpa.toLocaleString()}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* プレースホルダー */}
            {!['dashboard', 'keywords', 'device'].includes(activeTab) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-600">
                <Info size={32} className="mx-auto mb-2 opacity-50" />
                <p>このセクションはデータ取得中です...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
