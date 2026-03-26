'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Plus } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white"><p className="text-lg text-gray-900">読み込み中...</p></div>;
  }

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold">G</div>
              <h1 className="text-xl font-bold">Google Ads リスティング管理</h1>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 flex items-center gap-2">
              <Plus size={16} /> キャンペーン作成
            </button>
          </div>

          <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'ダッシュボード' },
              { id: 'campaigns', label: 'キャンペーン' },
              { id: 'insights', label: 'インサイト' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-6 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-gray-600 text-xs font-medium">消費金額</p>
                <p className="text-2xl font-bold mt-2">¥{Math.round((data?.spend || 0) / 1000)}K</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-gray-600 text-xs font-medium">インプレッション</p>
                <p className="text-2xl font-bold mt-2">{Math.round((data?.impressions || 0) / 1000)}K</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-gray-600 text-xs font-medium">クリック</p>
                <p className="text-2xl font-bold mt-2">{(data?.clicks || 0).toLocaleString()}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-gray-600 text-xs font-medium">コンバージョン</p>
                <p className="text-2xl font-bold mt-2">{data?.conversions || 0}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-gray-600 text-xs font-medium">CPA</p>
                <p className="text-2xl font-bold mt-2">¥{Math.round(data?.cpa || 0).toLocaleString()}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-gray-600 text-xs font-medium">ROAS</p>
                <p className="text-2xl font-bold mt-2">{(data?.roas || 0).toFixed(1)}x</p>
              </div>
            </div>

            {monthlyData && monthlyData.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded p-6">
                  <h3 className="font-bold text-gray-900 mb-4">月別パフォーマンス</h3>
                  <ResponsiveContainer width="100%" height={300}>
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

                <div className="bg-white border border-gray-200 rounded p-6">
                  <h3 className="font-bold text-gray-900 mb-4">CTR & クリック推移</h3>
                  <ResponsiveContainer width="100%" height={300}>
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

            {campaigns && campaigns.length > 0 && (
              <div className="bg-white border border-gray-200 rounded p-6">
                <h3 className="font-bold text-gray-900 mb-4">キャンペーン概要</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
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
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${camp?.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {camp?.status === 'ENABLED' ? '有効' : '停止'}
                            </span>
                          </td>
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
              </div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-4 gap-4">
            {campaigns.map((camp: any) => (
              <div key={camp?.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-600 transition">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{camp?.name || 'N/A'}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{camp?.conversions || 0} CV</p>
                <p className="text-gray-600 text-xs">CPA: ¥{Math.round(camp?.cpa || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-6">
              <h3 className="font-bold text-blue-900 mb-4">推奨事項</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <p>✓ Brand キャンペーンの予算増加を推奨</p>
                <p>✓ 低パフォーマンスキーワードの入札額を調整</p>
                <p>✓ 新規キーワード追加を検討</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-6">
              <h3 className="font-bold text-green-900 mb-4">パフォーマンス</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-900">最適化スコア</p>
                  <p className="text-2xl font-bold text-green-600">68%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
