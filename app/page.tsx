'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Plus, Edit, Pause, Trash2, TrendingUp } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [adGroups, setAdGroups] = useState<any[]>([]);
  const [selectedAdGroup, setSelectedAdGroup] = useState<any>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (selectedCampaign && activeTab === 'campaigns') {
      fetchAdGroups(selectedCampaign.id);
    }
  }, [selectedCampaign, activeTab]);

  useEffect(() => {
    if (selectedAdGroup && activeTab === 'ad-groups') {
      fetchKeywords(selectedAdGroup.id);
      fetchAds(selectedAdGroup.id);
    }
  }, [selectedAdGroup, activeTab]);

  const fetchAllData = async () => {
    try {
      const [dashRes, campsRes, monthlyRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard`),
        fetch(`${API_URL}/api/campaigns`),
        fetch(`${API_URL}/api/reports/monthly`)
      ]);

      const dashData = await dashRes.json();
      const campsData = await campsRes.json();
      const monthlyData = await monthlyRes.json();

      setData(dashData.summary);
      setCampaigns(campsData.campaigns);
      setMonthlyData(monthlyData.map((m: any) => ({
        month: m.month.split('-')[1] + '月',
        impressions: m.impressions,
        clicks: m.clicks,
        cost: Math.round(m.cost),
        conversions: m.conversions,
        ctr: ((m.clicks / m.impressions) * 100).toFixed(2),
        cpa: Math.round(m.cost / (m.conversions || 1))
      })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdGroups = async (campaignId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns/${campaignId}/ad-groups`);
      const data = await res.json();
      setAdGroups(data.adGroups);
    } catch (error) {
      console.error('Error fetching ad groups:', error);
    }
  };

  const fetchKeywords = async (adGroupId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/ad-groups/${adGroupId}/keywords`);
      const data = await res.json();
      setKeywords(data.keywords);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    }
  };

  const fetchAds = async (adGroupId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/ad-groups/${adGroupId}/ads`);
      const data = await res.json();
      setAds(data.ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

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
            {[{ id: 'dashboard', label: 'ダッシュボード' }, { id: 'campaigns', label: 'キャンペーン' }, { id: 'ad-groups', label: '広告グループ' }, { id: 'keywords', label: 'キーワード' }, { id: 'ads', label: '広告' }, { id: 'insights', label: 'インサイト' }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && data && (
        <div className="px-6 py-6">
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-6 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded p-4"><p className="text-gray-600 text-xs font-medium">消費金額</p><p className="text-2xl font-bold mt-2">¥{(data.spend / 1000).toFixed(0)}K</p></div>
                <div className="bg-white border border-gray-200 rounded p-4"><p className="text-gray-600 text-xs font-medium">インプレッション</p><p className="text-2xl font-bold mt-2">{(data.impressions / 1000).toFixed(1)}K</p></div>
                <div className="bg-white border border-gray-200 rounded p-4"><p className="text-gray-600 text-xs font-medium">クリック</p><p className="text-2xl font-bold mt-2">{data.clicks.toLocaleString()}</p></div>
                <div className="bg-white border border-gray-200 rounded p-4"><p className="text-gray-600 text-xs font-medium">コンバージョン</p><p className="text-2xl font-bold mt-2">{data.conversions}</p></div>
                <div className="bg-white border border-gray-200 rounded p-4"><p className="text-gray-600 text-xs font-medium">CPA</p><p className="text-2xl font-bold mt-2">¥{data.cpa.toLocaleString()}</p></div>
                <div className="bg-white border border-gray-200 rounded p-4"><p className="text-gray-600 text-xs font-medium">ROAS</p><p className="text-2xl font-bold mt-2">{data.roas.toFixed(1)}x</p></div>
              </div>

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
                      {campaigns.map((camp) => (
                        <tr key={camp.id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedCampaign(camp); setActiveTab('campaigns'); }}>
                          <td className="px-4 py-3 text-gray-900 font-medium">{camp.name}</td>
                          <td className="px-4 py-3 text-center"><span className={`px-3 py-1 rounded-full text-xs font-medium ${camp.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{camp.status === 'ENABLED' ? '有効' : '停止'}</span></td>
                          <td className="px-4 py-3 text-right text-gray-600">¥{(camp.spend / 1000).toFixed(0)}K</td>
                          <td className="px-4 py-3 text-right text-gray-600">{camp.clicks.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-blue-600 font-medium">{camp.conversions}</td>
                          <td className="px-4 py-3 text-right text-gray-600">¥{camp.cpa.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium">{camp.roas.toFixed(1)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {campaigns.map((camp) => (
                  <div key={camp.id} className={`border rounded-lg p-4 cursor-pointer transition ${selectedCampaign?.id === camp.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`} onClick={() => setSelectedCampaign(camp)}>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">{camp.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{camp.conversions} CV</p>
                    <p className="text-gray-600 text-xs">CPA: ¥{camp.cpa.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {selectedCampaign && adGroups.length > 0 && (
                <div className="bg-white border border-gray-200 rounded p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">{selectedCampaign.name} - 広告グループ</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700 font-semibold">広告グループ</th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">キーワード</th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">CTR</th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">CPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adGroups.map((ag) => (
                          <tr key={ag.id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedAdGroup(ag); setActiveTab('ad-groups'); }}>
                            <td className="px-4 py-3 text-gray-900 font-medium">{ag.name}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{ag.keywords}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{ag.ctr}%</td>
                            <td className="px-4 py-3 text-right text-gray-600">¥{ag.cpa.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ad-groups' && selectedAdGroup && (
            <div>
              <button onClick={() => setSelectedAdGroup(null)} className="text-blue-600 hover:text-blue-700 font-medium mb-6">← 戻る</button>
              <div className="bg-white border border-gray-200 rounded p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">{selectedAdGroup.name}</h3>
                {keywords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700 font-semibold">キーワード</th>
                          <th className="px-4 py-3 text-center text-gray-700 font-semibold">マッチタイプ</th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">IMP</th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">Click</th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">CTR</th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">CPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywords.map((kw) => (
                          <tr key={kw.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-medium">{kw.text}</td>
                            <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{kw.matchType}</span></td>
                            <td className="px-4 py-3 text-right text-gray-600">{kw.impressions.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{kw.clicks.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{kw.ctr}%</td>
                            <td className="px-4 py-3 text-right text-gray-600">¥{kw.cpa.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">キーワード情報なし</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="bg-white border border-gray-200 rounded p-6">
              <h3 className="font-bold text-gray-900 mb-4">全キーワード パフォーマンス</h3>
              {keywords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">キーワード</th>
                        <th className="px-4 py-3 text-right text-gray-700 font-semibold">CTR</th>
                        <th className="px-4 py-3 text-right text-gray-700 font-semibold">CPA</th>
                        <th className="px-4 py-3 text-right text-gray-700 font-semibold">トレンド</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw) => (
                        <tr key={kw.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{kw.text}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{kw.ctr}%</td>
                          <td className="px-4 py-3 text-right text-gray-600">¥{kw.cpa.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right"><TrendingUp size={16} className="text-green-600" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">キーワード情報なし</p>
              )}
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="bg-white border border-gray-200 rounded p-6">
              <h3 className="font-bold text-gray-900 mb-4">広告一覧</h3>
              {ads.length > 0 ? (
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <div key={ad.id} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                      <h4 className="font-bold text-gray-900 mb-2">{ad.headline1}</h4>
                      <p className="text-sm text-gray-600 mb-3">{ad.description1}</p>
                      <div className="grid grid-cols-4 gap-4">
                        <div><p className="text-xs text-gray-600">IMP</p><p className="font-bold">{ad.impressions.toLocaleString()}</p></div>
                        <div><p className="text-xs text-gray-600">Click</p><p className="font-bold">{ad.clicks.toLocaleString()}</p></div>
                        <div><p className="text-xs text-gray-600">CTR</p><p className="font-bold">{ad.ctr}%</p></div>
                        <div><p className="text-xs text-gray-600">業界比</p><p className={`font-bold ${parseFloat(ad.ctr) > parseFloat(ad.ctrVsIndustry) ? 'text-green-600' : 'text-red-600'}`}>{(parseFloat(ad.ctr) - parseFloat(ad.ctrVsIndustry)).toFixed(2)}%</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">広告情報なし</p>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-6">
                <h3 className="font-bold text-blue-900 mb-4">推奨事項</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <p>✓ Brand キャンペーンの予算増加を推奨（ROAS 5.2x）</p>
                  <p>✓ 低パフォーマンスキーワードの入札額を調整</p>
                  <p>✓ 新規キーワード「Ableton Live チュートリアル」を追加</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-6">
                <h3 className="font-bold text-green-900 mb-4">パフォーマンス</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><p className="text-sm text-green-900">最適化スコア</p><p className="text-2xl font-bold text-green-600">68%</p></div>
                  <div className="flex items-center justify-between"><p className="text-sm text-green-900">業界平均との比較</p><p className="text-2xl font-bold text-green-600">+18%</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
