/* ============ Evolvepreneur iQ — Dashboard tab engine (generic) ============ */
/* Data-driven and connector-driven. Ships with NO client data. The console    */
/* generator injects per-client data globals (EIQ / EIQGROUP for the EiQ        */
/* source; GROUP / BR / TR / ESGX for an optional EP v1 source) into the        */
/* delivered artifact. With no data present, the tab shows an empty state.      */
/* No client figures, names, or narrative live in this file.                    */
(function(){
  if(window.__dashInit) return; window.__dashInit=true;

  /* read possibly-undefined globals without throwing */
  function G(n){ try{ return (0,eval)(n); }catch(e){ return undefined; } }
  var EIQ=G('EIQ')||null, EIQGROUP=G('EIQGROUP')||null,
      GROUP=G('GROUP')||null, BR=G('BR')||null, TR=G('TR')||{}, ESGX=G('ESGX')||null;

  var hasEiq = !!(EIQ && Object.keys(EIQ).length);
  var hasEp  = !!(GROUP && BR && Object.keys(BR).length);

  var SRC={};
  if(hasEiq) SRC.eiq={label:'EiQ'};
  if(hasEp)  SRC.epv1={label:'EP v1'};
  var DS={ source:(hasEiq?'eiq':(hasEp?'epv1':null)), brand:'group', section:'overview' };

  /* ---- CSS (reuses console theme vars) ---- */
  var css=document.createElement('style'); css.textContent=[
    '.dk{padding:22px 26px 40px;overflow:auto}',
    '.dk-head{display:flex;align-items:center;gap:12px;margin-bottom:4px;flex-wrap:wrap}',
    '.dk-head h2{font-size:19px;margin:0;letter-spacing:-.01em}',
    '.dk-badge{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);background:var(--hover);padding:3px 9px;border-radius:20px}',
    '.dk-sub{color:var(--muted);font-size:13px;margin:0 0 18px}',
    '.dk-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:13px;margin-bottom:20px}',
    '.dk-kpi{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:14px 16px}',
    '.dk-kpi .l{font-size:12px;color:var(--muted);font-weight:550}',
    '.dk-kpi .v{font-size:23px;font-weight:750;margin-top:5px;letter-spacing:-.02em;color:var(--ink)}',
    '.dk-kpi .f{font-size:11px;color:var(--faint);margin-top:3px}',
    '.dk-kpi.acc{border-left:3px solid var(--accent)}',
    '.dk-kpi.neg .v{color:#e11d48}',
    '.dk-g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}',
    '@media(max-width:1150px){.dk-g2{grid-template-columns:1fr}}',
    '.dk-card{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:16px 18px;margin-bottom:16px}',
    '.dk-card h3{margin:0 0 2px;font-size:14.5px;font-weight:640;color:var(--ink)}',
    '.dk-card .hint{font-size:12px;color:var(--muted);margin-bottom:12px}',
    '.dk-cw{position:relative;height:280px}.dk-cw.t{height:330px}',
    '.dk table{width:100%;border-collapse:collapse;font-size:13px}',
    '.dk th,.dk td{text-align:left;padding:8px 8px;border-bottom:1px solid var(--line);color:var(--ink)}',
    '.dk th{color:var(--muted);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.04em}',
    '.dk td.n,.dk th.n{text-align:right;font-variant-numeric:tabular-nums}',
    '.dk-note{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:11px 13px;font-size:12.5px;color:var(--text2);margin-bottom:18px;line-height:1.55}',
    '.dk-warn{background:#fffbeb;border-color:#fde68a;color:#92400e}',
    'html[data-theme=dark] .dk-warn{background:#3a2f10;border-color:#5c4a15;color:#f2d98a}',
    '.dk-empty{max-width:480px;margin:9vh auto;text-align:center;color:var(--muted)}',
    '.dk-empty .i{width:62px;height:62px;border-radius:16px;background:linear-gradient(135deg,#17b0f3,#e0189e);display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;margin:0 auto 14px}',
    '.dk-empty h3{color:var(--ink);font-size:18px;margin:0 0 8px}.dk-empty p{line-height:1.6}',
    '.dm-src{display:flex;gap:4px;margin:2px 10px 12px;background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:3px}',
    '.dm-src button{flex:1;border:0;background:transparent;color:var(--muted);font-size:12px;font-weight:700;padding:7px;border-radius:7px;cursor:pointer}',
    '.dm-src button.on{background:var(--accent);color:#fff}',
    '.dm-cap{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--faint);padding:8px 12px 4px}',
    '.dm-row{display:flex;align-items:center;gap:10px;padding:8px 12px;font-size:13px;color:var(--text2);cursor:pointer;border-left:3px solid transparent}',
    '.dm-row:hover{background:var(--hover);color:var(--ink)}',
    '.dm-row.on{color:var(--accent);border-left-color:var(--accent);background:var(--hover);font-weight:600}',
    '.dm-row .d{width:8px;height:8px;border-radius:50%;flex:0 0 auto}',
    '.dm-stub{font-size:10px;color:var(--faint);margin-left:auto}'
  ].join(''); document.head.appendChild(css);

  /* ---- helpers ---- */
  function money(n){return '$'+Math.round(n).toLocaleString();}
  function moneyK(n){return Math.abs(n)>=1000?'$'+(n/1000).toFixed(Math.abs(n)>=100000?0:1)+'k':'$'+Math.round(n);}
  function num(n){return Number(n).toLocaleString();}
  function kpi(l,v,f,acc){return '<div class="dk-kpi'+(acc?' acc':'')+'"><div class="l">'+l+'</div><div class="v">'+v+'</div>'+(f?'<div class="f">'+f+'</div>':'')+'</div>';}
  function kpiNeg(l,v,f){return '<div class="dk-kpi neg"><div class="l">'+l+'</div><div class="v">'+v+'</div>'+(f?'<div class="f">'+f+'</div>':'')+'</div>';}
  function tc(){var s=getComputedStyle(document.body);return{m:s.getPropertyValue('--muted').trim(),g:s.getPropertyValue('--line').trim()};}
  function axes(){var c=tc();return{grid:{grid:{color:c.g},border:{display:false},ticks:{color:c.m}},no:{grid:{display:false},border:{display:false},ticks:{color:c.m}}};}
  var CH={}; function kill(id){if(CH[id]){CH[id].destroy();delete CH[id];}}
  function chart(id,cfg){ if(typeof Chart==='undefined')return; kill(id); var el=document.getElementById(id); if(el)CH[id]=new Chart(el,cfg); }

  /* ---- brand list derived from the data that's actually present ---- */
  function brandMeta(k){ var d=(EIQ&&EIQ[k])||(BR&&BR[k]); return { name:(d&&d.name)||k, color:(d&&d.color)||'#6d28d9' }; }
  function brandKeys(source){
    if(source==='eiq') return EIQ?Object.keys(EIQ):[];
    return BR?Object.keys(BR):[];
  }
  function brandList(){
    var ks=brandKeys(DS.source), out=[['group','Group — all brands','#6d28d9']];
    ks.forEach(function(k){ var m=brandMeta(k); out.push([k,m.name,m.color]); });
    return out;
  }
  function brandColor(){ if(DS.brand==='group')return '#6d28d9'; return brandMeta(DS.brand).color; }
  function brandName(){ if(DS.brand==='group')return 'Group'; return brandMeta(DS.brand).name; }

  function eiqSections(b){
    if(b==='group') return [['overview','Group Overview']];
    var d=EIQ&&EIQ[b]; if(!d) return [];
    var s=[['overview','Overview'],['sales','Sales & Revenue'],['customers','Customers & LTV']];
    if(TR[b]) s.push(['marketing','Marketing & Traffic']);
    if(d.has&&d.has.royalties&&d.roy) s.push(['royalties','Royalties & Books']);
    if(d.has&&d.has.finance&&d.finance) s.push(['finance','Finance & P&L']);
    if(d.has&&d.has.pipeline&&d.pipeline) s.push(['pipeline','Sales Pipeline']);
    if(d.has&&d.has.subs&&d.subs) s.push(['subs','Subscriptions']);
    return s;
  }
  function epSections(b){
    if(b==='group') return [['overview','Group Overview']];
    var d=BR&&BR[b]; if(!d||d.empty) return [['overview','Overview']];
    var core=[['overview','Overview'],['sales','Sales & Revenue'],['members','Members & Courses'],['customers','Top Customers'],['marketing','Marketing & Traffic']];
    if(d.full){ if(ESGX)core.push(['royalties','Royalties & Books']); }
    return core;
  }
  function sectionsFor(){ return DS.source==='eiq'?eiqSections(DS.brand):epSections(DS.brand); }

  /* ---- left menu ---- */
  function renderDashMenu(){
    var menu=document.getElementById('menu'); if(!menu)return;
    var srcBtns=Object.keys(SRC).length>1 ? '<div class="dm-src">'+Object.keys(SRC).map(function(k){return '<button data-src="'+k+'"'+(DS.source===k?' class="on"':'')+'>'+SRC[k].label+'</button>';}).join('')+'</div>' : '';
    var bl=brandList();
    var biz='<div class="dm-cap">Businesses</div>'+bl.map(function(b){
      return '<div class="dm-row'+(DS.brand===b[0]?' on':'')+'" data-brand="'+b[0]+'"><span class="d" style="background:'+b[2]+'"></span>'+b[1]+'</div>';
    }).join('');
    var secs=sectionsFor();
    var sec='<div class="dm-cap">Sections</div>'+secs.map(function(s){return '<div class="dm-row'+(DS.section===s[0]?' on':'')+'" data-sec="'+s[0]+'"><span class="d" style="background:var(--faint)"></span>'+s[1]+'</div>';}).join('');
    menu.innerHTML=srcBtns+biz+sec;
    menu.querySelectorAll('[data-src]').forEach(function(el){el.onclick=function(){DS.source=el.dataset.src;DS.brand='group';DS.section='overview';renderDashMenu();renderDashBody();};});
    menu.querySelectorAll('[data-brand]').forEach(function(el){el.onclick=function(){DS.brand=el.dataset.brand;var av=sectionsFor().map(function(x){return x[0];});if(av.indexOf(DS.section)<0)DS.section=(av[0]||'overview');renderDashMenu();renderDashBody();};});
    menu.querySelectorAll('[data-sec]').forEach(function(el){el.onclick=function(){DS.section=el.dataset.sec;renderDashMenu();renderDashBody();};});
  }

  function head(title,sub){
    return '<div class="dk-head"><h2>'+title+'</h2><span class="dk-badge">'+brandName()+'</span><span class="dk-badge" style="color:var(--muted);background:var(--panel2)">Source: '+SRC[DS.source].label+'</span></div><p class="dk-sub">'+(sub||'')+'</p>';
  }
  function emptyBrand(ws,title,msg){ ws.innerHTML='<div class="dk-empty"><div class="i">◔</div><h3>'+title+'</h3><p>'+msg+'</p></div>'; }

  function renderDashBody(){
    var ws=document.getElementById('workspace'); if(!ws)return; ws.className='right dk';
    document.documentElement.style.setProperty('--accent', brandColor());
    if(DS.source==='eiq'){
      if(DS.brand==='group'){ renderEiqGroup(ws); return; }
      if(!EIQ[DS.brand]){ emptyBrand(ws, brandName()+' — no EiQ data', 'This tenant’s connector hasn’t been pulled into this view. Ask me to “refresh my dashboard from EIQ” for this tenant.'); return; }
      renderEiqBrand(ws, DS.brand, DS.section); return;
    }
    if(DS.brand==='group'){ renderEpGroup(ws); return; }
    if(!BR[DS.brand]||BR[DS.brand].empty){ emptyBrand(ws,brandName()+' — no data','No EP v1 data source connected for this brand yet.'); return; }
    renderEpBrand(ws, DS.section);
  }

  /* =================== EiQ — Group =================== */
  function renderEiqGroup(ws){
    if(!EIQGROUP||!EIQGROUP.brands||!EIQGROUP.brands.length){ emptyBrand(ws,'Group roll-up not built','Pull at least one tenant’s EiQ data, then I’ll consolidate them here.'); return; }
    var g=EIQGROUP, top=g.brands.slice().sort(function(a,b){return b[2]-a[2];})[0];
    ws.innerHTML=head('Group Overview','Consolidated across every tenant whose EiQ connector is live. Money is settled AUD (customer-analytics lifetime).')+
      '<div class="dk-note">Connector-driven: this rolls up the '+g.brands.length+' tenant(s) currently returning EiQ data. Finance, pipeline, subscriptions and royalties vary by tenant — see each brand.</div>'+
      '<div class="dk-kpis">'+
        kpi('Lifetime revenue (settled)',money(g.totalLtv),g.brands.length+' live tenant(s)',1)+
        kpi('Customers',num(g.totalCust))+
        kpi('Biggest tenant',top[1],money(top[2])+' · '+(top[2]/g.totalLtv*100).toFixed(0)+'%')+
        kpi('Avg lifetime / customer',money(g.totalLtv/g.totalCust))+
      '</div>'+
      '<div class="dk-g2">'+
        '<div class="dk-card"><h3>Lifetime revenue by tenant</h3><div class="hint">Settled AUD</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
        '<div class="dk-card"><h3>Customers by tenant</h3><div class="hint">Unique paying + registered</div><div class="dk-cw t"><canvas id="dc2"></canvas></div></div>'+
      '</div>';
    var A=axes(), L=g.brands.map(function(x){return x[1];}), C=g.brands.map(function(x){return x[4];});
    chart('dc1',{type:'bar',data:{labels:L,datasets:[{data:g.brands.map(function(x){return x[2];}),backgroundColor:C,borderRadius:5}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.raw);}}}},scales:{y:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:A.no}}});
    chart('dc2',{type:'bar',data:{labels:L,datasets:[{data:g.brands.map(function(x){return x[3];}),backgroundColor:C,borderRadius:5}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return num(c.raw)+' customers';}}}},scales:{y:A.grid,x:A.no}}});
  }

  /* =================== EiQ — per tenant =================== */
  function repeatShare(c){ var t=c.nvr.rt.reduce(function(a,b){return a+b;},0), n=c.nvr.nw.reduce(function(a,b){return a+b;},0); return t+n>0?Math.round(100*t/(t+n)):0; }
  function lastMoKpi(d){ return d.rev.lastMonth>0 ? kpi('Revenue — last month',money(d.rev.lastMonth),d.rev.lastMonthOrders+' orders') : kpi('Orders — last month',num(d.rev.lastMonthOrders),'AUD value pending FX sync'); }
  function renderEiqBrand(ws,brand,s){
    var d=EIQ[brand], c=d.cust, A;
    if(s==='overview'){
      var k1 = (d.has&&d.has.finance) ? (d.rev.fyNet<0?kpiNeg('Net profit (FY)','-'+money(-d.rev.fyNet)):kpi('Net profit (FY)',money(d.rev.fyNet))) : lastMoKpi(d);
      ws.innerHTML=head('Overview','Headline numbers for this tenant, from its EiQ connector.')+
        '<div class="dk-kpis">'+
          ((d.has&&d.has.finance)?kpi('Revenue (FY)',money(d.rev.fyRev),'P&L, all GL',1):kpi('Revenue — YTD',money(d.rev.ytd),d.rev.ytdOrders+' orders',1))+
          k1+ kpi('Customers',num(c.total),money(c.avgLtv)+' avg LTV')+ kpi('Lifetime revenue',money(c.totalLtv))+
          ((d.has&&d.has.subs)?kpi('Active subscriptions',num(d.subs.active),money(d.subs.mrr)+' '+d.subs.ccy+' MRR'):kpi('Repeat buyers',(100-c.oneOffPct)+'%',num(c.total-c.oneOff)+' of '+num(c.total)))+
          ((d.has&&d.has.pipeline)?kpi('Open pipeline',money(d.pipeline.openValue),d.pipeline.openCount+' deals'):((d.has&&d.has.royalties)?kpi('Royalty sales',money(d.roy.gross),num(d.roy.units)+' units'):kpi('One-off buyers',c.oneOffPct+'%')))+
        '</div>'+
        '<div class="dk-g2">'+
          '<div class="dk-card"><h3>New customers won per year</h3><div class="hint">First paid order, by year</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
          '<div class="dk-card"><h3>Revenue: new vs returning</h3><div class="hint">Settled AUD, by year</div><div class="dk-cw t"><canvas id="dc2"></canvas></div></div>'+
        '</div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:c.newByYear.l,datasets:[{data:c.newByYear.v,backgroundColor:d.color,borderRadius:4}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return num(x.raw)+' new';}}}},scales:{y:A.grid,x:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{maxTicksLimit:8})})}}});
      chart('dc2',{type:'bar',data:{labels:c.nvr.l,datasets:[{label:'New',data:c.nvr.nw,backgroundColor:'#0d9488',borderRadius:3,stack:'a'},{label:'Returning',data:c.nvr.rt,backgroundColor:d.color,borderRadius:3,stack:'a'}]},options:{plugins:{legend:{position:'top',labels:{color:tc().m}},tooltip:{callbacks:{label:function(x){return x.dataset.label+': '+money(x.raw);}}}},scales:{y:Object.assign({},A.grid,{stacked:true,ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:Object.assign({},A.no,{stacked:true,ticks:Object.assign({},A.no.ticks,{maxTicksLimit:8})})}}});
    }
    else if(s==='sales'){
      ws.innerHTML=head('Sales & Revenue','Revenue trend and the new-vs-returning split from EiQ orders.')+
        '<div class="dk-kpis">'+
          kpi('Revenue — YTD',money(d.rev.ytd),d.rev.ytdOrders+' orders',1)+ lastMoKpi(d)+
          ((d.has&&d.has.finance)?kpi('Revenue (FY P&L)',money(d.rev.fyRev)):kpi('Lifetime revenue',money(c.totalLtv)))+
          ((d.has&&d.has.finance)?(d.rev.fyNet<0?kpiNeg('Net profit (FY)','-'+money(-d.rev.fyNet)):kpi('Net profit (FY)',money(d.rev.fyNet))):kpi('Avg lifetime value',money(c.avgLtv)))+
          kpi('Repeat-buyer revenue share', repeatShare(c)+'%')+
        '</div>'+
        '<div class="dk-card"><h3>Revenue: new vs returning customers</h3><div class="hint">Settled AUD, by year</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
        '<div class="dk-card"><h3>Orders per customer</h3><div class="hint">How many buy more than once</div><div class="dk-cw"><canvas id="dc2"></canvas></div></div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:c.nvr.l,datasets:[{label:'New',data:c.nvr.nw,backgroundColor:'#0d9488',borderRadius:3,stack:'a'},{label:'Returning',data:c.nvr.rt,backgroundColor:d.color,borderRadius:3,stack:'a'}]},options:{plugins:{legend:{position:'top',labels:{color:tc().m}},tooltip:{callbacks:{label:function(x){return x.dataset.label+': '+money(x.raw);}}}},scales:{y:Object.assign({},A.grid,{stacked:true,ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:Object.assign({},A.no,{stacked:true,ticks:Object.assign({},A.no.ticks,{maxTicksLimit:9})})}}});
      chart('dc2',{type:'bar',data:{labels:c.ordBuckets.l,datasets:[{data:c.ordBuckets.v,backgroundColor:d.color,borderRadius:4}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return num(x.raw)+' customers';}}}},scales:{y:A.grid,x:A.no}}});
    }
    else if(s==='customers'){
      var top=c.top[0], share=(top[2]/c.totalLtv*100);
      ws.innerHTML=head('Customers & LTV','Lifetime value across this tenant (settled AUD, completed orders).')+
        '<div class="dk-kpis">'+
          kpi('Customers',num(c.total),null,1)+ kpi('Avg lifetime value',money(c.avgLtv))+
          kpi('Top customer share',share.toFixed(0)+'%',top[0].split(' ')[0]+' · '+money(top[2]))+
          kpi('One-off buyers',c.oneOffPct+'%',num(c.oneOff)+' of '+num(c.total))+
          kpi('$1,000+ customers',num(c.ltvBuckets.v[6]))+
        '</div>'+
        (share>=35?'<div class="dk-note dk-warn"><b>'+top[0]+' is '+share.toFixed(0)+'% of this tenant’s lifetime value</b> ('+money(top[2])+'). Heavy single-customer concentration.</div>':'')+
        '<div class="dk-g2">'+
          '<div class="dk-card"><h3>Customers by lifetime value</h3><div class="hint">Count per LTV band</div><div class="dk-cw"><canvas id="dc1"></canvas></div></div>'+
          '<div class="dk-card"><h3>Orders per customer</h3><div class="hint">Repeat behaviour</div><div class="dk-cw"><canvas id="dc2"></canvas></div></div>'+
        '</div>'+
        '<div class="dk-card"><h3>Top customers by lifetime spend</h3><div class="hint">Completed orders, settled AUD</div><table><thead><tr><th>Customer</th><th class="n">Orders</th><th class="n">Lifetime</th></tr></thead><tbody>'+
          c.top.map(function(x){return '<tr><td>'+x[0]+'</td><td class="n">'+num(x[1])+'</td><td class="n">'+money(x[2])+'</td></tr>';}).join('')+'</tbody></table></div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:c.ltvBuckets.l,datasets:[{data:c.ltvBuckets.v,backgroundColor:d.color,borderRadius:4}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return num(x.raw)+' customers';}}}},scales:{y:A.grid,x:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{font:{size:10}})})}}});
      chart('dc2',{type:'bar',data:{labels:c.ordBuckets.l,datasets:[{data:c.ordBuckets.v,backgroundColor:'#0d9488',borderRadius:4}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return num(x.raw)+' customers';}}}},scales:{y:A.grid,x:A.no}}});
    }
    else if(s==='marketing'){ renderTraffic(ws, brand); }
    else if(s==='royalties'){
      var r=d.roy, plat=r.platforms.slice().sort(function(a,b){return b[1]-a[1];}), top=plat[0];
      ws.innerHTML=head('Royalties & Books','Book royalty sales across every distribution platform.')+
        '<div class="dk-kpis">'+kpi('Gross royalty sales',money(r.gross),num(r.txns)+' transactions',1)+kpi('Units sold',num(r.units))+kpi('Author royalties',money(r.supplier))+kpi('Royalty payments',money(r.payTotal),r.payCount+' runs')+kpi('Platforms',plat.length+'')+'</div>'+
        '<div class="dk-note">Top platform: <b>'+top[0]+'</b> — '+money(top[1])+' gross ('+(top[1]/r.gross*100).toFixed(0)+'% of the total) and '+num(top[2])+' units.</div>'+
        '<div class="dk-g2">'+
          '<div class="dk-card"><h3>Gross sales by platform</h3><div class="hint">All-time</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
          '<div class="dk-card"><h3>Units by platform</h3><div class="hint">All-time</div><div class="dk-cw t"><canvas id="dc2"></canvas></div></div>'+
        '</div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:plat.map(function(x){return x[0];}),datasets:[{data:plat.map(function(x){return x[1];}),backgroundColor:d.color,borderRadius:4}]},options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return money(x.raw);}}}},scales:{x:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),y:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{font:{size:10}})})}}});
      chart('dc2',{type:'bar',data:{labels:plat.map(function(x){return x[0];}),datasets:[{data:plat.map(function(x){return x[2];}),backgroundColor:'#0d9488',borderRadius:4}]},options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return num(x.raw)+' units';}}}},scales:{x:A.grid,y:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{font:{size:10}})})}}});
    }
    else if(s==='finance'){
      var f=d.finance;
      ws.innerHTML=head('Finance & P&L','Profit & loss from Evolve Accounts (QuickBooks-synced), by GL account.')+
        '<div class="dk-kpis">'+
          kpi('Revenue (FY)',money(d.rev.fyRev),null,1)+ kpi('Expenses (FY)',money(d.rev.fyExp))+
          (d.rev.fyNet<0?kpiNeg('Net profit','-'+money(-d.rev.fyNet)):kpi('Net profit',money(d.rev.fyNet)))+
          (f.ar!=null?kpi('AR outstanding',money(f.ar),f.arCount+' invoices'):kpi('Top revenue line',f.revTop[0][0],money(f.revTop[0][1])))+
        '</div>'+
        '<div class="dk-g2">'+
          '<div class="dk-card"><h3>Revenue by account</h3><div class="hint">Top GL revenue lines</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
          '<div class="dk-card"><h3>Expenses by account</h3><div class="hint">Top GL expense lines</div><div class="dk-cw t"><canvas id="dc2"></canvas></div></div>'+
        '</div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:f.revTop.map(function(x){return x[0];}),datasets:[{data:f.revTop.map(function(x){return x[1];}),backgroundColor:d.color,borderRadius:4}]},options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return money(x.raw);}}}},scales:{x:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),y:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{font:{size:10}})})}}});
      chart('dc2',{type:'bar',data:{labels:f.expTop.map(function(x){return x[0];}),datasets:[{data:f.expTop.map(function(x){return x[1];}),backgroundColor:'#e11d48',borderRadius:4}]},options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return money(x.raw);}}}},scales:{x:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),y:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{font:{size:10}})})}}});
    }
    else if(s==='pipeline'){
      var dl=d.pipeline, scol={Won:'#0d9488',Lost:'#e11d48',Proposal:'#0284c7',Qualified:'#d97706',Negotiation:'#7c3aed'};
      ws.innerHTML=head('Sales Pipeline','Deals from the EIQ CRM — closed and live.')+
        '<div class="dk-kpis">'+kpi('Total deals',num(dl.total),money(dl.pipelineValue)+' lifetime',1)+kpi('Won',money(dl.wonValue))+kpi('Open pipeline',money(dl.openValue),dl.openCount+' live')+kpi('Win rate',dl.winRateVal+'%','by value')+kpi('Lost',money(dl.lostValue))+'</div>'+
        '<div class="dk-card"><h3>Value by stage</h3><div class="hint">Deal value, all stages</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:dl.stages.map(function(x){return x[0];}),datasets:[{data:dl.stages.map(function(x){return x[2];}),backgroundColor:dl.stages.map(function(x){return scol[x[0]]||'#6d28d9';}),borderRadius:4}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return money(x.raw)+' · '+dl.stages[x.dataIndex][1]+' deals';}}}},scales:{y:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:A.no}}});
    }
    else if(s==='subs'){
      var su=d.subs;
      ws.innerHTML=head('Subscriptions','Recurring revenue health from the EIQ platform.')+
        '<div class="dk-kpis">'+kpi('Active subscriptions',num(su.active),null,1)+kpi('MRR',money(su.mrr)+' '+su.ccy)+kpi('Annual run-rate',money(su.mrr*12)+' '+su.ccy)+kpi('30-day churn',su.churn+'%')+kpi('Avg MRR / sub',money(su.mrr/su.active)+' '+su.ccy)+'</div>'+
        (su.note?'<div class="dk-note dk-warn">'+su.note+'</div>':'')+
        '<div class="dk-card"><h3>Recurring vs one-off revenue</h3><div class="hint">Annual subscription run-rate against P&L revenue</div><div class="dk-cw"><canvas id="dc1"></canvas></div></div>';
      var rr=su.mrr*12*(su.ccy==='USD'?1.5:1), rest=Math.max(0,(d.rev.fyRev||rr*2)-rr);
      chart('dc1',{type:'doughnut',data:{labels:['Subscription run-rate','Other revenue'],datasets:[{data:[Math.round(rr),Math.round(rest)],backgroundColor:[d.color,'#e2e8f0'],borderWidth:0}]},options:{plugins:{legend:{position:'right',labels:{color:tc().m}},tooltip:{callbacks:{label:function(x){return x.label+': '+money(x.raw);}}}},cutout:'62%'}});
    }
  }

  /* shared traffic renderer (EIQ Analytics) */
  function renderTraffic(ws,brand){
    var t=TR[brand];
    if(!t){ emptyBrand(ws,'No traffic synced','This tenant has no EIQ Analytics data in this view yet.'); return; }
    ws.innerHTML=head('Marketing & Traffic','Website traffic from EIQ Analytics (the platform’s Matomo store).')+
      '<div class="dk-note"><b>Source: EIQ Analytics</b> · last 365 days · bots excluded.'+(t.note?' '+t.note:'')+'</div>'+
      '<div class="dk-kpis">'+
        kpi('Website visits — 12 mo',num(t.visits),num(t.unique)+' unique',1)+
        kpi('Bounce rate',t.bounce+'%','avg visit '+t.dur+'s')+
        kpi('Returning visitors',num(t.ret),(100*t.ret/t.visits).toFixed(0)+'% of traffic')+
        kpi('Top channel',t.ch[0][0],num(t.ch[0][1])+' visits')+
        (t.extra?kpi(t.extra[0],t.extra[1]):'')+
      '</div>'+
      (t.quality?'<div class="dk-note dk-warn">'+t.quality+'</div>':'')+
      '<div class="dk-g2">'+
        '<div class="dk-card"><h3>Traffic by channel</h3><div class="hint">Visits, last 365 days</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
        '<div class="dk-card"><h3>Top pages / sites</h3><div class="hint">Visits, last 365 days</div><div class="dk-cw t"><canvas id="dc2"></canvas></div></div>'+
      '</div>';
    var A=axes();
    chart('dc1',{type:'bar',data:{labels:t.ch.map(function(c){return c[0];}),datasets:[{data:t.ch.map(function(c){return c[1];}),backgroundColor:['#94a3b8','#0d9488','#6d28d9','#0284c7','#d97706'],borderRadius:4}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return num(c.raw)+' visits';}}}},scales:{y:A.grid,x:A.no}}});
    chart('dc2',{type:'bar',data:{labels:t.pages.map(function(p){return p[0];}),datasets:[{data:t.pages.map(function(p){return p[1];}),backgroundColor:'#0284c7',borderRadius:4}]},options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return num(c.raw)+' visits';}}}},scales:{x:A.grid,y:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{font:{size:10}})})}}});
  }

  /* =================== EP v1 (optional legacy source) =================== */
  function renderEpGroup(ws){
    ws.innerHTML=head('Group Overview','All connected EP v1 brands, consolidated.')+
      '<div class="dk-kpis">'+
        kpi('Group revenue (lifetime)',money(GROUP.rev),GROUP.labels.length+' brands',1)+
        kpi('Paid orders',num(GROUP.orders))+ kpi('Paying customers',num(GROUP.cust))+
        kpi('Registered members',num(GROUP.members))+ kpi('Web visits — 12 mo',num(GROUP.visits))+
        kpi('Revenue — last 12 mo',money(GROUP.rev12))+
      '</div>'+
      '<div class="dk-g2">'+
        '<div class="dk-card"><h3>Lifetime revenue by brand</h3><div class="hint">Paid orders, all-time</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
        '<div class="dk-card"><h3>Web visits by brand</h3><div class="hint">Last 365 days</div><div class="dk-cw t"><canvas id="dc2"></canvas></div></div>'+
      '</div>';
    var A=axes();
    chart('dc1',{type:'bar',data:{labels:GROUP.labels,datasets:[{data:GROUP.revLife,backgroundColor:GROUP.colors,borderRadius:5}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.raw);}}}},scales:{y:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:A.no}}});
    chart('dc2',{type:'bar',data:{labels:GROUP.labels,datasets:[{data:GROUP.visits12,backgroundColor:GROUP.colors,borderRadius:5}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return num(c.raw)+' visits';}}}},scales:{y:A.grid,x:A.no}}});
  }
  function renderEpBrand(ws,id){
    var b=BR[DS.brand], A;
    if(id==='overview'){
      ws.innerHTML=head('Overview','Headline numbers for this brand.')+
        '<div class="dk-kpis">'+
          kpi('Lifetime paid revenue',money(b.k.rev),num(b.k.orders)+' paid orders',1)+
          kpi('Paying customers',num(b.k.cust),'AOV '+money(b.k.rev/b.k.orders))+
          kpi('Registered members',num(b.k.members),num(b.k.new12)+' new in 12 mo')+
          kpi('Revenue — last 12 mo',money(b.k.rev12))+ kpi('Course enrolments',num(b.k.enrol),b.k.courses+' courses')+
          (b.k.books?kpi('Books in store',num(b.k.books)):kpi('Recurring revenue',money(b.k.recur)))+
        '</div>'+
        '<div class="dk-g2">'+
          '<div class="dk-card"><h3>Annual paid revenue</h3><div class="hint">By calendar year</div><div class="dk-cw"><canvas id="dc1"></canvas></div></div>'+
          '<div class="dk-card"><h3>Monthly revenue</h3><div class="hint">Paid orders, recent months</div><div class="dk-cw"><canvas id="dc2"></canvas></div></div>'+
        '</div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:b.annual.l,datasets:[{data:b.annual.v,backgroundColor:b.color,borderRadius:5}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.raw);}}}},scales:{y:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:A.no}}});
      chart('dc2',{type:'line',data:{labels:b.monthly.l,datasets:[{data:b.monthly.v,borderColor:b.color,backgroundColor:'transparent',tension:.3,pointRadius:0,borderWidth:2}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.raw);}}}},scales:{y:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{maxTicksLimit:8})})}}});
    }
    else if(id==='sales'){
      ws.innerHTML=head('Sales & Revenue','Revenue, orders and the products driving them.')+
        '<div class="dk-kpis">'+kpi('Lifetime paid revenue',money(b.k.rev),null,1)+kpi('Revenue — last 12 mo',money(b.k.rev12))+kpi('Recurring revenue',money(b.k.recur))+kpi('Paid orders',num(b.k.orders))+kpi('Avg order value',money(b.k.rev/b.k.orders))+'</div>'+
        '<div class="dk-card"><h3>Monthly revenue</h3><div class="hint">Paid orders</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
        (b.products?'<div class="dk-card"><h3>Top products by revenue</h3><div class="hint">All-time, paid orders</div><table><thead><tr><th>Product</th><th class="n">Orders</th><th class="n">Revenue</th></tr></thead><tbody>'+b.products.map(function(p){return '<tr><td>'+p[0]+'</td><td class="n">'+num(p[1])+'</td><td class="n">'+money(p[2])+'</td></tr>';}).join('')+'</tbody></table></div>':'');
      A=axes();
      chart('dc1',{type:'bar',data:{labels:b.monthly.l,datasets:[{data:b.monthly.v,backgroundColor:b.color,borderRadius:3}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.raw);}}}},scales:{y:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:Object.assign({},A.no,{ticks:Object.assign({},A.no.ticks,{maxTicksLimit:9})})}}});
    }
    else if(id==='members'){
      ws.innerHTML=head('Members & Courses','Registered members, courses and enrolments.')+
        '<div class="dk-kpis">'+kpi('Registered members',num(b.k.members),null,1)+kpi('New members — 12 mo',num(b.k.new12))+kpi('Courses',num(b.k.courses))+kpi('Enrolments',num(b.k.enrol))+kpi('Enrolments / member',(b.k.enrol/b.k.members).toFixed(2))+'</div>'+
        '<div class="dk-card"><h3>Audience &amp; learning</h3><div class="hint">Members, enrolments and courses (log scale)</div><div class="dk-cw"><canvas id="dc1"></canvas></div></div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:['Members','Enrolments','Courses'],datasets:[{data:[b.k.members,b.k.enrol,b.k.courses],backgroundColor:[b.color,'#0d9488','#d97706'],borderRadius:5}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return num(c.raw);}}}},scales:{y:Object.assign({},A.grid,{type:'logarithmic'}),x:A.no}}});
    }
    else if(id==='customers'){
      var top=b.customers[0], share=(top[3]/b.k.rev*100), t8=b.customers.reduce(function(a,c){return a+c[3];},0)/b.k.rev*100;
      ws.innerHTML=head('Top Customers','Who spends the most on this brand.')+
        '<div class="dk-kpis">'+kpi('Top customer',top[0].split(' ')[0]+'…',money(top[3]),1)+kpi("Top customer's share",share.toFixed(1)+'%')+kpi('Top 8 share',t8.toFixed(0)+'%')+kpi('Paying customers',num(b.k.cust))+kpi('Avg lifetime value',money(b.k.rev/b.k.cust))+'</div>'+
        '<div class="dk-card"><h3>Top customers by lifetime spend</h3><div class="hint">Paid orders only</div><table><thead><tr><th>Customer</th><th>Country</th><th class="n">Orders</th><th class="n">Lifetime spend</th></tr></thead><tbody>'+
          b.customers.map(function(c){return '<tr><td>'+c[0]+'</td><td>'+c[1]+'</td><td class="n">'+num(c[2])+'</td><td class="n">'+money(c[3])+'</td></tr>';}).join('')+'</tbody></table></div>';
    }
    else if(id==='marketing'){ renderTraffic(ws, DS.brand); }
    else if(id==='royalties' && ESGX){
      ws.innerHTML=head('Royalties & Books','Book royalty sales across platforms.')+
        '<div class="dk-g2">'+
          '<div class="dk-card"><h3>Gross royalty sales by year</h3><div class="hint">All platforms</div><div class="dk-cw t"><canvas id="dc1"></canvas></div></div>'+
          '<div class="dk-card"><h3>Sales by platform</h3><div class="hint">All-time</div><div class="dk-cw t"><canvas id="dc2"></canvas></div></div>'+
        '</div>';
      A=axes();
      chart('dc1',{type:'bar',data:{labels:ESGX.royYear.l,datasets:[{data:ESGX.royYear.v,backgroundColor:'#6d28d9',borderRadius:4}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.raw);}}}},scales:{y:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),x:A.no}}});
      chart('dc2',{type:'bar',data:{labels:ESGX.platform.map(function(p){return p[0];}),datasets:[{data:ESGX.platform.map(function(p){return p[1];}),backgroundColor:'#0d9488',borderRadius:4}]},options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.raw);}}}},scales:{x:Object.assign({},A.grid,{ticks:Object.assign({},A.grid.ticks,{callback:moneyK})}),y:A.no}}});
    }
  }

  /* ---- expose + tab wiring ---- */
  window.renderDash=function(){
    var ws=document.getElementById('workspace'); if(!ws)return; ws.className='right dk';
    if(!DS.source){ ws.innerHTML='<div class="dk-empty"><div class="i">◔</div><h3>Dashboard not built yet</h3><p>This console has no dashboard data loaded. Ask me to <b>“refresh my dashboard from EIQ”</b> and I’ll pull your live numbers (revenue, customers, finance, pipeline, royalties and traffic) from whichever connectors are attached, then rebuild this tab.</p></div>'; var m=document.getElementById('menu'); if(m)m.innerHTML=''; return; }
    renderDashMenu(); renderDashBody();
  };
  /* tab routing is handled by the console shell, which calls window.renderDash() on the dash tab. */
})();
