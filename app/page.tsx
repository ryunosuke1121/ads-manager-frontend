'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, Download, Settings, AlertTriangle, Info, Plus } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type DashboardData = { summary: any; campaigns: any[]; keywords: any[]; };

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState<DashboardData>({ summary: {}, campaigns: [], keywords: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['metrics','campaigns']));
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true); setError(null);
        const [dashboard, campaigns, keywords] = await Promise.all([
          fetch(API_URL+'/api/dashboard', { signal: ctrl.signal, cache: 'no-store' }).then(r => r.json()),
          fetch(API_URL+'/api/campaigns', { signal: ctrl.signal, cache: 'no-store' }).then(r => r.json()),
          fetch(API_URL+'/api/keywords', { signal: ctrl.signal, cache: 'no-store' })
            .then(r => r.ok ? r.json() : { keywords: [] }).catch(() => ({ keywords: [] }))
        ]);
        if (!mounted) return;
        setData({ summary: dashboard?.summary || {}, campaigns: campaigns?.campaigns || [], keywords: keywords?.keywords || [] });
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        setLoading(false);
      }
    })();
    return () => { mounted = false; ctrl.abort(); };
  }, []);

  const toggle = (s: string) => { const n = new Set(expanded); n.has(s) ? n.delete(s) : n.add(s); setExpanded(n); };
  const fmt = (v: any) => { const n = Number(v); return isNaN(n) ? '0' : n.toLocaleString(); };

  const s = data.summary;
  const clicks = s?.totalClicks ?? s?.clicks ?? 0;
  const impressions = s?.totalImpressions ?? s?.impressions ?? 0;
  const cost = s?.totalCost ?? s?.spend ?? 0;
  const conversions = s?.totalConversions ?? s?.conversions ?? 0;
  const ctr = s?.ctr ?? 0;
  const cpc = s?.cpc ?? 0;

  const filteredKw = data.keywords.filter((kw: any) => (kw.text || '').toLowerCase().includes(searchKeyword.toLowerCase()));
  const avgQS = data.keywords.length > 0
    ? Math.round((data.keywords.reduce((sum: number, kw: any) => sum + (kw.qualityScore || 0), 0) / data.keywords.length) * 10) / 10
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">データ取得中...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <AlertTriangle className="text-red-600 mx-auto mb-4" size={32} />
        <p className="font-bold text-gray-900">{error}</p>
      </div>
    </div>
  );

  if (Object.keys(s).length === 0) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Info className="text-blue-600 mx-auto mb-4" size={32} />
        <p className="font-bold text-gray-900">データなし</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex h-screen">
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
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
            {id:'summary',label:'サマリー',icon:'📊'},
            {id:'keywords',label:'キーワード管理',icon:'🔑'},
            {id:'qualityscore',label:'品質スコア分析',icon:'⭐'},
            {id:'bidding',label:'入札管理',icon:'💰'},
            {id:'ads',label:'広告パフォーマンス',icon:'📢'},
            {id:'device',label:'デバイス別分析',icon:'📱'},
            {id:'schedule',label:'時間帯別分析',icon:'⏰'},
            {id:'search',label:'検索語句レポート',icon:'🔍'},
            {id:'excludes',label:'除外キーワード',icon:'🚫'},
            {id:'automation',label:'自動化ルール',icon:'🤖'}
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded transition text-sm ${activeTab===tab.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {activeTab==='summary' && '📊 ダッシュボード'}
            {activeTab==='keywords' && '🔑 キーワード管理'}
            {activeTab==='qualityscore' && '⭐ 品質スコア分析'}
            {!['summary','keywords','qualityscore'].includes(activeTab) && '準備中'}
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

        <div className="p-8">
          {activeTab==='summary' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-green-900">✅ リアルデータ表示中</h3>
                  <p className="text-sm text-green-800 mt-1">Google Ads API から取得した実際のデータを表示しています</p>
                </div>
              </div>

              <div>
                <button onClick={() => toggle('metrics')} className="flex items-center gap-2 mb-3 font-bold text-lg">
                  {expanded.has('metrics') ? '▼' : '▶'} 📊 主要指標
                </button>
                {expanded.has('metrics') && (
                  <>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">消費金額</p>
                        <p className="text-3xl font-bold mt-2">¥{fmt(Math.round(cost/1000))}K</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">インプレッション</p>
                        <p className="text-3xl font-bold mt-2">{fmt(Math.round(impressions/1000))}K</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">クリック数</p>
                        <p className="text-3xl font-bold mt-2">{fmt(clicks)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">コンバージョン</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{fmt(conversions)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">CTR</p>
                        <p className="text-3xl font-bold mt-2">{ctr}%</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">CPC</p>
                        <p className="text-3xl font-bold mt-2">¥{fmt(Math.round(Number(cpc)))}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {data.campaigns.length > 0 && (
                <div>
                  <button onClick={() => toggle('campaigns')} className="flex items-center gap-2 mb-3 font-bold text-lg">
                    {expanded.has('campaigns') ? '▼' : '▶'} 🎯 キャンペーン ({data.campaigns.length})
                  </button>
                  {expanded.has('campaigns') && (
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
                              <td className="px-4 py-3 text-right">{fmt(camp.impressions)}</td>
                              <td className="px-4 py-3 text-right">{fmt(camp.clicks)}</td>
                              <td className="px-4 py-3 text-right">¥{fmt(Math.round(camp.spend/1000))}K</td>
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

          {activeTab==='keywords' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">キーワード一覧 ({data.keywords.length})</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm">
                  <Plus size={16} /> キーワード追加
                </button>
              </div>
              <input type="text" placeholder="キーワード検索..." value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)} className="w-full px-3 py-2 border rounded mb-4" />
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
