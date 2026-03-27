'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, Download, Settings, AlertTriangle, Info, Plus, Trash2, Edit2, Play, Pause } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
type DashboardData = { summary: any; campaigns: any[]; keywords: any[]; };

export default function GoogleAdsManager() {
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState<DashboardData>({ summary: {}, campaigns: [], keywords: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['metrics','campaigns']));
  const [searchKeyword, setSearchKeyword] = useState('');
  const [excludeInput, setExcludeInput] = useState('');
  const [excludeList, setExcludeList] = useState<string[]>(['競合他社名', 'フリー', '無料', 'DIY']);

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
  const cpa = conversions > 0 ? Math.round(cost / conversions) : 0;
  const cvr = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '0.00';

  const filteredKw = data.keywords.filter((kw: any) => (kw.text || '').toLowerCase().includes(searchKeyword.toLowerCase()));
  const avgQS = data.keywords.length > 0
    ? Math.round((data.keywords.reduce((sum: number, kw: any) => sum + (kw.qualityScore || 0), 0) / data.keywords.length) * 10) / 10 : 0;

  const TABS = [
    {id:'summary',label:'サマリー',icon:'📊'},
    {id:'keywords',label:'キーワード管理',icon:'🔑'},
    {id:'qualityscore',label:'品質スコア分析',icon:'⭐'},
    {id:'bidding',label:'入札管理',icon:'💰'},
    {id:'ads',label:'広告パフォーマンス',icon:'📢'},
    {id:'device',label:'デバイス別分析',icon:'📱'},
    {id:'schedule',label:'時間帯別分析',icon:'⏰'},
    {id:'search',label:'検索語句レポート',icon:'🔍'},
    {id:'excludes',label:'除外キーワード',icon:'🚫'},
    {id:'automation',label:'自動化ルール',icon:'🤖'},
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-800 font-medium">データ取得中...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center"><AlertTriangle className="text-red-600 mx-auto mb-4" size={32} /><p className="font-bold text-gray-900">{error}</p></div>
    </div>
  );
  if (Object.keys(s).length === 0) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center"><Info className="text-blue-600 mx-auto mb-4" size={32} /><p className="font-bold text-gray-900">データなし</p></div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen flex h-screen text-gray-900">
      {/* サイドバー */}
      <div className="w-60 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-lg text-white flex items-center justify-center font-bold text-sm">G</div>
            <div><p className="font-bold text-sm text-gray-900">Google Ads</p><p className="text-xs text-gray-500">リスティング管理</p></div>
          </div>
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition">
            <Plus size={14} /> キャンペーン作成
          </button>
        </div>
        <nav className="p-3 space-y-0.5">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium ${activeTab===tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <span className="mr-2">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* メイン */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">{TABS.find(t=>t.id===activeTab)?.icon} {TABS.find(t=>t.id===activeTab)?.label}</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm text-gray-700 font-medium transition">
              <Download size={15} /> エクスポート
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm text-gray-700 font-medium transition">
              <Settings size={15} /> 設定
            </button>
          </div>
        </div>

        <div className="p-6">

          {/* ===== サマリー ===== */}
          {activeTab==='summary' && (
            <div className="space-y-5">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div><p className="font-bold text-green-900 text-sm">✅ リアルデータ表示中</p><p className="text-xs text-green-700 mt-0.5">Google Ads API から取得した実際のデータ（過去30日）</p></div>
              </div>
              <div>
                <button onClick={() => toggle('metrics')} className="flex items-center gap-2 mb-3 font-bold text-base text-gray-900">
                  {expanded.has('metrics') ? '▼' : '▶'} 主要指標
                </button>
                {expanded.has('metrics') && (<>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {[
                      {label:'消費金額', value:`¥${fmt(Math.round(cost/1000))}K`, sub:`¥${fmt(Math.round(cost))}円`},
                      {label:'インプレッション', value:`${fmt(Math.round(impressions/1000))}K`, sub:`${fmt(impressions)}回`},
                      {label:'クリック数', value:fmt(clicks), sub:`CTR ${ctr}%`},
                      {label:'コンバージョン', value:fmt(conversions), sub:`CVR ${cvr}%`, accent:true},
                    ].map((m,i) => (
                      <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 mb-1">{m.label}</p>
                        <p className={`text-2xl font-bold ${m.accent ? 'text-blue-600' : 'text-gray-900'}`}>{m.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{m.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {label:'CPC（クリック単価）', value:`¥${fmt(Math.round(Number(cpc)))}`},
                      {label:'CPA（獲得単価）', value:`¥${fmt(cpa)}`},
                      {label:'CTR（クリック率）', value:`${ctr}%`},
                    ].map((m,i) => (
                      <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 mb-1">{m.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </>)}
              </div>
              {data.campaigns.length > 0 && (
                <div>
                  <button onClick={() => toggle('campaigns')} className="flex items-center gap-2 mb-3 font-bold text-base text-gray-900">
                    {expanded.has('campaigns') ? '▼' : '▶'} キャンペーン一覧 ({data.campaigns.length})
                  </button>
                  {expanded.has('campaigns') && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>{['キャンペーン名','IMP','Click','消費','CV'].map(h=><th key={h} className={`px-4 py-3 text-xs font-bold text-gray-600 ${h==='キャンペーン名'?'text-left':'text-right'}`}>{h}</th>)}</tr>
                        </thead>
                        <tbody>{data.campaigns.map((c:any,i:number)=>(
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                            <td className="px-4 py-3 text-right text-gray-700">{fmt(c.impressions)}</td>
                            <td className="px-4 py-3 text-right text-gray-700">{fmt(c.clicks)}</td>
                            <td className="px-4 py-3 text-right text-gray-700">¥{fmt(Math.round(c.spend/1000))}K</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-600">{c.conversions}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===== キーワード管理 ===== */}
          {activeTab==='keywords' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-gray-900">キーワード一覧 ({data.keywords.length}件)</p>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 transition"><Plus size={14}/> 追加</button>
              </div>
              <input type="text" placeholder="キーワード検索..." value={searchKeyword} onChange={e=>setSearchKeyword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              {data.keywords.length > 0 ? (
                <table className="w-full text-sm"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['キーワード','マッチ','IMP','Click','品質スコア'].map(h=><th key={h} className={`px-4 py-3 text-xs font-bold text-gray-600 ${h==='キーワード'?'text-left':'text-center'}`}>{h}</th>)}</tr></thead>
                  <tbody>{filteredKw.map((kw:any,i:number)=>(
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{kw.text}</td>
                      <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{kw.matchType}</span></td>
                      <td className="px-4 py-3 text-center text-gray-700">{fmt(kw.impressions)}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{fmt(kw.clicks)}</td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs font-bold ${(kw.qualityScore||0)>=8?'bg-green-100 text-green-700':(kw.qualityScore||0)>=6?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>⭐{kw.qualityScore||0}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : <p className="text-center py-8 text-gray-500 text-sm">キーワードデータなし</p>}
            </div>
          )}

          {/* ===== 品質スコア ===== */}
          {activeTab==='qualityscore' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  {label:'平均品質スコア', value:avgQS, color:'text-yellow-600', bg:'bg-yellow-50', border:'border-yellow-200'},
                  {label:'高品質（8-10）', value:`${data.keywords.length>0?Math.round((data.keywords.filter((k:any)=>(k.qualityScore||0)>=8).length/data.keywords.length)*100):0}%`, color:'text-green-600', bg:'bg-green-50', border:'border-green-200'},
                  {label:'低品質（1-4）', value:`${data.keywords.length>0?Math.round((data.keywords.filter((k:any)=>(k.qualityScore||0)<=4).length/data.keywords.length)*100):0}%`, color:'text-red-600', bg:'bg-red-50', border:'border-red-200'},
                ].map((m,i)=>(
                  <div key={i} className={`${m.bg} p-6 rounded-xl border ${m.border} shadow-sm`}>
                    <p className="text-xs font-medium text-gray-600 mb-2">{m.label}</p>
                    <p className={`text-4xl font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
              {data.keywords.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr>{['キーワード','品質スコア','広告関連性','LP品質','期待CTR'].map(h=><th key={h} className={`px-4 py-3 text-xs font-bold text-gray-600 ${h==='キーワード'?'text-left':'text-center'}`}>{h}</th>)}</tr></thead>
                    <tbody>{data.keywords.slice(0,20).map((kw:any,i:number)=>{
                      const qs = kw.qualityScore||0;
                      return <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{kw.text}</td>
                        <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs font-bold ${qs>=8?'bg-green-100 text-green-700':qs>=6?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{qs}/10</span></td>
                        <td className="px-4 py-3 text-center text-gray-600 text-xs">{qs>=7?'平均以上':qs>=5?'平均的':'平均以下'}</td>
                        <td className="px-4 py-3 text-center text-gray-600 text-xs">{qs>=7?'良好':qs>=5?'普通':'要改善'}</td>
                        <td className="px-4 py-3 text-center text-gray-600 text-xs">{qs>=8?'高い':qs>=6?'平均的':'低い'}</td>
                      </tr>;
                    })}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== 入札管理 ===== */}
          {activeTab==='bidding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  {label:'平均CPC', value:`¥${fmt(Math.round(Number(cpc)))}`, sub:'クリック単価'},
                  {label:'平均CPA', value:`¥${fmt(cpa)}`, sub:'コンバージョン単価'},
                  {label:'総消費', value:`¥${fmt(Math.round(cost/1000))}K`, sub:'過去30日'},
                ].map((m,i)=>(
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 mb-1">{m.sub}</p>
                    <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
              {data.campaigns.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <p className="font-bold text-gray-900 text-sm">キャンペーン別入札状況</p>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1 transition"><Edit2 size={12}/> 入札額変更</button>
                  </div>
                  <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr>{['キャンペーン','消費','CPC','CPA','CV数','ステータス'].map(h=><th key={h} className={`px-4 py-3 text-xs font-bold text-gray-600 ${h==='キャンペーン'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
                    <tbody>{data.campaigns.map((c:any,i:number)=>{
                      const campCpa = c.conversions>0 ? Math.round(c.spend/c.conversions) : 0;
                      const campCpc = c.clicks>0 ? Math.round(c.spend/c.clicks) : 0;
                      return <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                        <td className="px-4 py-3 text-right text-gray-700">¥{fmt(Math.round(c.spend/1000))}K</td>
                        <td className="px-4 py-3 text-right text-gray-700">¥{fmt(campCpc)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{campCpa>0?`¥${fmt(campCpa)}`:'—'}</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-600">{c.conversions}</td>
                        <td className="px-4 py-3 text-right"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">配信中</span></td>
                      </tr>;
                    })}</tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">キャンペーンデータを読み込み中...</div>
              )}
            </div>
          )}

          {/* ===== 広告パフォーマンス ===== */}
          {activeTab==='ads' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {[
                  {label:'CTR', value:`${ctr}%`, sub:'クリック率', color:'text-blue-600'},
                  {label:'CVR', value:`${cvr}%`, sub:'コンバージョン率', color:'text-green-600'},
                  {label:'CPA', value:`¥${fmt(cpa)}`, sub:'獲得単価', color:'text-gray-900'},
                  {label:'合計CV', value:fmt(conversions), sub:'コンバージョン数', color:'text-purple-600'},
                ].map((m,i)=>(
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 mb-1">{m.sub}</p>
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
              {data.campaigns.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200"><p className="font-bold text-gray-900 text-sm">キャンペーン別パフォーマンス</p></div>
                  <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr>{['キャンペーン','IMP','Click','CTR','CV','CVR','CPA'].map(h=><th key={h} className={`px-4 py-3 text-xs font-bold text-gray-600 ${h==='キャンペーン'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
                    <tbody>{data.campaigns.map((c:any,i:number)=>{
                      const campCtr = c.impressions>0 ? ((c.clicks/c.impressions)*100).toFixed(2) : '0.00';
                      const campCvr = c.clicks>0 ? ((c.conversions/c.clicks)*100).toFixed(2) : '0.00';
                      const campCpa = c.conversions>0 ? Math.round(c.spend/c.conversions) : 0;
                      return <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(c.impressions)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(c.clicks)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{campCtr}%</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-600">{c.conversions}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{campCvr}%</td>
                        <td className="px-4 py-3 text-right text-gray-700">{campCpa>0?`¥${fmt(campCpa)}`:'—'}</td>
                      </tr>;
                    })}</tbody>
                  </table>
                </div>
              ) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">キャンペーンデータを読み込み中...</div>}
            </div>
          )}

          {/* ===== デバイス別分析 ===== */}
          {activeTab==='device' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">※ デバイス別データはGoogle Ads APIから直接取得するには追加クエリが必要です。現在は全体合計から推計した参考値を表示しています。</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {device:'📱 スマートフォン', share:62, clicks:Math.round(clicks*0.62), conv:Math.round(conversions*0.55), ctr:'4.1'},
                  {device:'🖥️ デスクトップ', share:30, clicks:Math.round(clicks*0.30), conv:Math.round(conversions*0.38), ctr:'3.5'},
                  {device:'📲 タブレット', share:8, clicks:Math.round(clicks*0.08), conv:Math.round(conversions*0.07), ctr:'3.2'},
                ].map((d,i)=>(
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="font-bold text-gray-900 mb-3">{d.device}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">シェア</span><span className="font-bold text-gray-900">{d.share}%</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width:`${d.share}%`}}></div></div>
                      <div className="flex justify-between text-sm pt-1"><span className="text-gray-500">クリック</span><span className="font-medium text-gray-900">{fmt(d.clicks)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">CV</span><span className="font-bold text-blue-600">{d.conv}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">CTR</span><span className="font-medium text-gray-900">{d.ctr}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*
