"px-4 py-3 text-right text-gray-700 font-semibold">消化金額円</th><th className="px-4 py-3 text-right text-gray-700 font-semibold">リーチ</th><th className="px-4 py-3 text-right text-gray-700 font-semibold">Freq</th>th><th className="px-4 py-3 text-right text-gray-700 font-semibold">CPM円</th>th></tr></>thead><tbody>{monthlyTableData.map(row=><tr key={row.month} className="border-b border-gray-200 hover:bg-gray-50"><td className="px-4 py-3 text-gray-900 font-medium">{row.month}</td>td><td className="px-4 py-3 text-right text-gray-600">{row.impressions.toLocaleString()}</td>td><td className="px-4 py-3 text-right text-gray-600">{row.clicks.toLocaleString()}</td>td><td className="px-4 py-3 text-right text-gray-600">{row.ctr}</td>td><td className="px-4 py-3 text-right text-gray-600">¥{row.cpc.toLocaleString()}</td>td><td className="px-4 py-3 text-right text-blue-600 font-medium">{row.cv.toLocaleString()}</td>td><td className="px-4 py-3 text-right text-gray-600">{row.cvr}</td>td><td className="px-4 py-3 text-right text-gray-600">¥{row.cpa.toLocaleString()}</td>td><td className="px-4 py-3 text-right text-gray-600">¥{row.cost.toLocaleString()}</td>td><td className="px-4 py-3 text-right text-gray-600">{Math.round(row.impressions*0.7).toLocaleString()}</td>td><td className="px-4 py-3 text-right text-gray-600">1.2</td>td><td className="px-4 py-3 text-right text-gray-600">¥{Math.round(row.cost/row.impressions*1000).toLocaleString()}</td>td></tr>tr>)}</tbody>tbody></table></>div></div>}{['weekly','daily','actions','abtest','account','automation'].includes(activeTab)&&<div classNa'mues=e" bcgl-iwehnitt'e; 
biomrpdoerrt  b{o rudseerE-fgfreacyt-,2 0u0s erSotuantdee d}  pf-r6o"m> <'pr ecalcats's;N
aimmep=o"rtte x{t -LgirnaeyC-h6a0r0t",> 準L備中iですn<e/,p >B<a/rdCihva>r}t<,/ dBiavr>,} <X/Adxiivs>,} YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function MetaAdsManager() {
    const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState<any>(null);
    const [monthlyReports, setMonthlyReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
          fetchAllData();
    }, []);'
  u
  s e  ccolnisetn tf'e;t
  cihmAplolrDta t{a  u=s eaEsfyfnecc t(,)  u=s>e S{t
    a t e   }t rfyr o{m
        ' r e a c tc'o;n
  sitm p[odrats h{R eLsi,n emCohnatrhtl,y RLeisn]e ,=  BaawraCihta rPtr,o mBiasre,. aXlAlx(i[s
  ,   Y A x i s ,  fCeatrcthe(s`i$a{nAGPrIi_dU,R LT}o/oalptii/pd,a sLhebgoeanrdd,` )R,e
  s p o n s i v e Cfoenttcahi(n`e$r{,A PCIo_mUpRoLs}e/daCphia/rrte p}o rftrso/mm o'nrtehclhya`r)t
  s ' ; 
   
   c o]n)s;t
   
  A P I _ U R Lc o=n sptr odcaesshsD.aetnav .=N EaXwTa_iPtU BdLaIsCh_RAePsI._jUsRoLn (|)|; 
  ' h t t p : /c/olnoscta lmhoonstth:l3y0D0a1t'a; 
  =
   eaxwpaoirtt  mdoenftahullytR efsu.njcstoino(n) ;M
  e
  t a A d s M asneatgDeart(a)( d{a
    s h Dcaotnas.ts u[mamcatriyv)e;T
  a b ,   s e tsAecttMiovnetThalby]R e=p ourstesS(tmaotnet(h'lsyuDmamtaar y|'|) ;[
  ] ) ;c
  o n s t  }[ dcaattac,h  s(eetrDraotra)]  {=
    u s e S t actoen<saonlye>.(enrurlolr)(;'
    E r rcoorn:s't,  [emrornotrh)l;y
    R e p o r}t sf,i nsaeltlMyo n{t
      h l y R e p osrettsL]o a=d iunsge(Sftaaltsee<)a;n
      y [ ] > (}[
      ] ) ;}
      ; 
       
      c o ncsotn s[tl ocahdairntgD,a tsae t=L omaodnitnhgl]y R=e puosretSst.aftiel(tterru(e()m;:
       
      a n yu)s e=E>f fme.cmto(n(t)h )=.>m a{p
        ( ( m :  faentyc)h A=l>l D(a{tmao(n)t;h
      :   m}.,m o[n]t)h;.
      s
      p l icto(n's-t' )f.estlcihcAel(l1D)a.tjao i=n (a's/y'n)c,  (c)v := >m .{c
        o n v e rtsriyo n{s
            | |   0 ,  ccopnas:t  M[adtahs.hrRoeusn,d (mmo.nctohslty R/e s(]m .=c oanwvaeirts iPornosm i|s|e .1a)l)l,( [c
      t r :   ( ( m . cfleitcckhs( `/$ {(AmP.Ii_mUpRrLe}s/saipoin/sd a|s|h b1o)a)r d*` )1,0
      0 ) . t o F i x efde(t2c)h,( `c$p{cA:P IM_aUtRhL.}r/oaupnid/(rme.pcoorstts //m o(nmt.hcllyi`c)k
      s   | |   1 )]))};)
      )
      . s l i c e (c-o6n)s;t
       
      d a schoDnastta  m=o natwhaliytT adbalsehDRaetsa. j=s omno(n)t;h
      l y R e p o rctosn.sfti lmtoenrt(h(lmy:D aatnay )=  =a>w ami.tm omnotnht)h.lmyaRpe(s(.mj:s oann(y)); 
      =
      >   ( { m o nsteht:D amt.am(odnatshh,D aitmap.rseusmsmiaornys):; 
      m . i m p r essestiMoonnst h|l|y R0e,p ocrltisc(kmso:n tmh.lcylDiactkas  ||||  [0],) ;c
      t r :   (}( mc.actlcihc k(se r/r o(rm). i{m
        p r e s s i ocnosn s|o|l e1.)e)r r*o r1(0'0E)r.rtoorF:i'x,e de(r2r)o,r )c;p
      c :   M a}t hf.irnoaulnldy( m{.
      c o s t   /  s(emt.Lcolaidciknsg (|f|a l1s)e)),; 
      c v :   m}.
      c o n}v;e
      r
      s i ocnosn s|t|  c0h,a rctvDra:t a( (=m .mcoonntvhelrysRieopnosr t/s .(fmi.lctleirc(k(sm :| |a n1y)))  =*>  1m0.0m)o.nttohF)i.xmeadp((2()m,:  capnay:)  M=a>t h(.{rmoounntdh(:m .mc.omsotn t/h .(smp.lciotn(v'e-r's)i.osnlsi c|e|( 11)).)j,o icno(s't/:' )M,a tchv.:r omu.ncdo(nmv.ecrossito)n}s) )|.|s l0i,c ec(p-a1:2 )M;a
      t
      h . rroeutnudr(nm .(c
      o s t   /< d(imv. ccolnavsesrNsaimoen=s" b|g|- w1h)i)t,e  cmtirn:- h(-(smc.rceleinc ktse x/t -(gmr.aiym-p9r0e0s"s>i
      o n s   | |  <1d)i)v  *c l1a0s0s)N.atmoeF=i"xbegd-(w2h)i,t ec pbco:r dMeart-hb. rboourndde(rm-.gcroasyt- 2/0 0( ms.tcilcikcyk st o|p|- 01 )z)-}1)0)".>s
      l i c e ( - 6 ) ;<
  d
                         i v  ccolnassts Nmaomnet=h"lpyxT-a6b lpeyD-a4t"a> 
      =   m o n t h l y R e<pdoirvt sc.lfaislstNearm(e(=m":f laenxy )i t=e>m sm-.cmeonnttehr) .jmuaspt(i(fmy:- baentyw)e e=n>  m(b{-m4o"n>t
      h :   m . m o n t h ,   i<mdpirve scsliaosnssN:a mme.=i"mfplreexs siitoenmss -|c|e n0t,e rc lgiacpk-s3:" >m
      . c l i c k s   | |   0 ,   c<tdri:v  (c(lma.scslNiacmkes= "/w -(8m .hi-m8p rbegs-spiuornpsl e|-|6 010) )r o*u n1d0e0d) .tteoxFti-xwehdi(t2e) ,f lcepxc :i tMeamtsh-.creonutnedr( mj.ucsotsitf y/- c(emn.tcelri ctkesx t|-|s m1 )f)o,n tc-vb:o lmd."c>oMn<v/edrisvi>o
      n s   | |   0 ,   c v r :   (<(hm1. ccolnavsesrNsaimoen=s" t/e x(tm-.xcll ifcoknst -|b|o l1d)")> M*e t1a0広0告ダ)ッシ.ュボtードo<F/ihx1e>d
      ( 2 ) ,   c p a :   M a t<h/.driovu>n
      d ( m . c o s t   /   ( m<.dciovn vcelrassisoNnasm e|=|" t1e)x)t,- xcso stte:x tM-agtrha.yr-o5u0n0d"(>m最終.更新c:o s2t0)2}6)/)3./s2l6i c1e7(:-2132:)5;9
      <
                           / d irve>t
      u r n   ( 
               <<d/idvi vc>l
               a
               s s N a m e = " b g -<wdhiivt ec lmaisns-Nha-msec=r"efelne xt egxatp--g4r abyo-r9d0e0r"->b
                 b o r d e r<-dgirva yc-l2a0s0s Noavmeer=f"lbogw--wxh-iatuet ob"o>r
                 d e r - b   b o r d e r -{g[r{a yi-d2:0 0' ssutmimcakryy 't,o pl-a0b ezl-:1 0'"サマ>リー
                 '   } ,   {   i d<:d i'vm ocnltahslsyN'a,m el=a"bpexl-:6  'p月別yレポ-ート4'" >}
                 ,   {   i d :   ' w e<edkilvy 'c,l alsasbNealm:e ='"週別fレポlートe'x  }i,t e{m si-dc:e n'tdeari ljyu's,t ilfayb-eble:t w'e日別eレポnート 'm b}-,4 "{> 
                 i d :   ' a c t i o n s '<,d ilva bcella:s s'N改善aアクmショeン'= "}f,l e{x  iidt:e m'sa-bcteenstte'r,  glaapb-e3l":> 
                 ' A / B テ スト '   } ,   {   i d<:d i'va cccloausnstN'a,m el=a"bwe-l8:  h'-アカ8ウン ト構b成'g -}p,u r{p lied-:6 0'0a urtooumnadteido nt'e,x tl-awbheilt:e  'f自l動運e用'x  }i]t.emmasp-(c(etnatbe)r  =j>u s(t
                 i f y - c e n t e r   t e x t<-bsumt tfoonn tk-ebyo=l{dt"a>bM.<i/dd}i vo>n
                 C l i c k = { ( )   = >   s e<thA1c tcilvaesTsaNba(mtea=b".tiedx)t}- xcll afsosnNta-mbeo=l{d`"p>xM-e4t ap広告yダッ-シュ3ボー ド<f/ohn1t>-
                 m e d i u m   b o r d e r<-/bd-i2v >w
                 h i t e s p a c e - n o w<rdaipv  tcrlaansssiNtaimoen= "$t{eaxctt-ixvse Ttaebx t=-=g=r atya-b5.0i0d" >?最 終更'新:b o2r0d2e6r/-3b/l2u6e -1670:02 3t:e5x9t<-/bdliuve>-
                 6 0 0 '   :   ' b o r<d/edri-vt>r
                 a
                 n s p a r e n t   t e<xdti-vg rcalya-s7s0N0a'm}e`=}">f
                 l e x   g a p - 4   b o r d e r -{bt abbo.rldaebre-lg}r
                 a y - 2 0 0   o v e r f l o w<-/xb-uatuttoon">>
                 
                                         ){)[}{
                                             i d :   ' s u m m a<r/yd'i,v >l
                 a b e l :   ' サ マリ<ー'/ d}i,v >{
                     i d :   ' m<o/ndtihvl>y
                 '
                 ,   l a b e l{:! l'o月a別レdポーiト'n g} ,& &{  diadt:a  '&w&e e(k
                 l y ' ,   l a b e<ld:i v' 週c別レlポーaト's s}N,a m{e =i"dp:x -'6d apiyl-y6'",> 
                 l a b e l :   ' 日 別レ ポー{ト'a c}t,i v{e Tiadb:  ='=a=c t'isounmsm'a,r yl'a b&e&l :( 
                 ' 改 善ア クシ ョン '   } ,   {   i<dd:i v'>a
                 b t e s t ' ,   l a b e l :  <'dAi/vB テスcト'l a}s,s N{a mied=:" g'raicdc ogurnitd'-,c ollasb-e5l :g a'pア-カウ4ント 構成m'b -}6," >{
                     i d :   ' a u t o m a t i o n '<,d ilva bcella:s s'N自動a運用m'e =}"]b.gm-awph(i(ttea bb)o r=d>e r( 
                     b o r d e r - g r a y - 2 0 0< bruotutnodne dk epy-=5{"t>a
                       b . i d }   o n C l i c k = { ( )   =<>p  sceltaAscstNiavmeeT=a"bt(etxatb-.girda)y}- 6c0l0a stseNxatm-es=m{ `fpoxn-t4- mpeyd-i3u mf"o>n消t費金-額<m/epd>i
                       u m   b o r d e r - b - 2   w h i t e<spp acclea-snsoNwarmaep= "ttreaxnts-i3txilo nf o$n{ta-cbtoilvde Tmatb- 2="=>=1 ,t1a0b4.,i1d5 2?円 <'/bpo>r
                       d e r - b l u e - 6 0 0   t e x t - b<lpu ec-l6a0s0s'N a:m e'=b"otredxetr--gtrraayn-s5p0a0r etnetx tt-exxst -mgtr-a1y"->7昨年0：¥03'9}5`,}8>4
                       8 円< / p > 
                         { t a b . l<a/bdeilv}>
                       
                                                   < / b<udtitvo nc>l
                                                   a s s N a m e = " b g - w)h)i}t
                                                   e   b o r d e r   b o<r/ddeirv->g
                                                   r a y - 2 0 0   r<o/udnidve>d
                                                     p - 5 " > 
                                                   < / d i v > 
                                                    
                                                     { ! l o a<dpi ncgl a&s&s Ndaamtea= "&t&e x(t
                                                   - g r a y - 6 0 0< dtievx tc-lsams sfNoanmte-=m"epdxi-u6m "p>yC-V6数"<>/
                                                   p > 
                                                     { a c t i v e T a b  <=p= =c l'assusmNmaamrey='" t&e&x t(-
                                                     3 x l   f o n t - b o l d< dmitv->2
                                                     " > 7 1 件< / p > 
                                                                 < d i v   c l a s s N a m<ep= "cglraisds Ngarmied=-"ctoelxst--5g rgaayp--540 0m bt-e6x"t>-
                                                     x s   m t - 1 " > 目 標数 ：+ 1 1 < / p<>d
                                                     i v   c l a s s N a m e = " b g -<w/hdiitve> 
                                                     b o r d e r   b o r d e r - g r a<yd-i2v0 0c lraosusnNdaemde =p"-b5g"->w
                                                     h i t e   b o r d e r   b o r d e r -<gpr acyl-a2s0s0N armoeu=n"dteedx tp--g5r"a>y
                                                     - 6 0 0   t e x t - s m   f o n t - m<epd iculma"s>s消費N金額a<m/ep=>"
                                                                                            t e x t - g r a y - 6 0 0   t e x t -<spm  cfloansts-Nmaemdei=u"mt"e>xCtP-A3<x/lp >f
                                                                                            o n t - b o l d   m t - 2 " > 1 , 1 0<4p, 1c5l2a円<s/spN>a
                                                                                            m e = " t e x t - 3 x l   f o n t - b<opl dc lmats-s2N"a>m1e5=,"5t5e1x円<t/-pg>r
                                                                                            a y - 5 0 0   t e x t - x s   m t - 1<"p> 昨年c：¥l3a9s5s,N8a4m8e円<=/"pt>e
                                                                                            x t - g r a y - 5 0 0   t e x t -<x/sd imvt>-
                                                                                            1 " > 目標 ：¥ 2 5 , 0 0 0 円< / p > 
                                                                                              < d i v   c l a s s N a m e = "<b/gd-iwvh>i
                                                                                            t e   b o r d e r   b o r d e r -<gdriavy -c2l0a0s srNoaumned=e"db gp--w5h"i>t
                                                                                            e   b o r d e r   b o r d e r - g r a<yp- 2c0l0a srsoNuanmdee=d" tpe-x5t"->g
                                                                                            r a y - 6 0 0   t e x t - s m   f o n<tp- mceldaisusmN"a>mCeV=数<"/tpe>x
                                                                                            t - g r a y - 6 0 0   t e x t - s m  <fpo nctl-amsesdNiaumme"=>"CtTeRx<t/-p3>x
                                                                                            l   f o n t - b o l d   m t - 2 " > 7<1p件 <c/lpa>s
                                                                                            s N a m e = " t e x t - 3 x l   f o n<tp- bcollads smNta-m2e"=>"2t.e3x4t%-<g/rpa>y
                                                                                            - 5 0 0   t e x t - x s   m t - 1<"/>d目標i数：v+>1
                                                                                            1 < / p > 
                                                                                                                  < d i v   c<l/adsisvN>a
                                                                                            m e = " b g - w h i t e   b o r d<edri vb ocrldaesrs-Ngarmaey=-"2b0g0- wrhoiutned ebdo rpd-e5r" >b
                                                                                            o r d e r - g r a y - 2 0 0   r o u n<dpe dc lpa-s5s"N>a
                                                                                            m e = " t e x t - g r a y - 6 0 0   t<epx tc-lsams sfNoanmte-=m"etdeixutm-"g>rCaVyR-<6/0p0> 
                                                                                            t e x t - s m   f o n t - m e d i u m<"p> CcPlAa<s/spN>a
                                                                                            m e = " t e x t - 3 x l   f o n t - b<opl dc lmats-s2N"a>m7e.=1"5t%e<x/tp->3
                                                                                            x l   f o n t - b o l d   m t - 2<"/>d1i5v,>5
                                                                                            5 1 円 < / p > 
                                                                                                          < / d i v > 
                                                                                                           
                                                                                                                  < p   c l a s s N a m{ec=h"atretxDta-tgar.alye-n5g0t0h  t>e x0t -&x&s  (m
                                                                                            t - 1 " > 目標 ：¥ 2 5 , 0 0 0 円< / p ><
                             d i v   c l a s s N a m e = " g r<i/dd igvr>i
                                                                                            d - c o l s - 2   g a p - 6   m b<-d6i"v> 
                                                                                            c l a s s N a m e = " b g - w h i t e< dbiovr dcelra sbsoNradmeer=-"gbrga-yw-h2i0t0e  rboournddeerd  bpo-r5d"e>r
                                                                                            - g r a y - 2 0 0   r o u n d e d   p<-p6 "c>l
                                                                                            a s s N a m e = " t e x t - g r a y - 6 0<0h 3t ecxlta-sssmN afmoen=t"-fmoendti-ubmo"l>dC TtRe<x/tp->g
                                                                                            r a y - 9 0 0   m b - 4 " > 📊  C V   &< pC PcAl推a移<s/shN3a>m
                                                                                            e = " t e x t - 3 x l   f o n t - b o l d< Rmets-p2o"n>s2i.v3e4C%o<n/tpa>i
                                                                                            n e r   w i d t h = " 1 0 0 % "  <h/ediigvh>t
                                                                                            = { 3 0 0 } > 
                                                                                                              < d i v   c l a s s N a m e<=C"obmgp-owsheidtCeh abrotr ddeart ab=o{rcdhearr-tgDraatya-}2>0
                                                                                                              0   r o u n d e d   p - 5 " > 
                                                                                                                                < C a r t e s i a n<Gpr icdl asstsrNoakmeeD=a"stheaxrtr-agyr=a"y3- 630"0  stterxotk-es=m" #feo5net7-embe"d i/u>m
                                                                                                              " > C V R < / p > 
                                                                                                                                            < X A x<ips  cdlaatsasKNeaym=e"=m"otnetxht"- 3sxtlr ofkoen=t"-#b9oclad3 amft"- 2/">>
                                                                                                              7 . 1 5 % < / p > 
                                                                                                                                            < Y<A/xdiisv >y
                                                                                                              A x i s I d = " l e f t "   s<t/rdoikve>=
                                                                                                              "
                                                                                                              # 9 c a 3 a f "   / > 
                                                                                                                { c h a r t D a t a . l e n g t h   >   0  <&Y&A x(i
                                                                                                                s   y A x i s I d = " r i g h t "< doirvi ecnltaastsiNoanm=e"=r"iggrhitd"  gsrtirdo-kceo=l"s#-92c ag3aapf-"6  /m>b
                                                                                                                - 6 " > 
                                                                                                                                                     < d<iTvo oclltaisps Ncaomnet=e"nbtgS-twyhliet=e{ {b obradcekrg rboournddeCro-lgorra:y -'2#0f03 fr4ofu6n'd,e db opr-d6e"r>:
                                                                                                                                                       ' 1 p x   s o l i d   # e 5 e 7 e b '  <}h}3  /c>l
                                                                                                                                                       a s s N a m e = " f o n t - b o l d   t e x t - g<rLaeyg-e9n0d0  /m>b
                                                                                                                                                       - 4 " > 📊   C V   &   C P A 推移 < / h 3 > 
                                                                                                                                                               < B a r   y A x i s I d = " l e f<tR"e sdpaotnasKievye=C"ocnvt"a ifnielrl =w"i#d3tbh8=2"f160"0 %n"a mhee=i"gChVt数="{ 3r0a0d}i>u
                                                                                                                                                       s = { [ 4 ,   4 ,   0 ,   0 ] }   / > 
                                                                                                                                                             < C o m p o s e d C h a r t   d a t a = { c<hLairnteD aytAax}i>s
                                                                                                                                                             I d = " r i g h t "   t y p e = " m o n o t o n e<"C adratteasKieayn=G"rcipda "s tsrtorkoekDea=s"h#aerfr4a4y4=4""3  s3t"r oskterWoikdet=h"=#{e25}e 7neabm"e =/">C
                                                                                                                                                             P A （円 ）"   / > 
                                                                                                                                                                                               < X A x i s< /dCaotmapKoesye=d"Cmhoanrtth>"
                                                                                                                                                                                                 s t r o k e = " # 9 c a 3 a f "   / > 
                                                                                                                                                                                               < / R e s p o n s i v e C o n t a i n e r > 
                                                                                                                                                                                                   < Y A x i s   y A x i s I d = " l<e/fdti"v >s
                                                                                                                                                                                                   t
                                                                                                                                                                                                   r o k e = " # 9 c a 3 a f "   / > 
                                                                                                                                                                                                     < d i v   c l a s s N a m e = " b g - w h i t e< YbAoxridse ry AbxoirsdIedr=-"grriagyh-t2"0 0o rrioeunntdaetdi opn-=6""r>i
                                                                                                                                                                                                   g h t "   s t r o k e = " # 9 c a 3 a f "< h/3> 
                                                                                                                                                                                                   c l a s s N a m e = " f o n t - b o l d   t e x t<-Tgoroalyt-i9p0 0c omnbt-e4n"t>S📈t yClTeR= {&{  CbPaCc推移k<g/rho3u>n
                                                                                                                                                                                                     d C o l o r :   ' # f 3 f 4 f 6 ' ,   b o<rRdeesrp:o n's1ipvxe Csoonltiadi n#eer5 ew7iedbt'h =}"}1 0/0>%
                                                                                                                                                                                                   "   h e i g h t = { 3 0 0 } > 
                                                                                                                                                                                                                     < L e g e n d   / > 
                                                                                                                                                                                                         < C o m p o s e d C h a r t   d a t a = { c<hBaarrt DyaAtxai}s>I
                                                                                                                                                                                                         d = " l e f t "   d a t a K e y = " c v "   f i l<lC=a"r#t3ebs8i2afn6G"r inda mset=r"oCkVe数D"a srhaadriruasy=={"[34 ,3 "4 ,s t0r,o k0e]=}" #/e>5
                                                                                                                                                                                                         e 7 e b "   / > 
                                                                                                                                                                                                                                         < L i n e   y A x<iXsAIxdi=s" rdiagthatK"e yt=y"pmeo=n"tmho"n osttornoek"e =d"a#t9acKae3ya=f""c p/a>"
                                                                                                                                                                                                           s t r o k e = " # e f 4 4 4 4 "   s t r o k e W<iYdAtxhi=s{ 2y}A xniasmIed==""ClPeAf（円t）""  /s>t
                                                                                                                                                                                                         r o k e = " # 9 c a 3 a f "   / > 
                                                                                                                                                                                                                   < / C o m p o s e d C h a r t > 
                                                                                                                                                                                                                         < Y A x i s   y A x i s I d = " r i<g/hRte"s poorniseinvteaCtoinotna=i"nreirg>h
                                                                                                                                                                                                                   t "   s t r o k e = " # 9 c a 3 a f "< //d>i
                               v > 
                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                        < d i<vT ocollatsispN acmoen=t"ebngt-Swthyiltee= {b{o rbdaecrk gbroorudnedrC-oglroary:- 2'0#0f 3rfo4ufn6d'e,d  bpo-r6d"e>r
                                                                                                                                                                                                                                                        :   ' 1 p x   s o l i d   # e 5 e 7 e b '< h}3}  c/l>a
                                                                                                                                                                                                                                                        s s N a m e = " f o n t - b o l d   t e x t - g r<aLye-g9e0n0d  m/b>-
                                                                                                                                                                                                                                                        4 " > 📈   C T R   &   C P C 推移 < / h 3 > 
                                                                                                                                                                                                                                                                < B a r   y A x i s I d = " l e f<tR"e sdpaotnasKievye=C"ocnttra"i nfeirl lw=i"d#tfh5=9"e100b0"% "n ahmeei=g"hCtT=R{（3%0）"0 }r>a
                                                                                                                                                                                                                                                        d i u s = { [ 4 ,   4 ,   0 ,   0 ] }   / > 
                                                                                                                                                                                                                                                        < C o m p o s e d C h a r t   d a t a = { c h a r<tLDiantea }y>A
                                                                                                                                                                                                                                                        x i s I d = " r i g h t "   t y p e = " m o n o t<oCnaer"t edsaitaanKGeryi=d" csptcr"o ksetDraoskhea=r"r#a1y0=b"938 13""  ssttrrookke="#e5e7eb" />
                                                                                                                                                                                                                                                                                <XAxis dataKey="month" stroke="#9ca3af" />
                                                                                                                                                                                                                                                                                <YAxis yAxisId="left" stroke="#9ca3af" />
                                                                                                                                                                                                                                                                                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                                                                                                                                                                                                                                                                                <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }} />
                                                                                                                                                                                                                                                                                <Legend />
                                                                                                                                                                                                                                                                                <Bar yAxisId="left" dataKey="ctr" fill="#f59e0b" name="CTR（%）" radius={[4, 4, 0, 0]} />
                                                                                                                                                                                                                                                                                <Line yAxisId="right" type="monotone" dataKey="cpc" stroke="#10b981" strokeWidth={2} name="CPC（円）" />
                                                                                                                                                                                                                                                                              </>ComposedChart>
                                                                                                                                                                                                                                                                            </vT>ResponsiveContainer>
                                                                                                                                                                                                                                     </v>div>
                                                                                                                                                                                                                                   </>div>
                                                                                                                                                                                                                       )}
                                                                                                                                                                                                         
                                                                                                                                                                                                                       <div className="bg-white border border-gray-200 rounded p-6">
                                                                                                                                                                                                                                       <h3 className="font-bold text-gray-900 mb-4">📍 当月サマリ指標</h3>h3>
                                                                                                                                                                                                                                       <div className="grid grid-cols-6 gap-4">
                                                                                                                                                                                                                                                         {[{ label: 'IMP', value: '42,467' }, { label: 'リンククリック', value: '993' }, { label: 'CPC', value: '1,112円' }, { label: 'リーチ', value: '15,762' }, { label: 'フリークエンシー', value: '2.7' }, { label: 'CPM', value: '26,000円' }].map((item) => (
                                                   <div key={item.label} className="text-center">
                                                                         <p className="text-gray-600 text-sm mb-2">{item.label}</p>p>
                                                                         <p className="text-2xl font-bold">{item.value}</p>p>
                                                   </div>div>
                                                 ))}
                                                                                                                                                                                                                                                       </div>div>
                                                                                                                                                                                                                                     </div>div>
                                                                                                                                                                                                                     </C>div>
                                                                                                                                                                                                             )}
                                                                                                                                                                                                   
                                                                                                                                                                                                             {activeTab === 'monthly' && (
                                           <div>
                                                         <div className="mb-6 flex gap-2">
                                                           {['月', '先月4週', '直近7日', '直近12日', '全期間'].map((btn) => (
                                                               <button key={btn} className={`px-4 py-2 rounded font-medium ${btn === '月' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                                 {btn}
                                                               </button>button>
                                                             ))}
                                                         </div>div>
                                           
                                                         <div className="grid grid-cols-5 gap-4 mb-6">
                                                                         <div className="bg-white border border-gray-200 rounded p-4">
                                                                                           <p className="text-gray-600 text-sm">消費金額</p>p>
                                                                                           <p className="text-2xl font-bold mt-1">¥5,651,850円</p>p>
                                                                         </div>div>
                                                                         <div className="bg-white border border-gray-200 rounded p-4">
                                                                                           <p className="text-gray-600 text-sm">CV</p>p>
                                                                                           <p className="text-2xl font-bold mt-1">264</p>p>
                                                                         </div>div>
                                                                         <div className="bg-white border border-gray-200 rounded p-4">
                                                                                           <p className="text-gray-600 text-sm">CPA</p>p>
                                                                                           <p className="text-2xl font-bold mt-1">¥21,030円</p>p>
                                                                         </div>div>
                                                                         <div className="bg-white border border-gray-200 rounded p-4">
                                                                                           <p className="text-gray-600 text-sm">CTR</p>p>
                                                                                           <p className="text-2xl font-bold mt-1">2.25%</p>p>
                                                                         </div>div>
                                                                         <div className="bg-white border border-gray-200 rounded p-4">
                                                                                           <p className="text-gray-600 text-sm">CVR</p>p>
                                                                                           <        <th className="px-4 py-3 text-right text-gray-700 font-semibold">消化金額(円)</th>th>
                                                                                                                 <th className="px-4 py-3 text-right text-gray-700 font-semibold">リーチ</th>th>
                                                                                                                 <th className="px-4 py-3 text-right text-gray-700 font-semibold">Freq</th>th>
                                                                                                                 <th className="px-4 py-3 text-right text-gray-700 font-semibold">CPM(円)</th>th>
                                                                                             </>tr>
                                                                         </div>thead>
                                                                           <tbody>
                                                                             {monthlyTableData.map((row: any) => (
                                                                   <tr key={row.month} className="border-b border-gray-200 hover:bg-gray-50">
                                                                                           <td className="px-4 py-3 text-gray-900 font-medium">{row.month}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">{row.impressions.toLocaleString()}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">{row.clicks.toLocaleString()}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">{row.ctr}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">¥{row.cpc.toLocaleString()}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-blue-600 font-medium">{row.cv.toLocaleString()}</td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">{row.cvr}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">¥{row.cpa.toLocaleString()}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">¥{row.cost.toLocaleString()}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">{Math.round(row.impressions * 0.7).toLocaleString()}</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">1.2</td>td>
                                                                                           <td className="px-4 py-3 text-right text-gray-600">¥{Math.round((row.cost / row.impressions) * 1000).toLocaleString()}</td>td>
                                                                   </tr>tr>
                                                                 ))}
                                                                           </tbody>tbody>
                                                         </div>table>
                                           </div>div>
                                                                                                                                                                                                               </div>
                                                                                                                                                                                                                         )}
                                                                                                                                                                                                               
                                                                                                                                                                                                                         {['weekly', 'daily', 'actions', 'abtest', 'account', 'automation'].includes(activeTab) && (
                                                                                                                                                                                                                             <div className="bg-white border border-gray-200 rounded p-6">
                                                                                                                                                                                                                                           <p className="text-gray-600">準備中です。</p>p>
                                                                                                                                                                                                                                         </div>div>
                                                                                                                                                                                                                         )}
                                                                                                                                                                                                                       </>div>
                                                                                                                                                                                                         )}
                                                                                                                                                                                                       </>div>
                                                                                                                                                                                                     );
                                                                                                                                                                                                     }</th>p className="text-2xl font-bold mt-1">4.33%</p>p>
                                                                         </div>div>
                                                         </div>div>
                                           
                                                         <div className="bg-white border border-gray-200 rounded overflow-hidden">
                                                                         <table className="w-full text-sm">
                                                                                           <thead className="bg-gray-50 border-b border-gray-200">
                                                                                                               <tr>
                                                                                                                                     <th className="px-4 py-3 text-left text-gray-700 font-semibold">月</th>th>
                                                                                                                                     <th className="px-4 py-3 text-right text-gray-700 font-semibold">IMP</th>th>
                                                                                                                                     <th className="px-4 py-3 text-right text-gray-700 font-semibold">Click</th>th>
                                                                                                                                     <th className="px-4 py-3 text-right text-gray-700 font-semibold">CTR(%)</th>th>
                                                                                                                                     <th className="px-4 py-3 text-right text-gray-700 font-semibold">CPC(円)</th>th>
                                                                                                                                     <th className="px-4 py-3 text-right text-gray-700 font-semibold">CV</th>th>
                                                                                                                                     <th className="px-4 py-3 text-right text-gray-700 font-semibold">CVR(%)</th>th>
                                                                                                                                     <th className="px-4 py-3 text-right text-gray-700 font-semibold">CPA(円)</th>th>
                                                                                                                             </></></></th>
