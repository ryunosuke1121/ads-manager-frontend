'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, Calendar, Filter, TrendingUp, AlertCircle, CheckCircle, Search, Download, Eye, Settings, AlertTriangle, Info, Lock, Unlock, X, Plus, Edit2, Trash2, Copy, Share2, ExternalLink, Zap, Target, BarChart3, PieChart as PieChartIcon, TrendingDown, Lightbulb } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type DashboardData = {
  summary: any;
  campaigns: any[];
  keywords: any[];
};

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState<DashboardData>({ summary: {}, campaigns: [], keywords: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['metrics', 'alerts', 'recommendations']));
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dashboard, campaigns, keywords] = await Promise.all([
          fetch(`${API_URL}/api/dashboard`, { signal: controller.signal, cache: 'no-store' }).then(r => r.json()),
          fetch(`${API_URL}/api/campaigns`, { signal: controller.signal, cache: 'no-store' }).then(r => r.json()),
          fetch(`${API_URL}/api/keywords`, { signal: controller.signal, cache: 'no-store' })
            .then(r => r.ok ? r.json() : { keywords: [] })
            .catch(() => ({ keywords: [] }))
        ]);

        if (!isMounted) return;

        setData({
          summary: dashboard?.summary || {},
          campaigns: campaigns?.campaigns || [],
          keywords: keywords?.keywords || []
        });
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        const errorMessage = err instanceof Error ? err.message : 'データ取得エラーが発生しました';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; controller.abort(); };
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) { newExpanded.delete(section); } else { newExpanded.add(section); }
    setExpandedSections(newExpanded);
  };

  const safeToLocaleString = (value: any) => {
    if (value === null || value === undefined) return '0';
    const num = Number(value);
    return isNaN(num) ? '0' : num.toLocaleString();
  };

  const filteredKeywords = data.keywords.filter((kw: any) =>
    (kw.text || '').toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const avgQualityScore = data.keywords.length > 0
    ? Math.round((data.keywords.reduce((sum: number, kw: any) => sum + (kw.qualityScore || 0), 0) / data.keywords.length) * 10) / 10
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-lg mt-4 text-gray-700">Google Ads API からリアルデータを取得中...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <AlertTriangle className="text-red-600 mx-auto mb-4" size={32} />
          <p className="text-lg font-bold text-gray-900">データ取得エラー</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            バックエンドが Google Ads API に接続できません。<br/>
            ACCESS_TOKEN と REFRESH_TOKEN が正しく設定されているか確認してください。
          </p>
        </div>
      </div>
    );
  }

  if (!data.summary || Object.keys(data.summary).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <Info className="text-blue-600 mx-auto mb-4" size={32} />
          <p className="text-lg font-bold text-gray-900">データなし</p>
          <p className="text-sm text-gray-600 mt-2">
            Google Ads のデータが見つかりません。<br/>
            Google Ads アカウントにキャンペーンがあるか確認してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-screen">
        {/* サイドバー */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded text-white flex items-center justify-center font-bold">G</div>
              <div>
                <h1 className="font-bold text-sm">Google Ads</h1>
                <p className="text-xs text-gray-500">リスティング管理</p>
              </div>
            </div>
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-2">
              <Plus size={16} /> キャンペーン作成
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {[
              { id: 'summary', label: 'サマリー', icon: '📊' },
              { id: 'keywords', label: 'キーワード管理', icon: '🔑' },
              { id: 'qualityscore', label: '品質スコア分析', icon: '⭐' },
              { id: 'bidding', label: '入札管理', icon: '💰' },
              { id: 'ads', label: '広告パフォーマンス', icon: '📢' },
              { id: 'device', label: 'デバイス別分析', icon: '📱' },
              { id: 'schedule', label: '時間帯別分析', icon: '⏰' },
              { id: 'search', label: '検索語句レポート', icon: '🔍' },
              { id: 'excludes', label: '除外キーワード', icon: '🚫' },
              { id: 'automation', label: '自動化ルール', icon: '🤖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded transition text-sm ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
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
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-8 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {activeTab === 'summary' && '📊 ダッシュボード'}
                {activeTab === 'keywords' && '🔑 キーワード管理'}
                {activeTab === 'qualityscore' && '⭐ 品質スコア分析'}
                {activeTab === 'bidding' && '💰 入札管理'}
                {activeTab === 'ads' && '📢 広告パフォーマンス'}
                {activeTab === 'device' && '📱 デバイス別分析'}
                {activeTab === 'schedule' && '⏰ 時間帯別分析'}
                {activeTab === 'search' && '🔍 検索語句レポート'}
                {activeTab === 'excludes' && '🚫 除外キーワード'}
                {activeTab === 'automation' && '🤖 自動化ルール'}
              </h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <Download size={18} /> エクスポート
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <Settings size={18} /> 設定
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* ダッシュボード */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900">✅ リアルデータ表示中</h3>
                      <p className="text-sm text-green-800 mt-1">Google Ads API から取得した実際のデータを表示しています</p>
                    </div>
                  </div>
                </div>

                <div>
                  <button onClick={() => toggleSection('metrics')} className="flex items-center gap-2 mb-3 font-bold text-lg">
                    {expandedSections.has('metrics') ? '▼' : '▶'} 📊 主要指標
                  </button>
                  {expandedSections.has('metrics') && (
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">消費金額</p>
                        <p className="text-3xl font-bold mt-2">¥{safeToLocaleString((data?.summary?.spend || 0) / 1000)}K</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">インプレッション</p>
                        <p className="text-3xl font-bold mt-2">{safeToLocaleString((data?.summary?.impressions || 0) / 1000)}K</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">クリック数</p>
                        <p className="text-3xl font-bold mt-2">{safeToLocaleString(data?.summary?.clicks || 0)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">コンバージョン</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{safeToLocaleString(data?.summary?.conversions || 0)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {data.campaigns.length > 0 && (
                  <div>
                    <button onClick={() => toggleSection('campaigns')} className="flex items-center gap-2 mb-3 font-bold text-lg">
                      {expandedSections.has('campaigns') ? '▼' : '▶'} 🎯 キャンペーン ({data.campaigns.length})
                    </button>
                    {expandedSections.has('campaigns') && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-3 text-left">キャンペーン名</th>
                              <th className="px-4 py-3 text-right">IMP</th>
                              <th className="px-4 py-3 text-right">Click</th>
                              <th className="px-4 py-3 text-right">消費</th>
                              <th className="px-4 py-3 text-right">CV</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.campaigns.map((camp: any, i: number) => (
                              <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{camp.name}</td>
                                <td className="px-4 py-3 text-right">{safeToLocaleString(camp.impressions)}</td>
                                <td className="px-4 py-3 text-right">{safeToLocaleString(camp.clicks)}</td>
                                <td className="px-4 py-3 text-right">¥{safeToLocaleString(camp.spend / 1000)}K</td>
                                <td className="px-4 py-3 text-right text-blue-600 font-bold">{camp.conversions}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* キーワード管理 */}
            {activeTab === 'keywords' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">キーワード一覧 ({data.keywords.length})</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm">
                    <Plus size={16} /> キーワード追加
                  </button>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="キーワード検索..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                {data.keywords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left">キーワード</th>
                          <th className="px-4 py-3 text-center">マッチ</th>
                          <th className="px-4 py-3 text-right">IMP</th>
                          <th className="px-4 py-3 text-right">Click</th>
                          <th className="px-4 py-3 text-center">品質</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredKeywords.map((kw: any, i: number) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{kw.text}</td>
                            <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{kw.matchType}</span></td>
                            <td className="px-4 py-3 text-right">{safeToLocaleString(kw.impressions)}</td>
                            <td className="px-4 py-3 text-right">{safeToLocaleString(kw.clicks)}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                (kw.qualityScore || 0) >= 8 ? 'bg-green-100 text-green-700' :
                                (kw.qualityScore || 0) >= 6 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>⭐{kw.qualityScore || 0}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">キーワードデータが見つかりません</div>
                )}
              </div>
            )}

            {/* 品質スコア分析 */}
            {activeTab === 'qualityscore' && data.keywords.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                    <p className="text-sm text-gray-600">平均品質スコア</p>
                    <p className="text-5xl font-bold text-yellow-600 mt-2">{avgQualityScore}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600">スコア 8-10</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                      {Math.round((data.keywords.filter((k: any) => (k.qualityScore || 0) >= 8).length / data.keywords.length) * 100)}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-600">スコア 1-4</p>
                    <p className="text-4xl font-bold text-red-600 mt-2">
                      {Math.round((data.keywords.filter((k: any) => (k.qualityScore || 0) <= 4).length / data.keywords.length) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* その他タブ */}
            {!['summary', 'keywords', 'qualityscore'].includes(activeTab) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-600">
                <Info size={32} className="mx-auto mb-2 opacity-50" />
                <p>このセクションは準備中です</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
