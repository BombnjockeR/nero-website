/* ROOT: relative prefix so links work at any depth */
const ROOT = (function(){
  var s=document.querySelector('script[src*="js/app.js"]');
  return s ? s.getAttribute('src').replace(/js\/app\.js$/,'') : '';
})();

/* ================= ACCOUNT CHIP ================= */
function initials(n){ return (n||'A').trim().charAt(0).toUpperCase(); }
function renderAcct(){
  var el=document.getElementById('hd-acct'); if(!el) return;
  if(Auth.loggedIn){
    var n=Auth.user()||'Adventurer';
    el.innerHTML='<div class="acct-chip" onclick="openPanel(\'account\')">'+
      '<div class="acct-av">'+initials(n)+'</div><span class="acct-nm">'+n+'</span></div>';
  } else {
    el.innerHTML='<button class="btn-login" onclick="openPanel(\'login\')"><i class="ti ti-login"></i> Login</button>';
  }
}

/* ================= SLIDE PANEL ================= */
var panel=document.getElementById('panel');
var backdrop=document.getElementById('backdrop');
var ICONS={server:'ti-scroll',download:'ti-download',marketplace:'ti-scale',donation:'ti-heart',
           login:'ti-login',register:'ti-user-plus',account:'ti-user-circle'};
var TITLES={server:'Server Detail',download:'Download',donation:'Donation',
            login:'Login',register:'Create Account',account:'My Account'};

function openPanel(type){
  if(type==='marketplace'){ location.href=ROOT+'pages/marketplace.html'; return; }
  if(type==='login' && Auth.loggedIn) type='account';
  if(type==='donation' && !Auth.loggedIn) type='login';
  if(!panel){ location.href=ROOT+'index.html'; return; }
  document.getElementById('pnl-icon').className='ti '+ICONS[type];
  document.getElementById('pnl-title').textContent=TITLES[type];
  document.getElementById('pnl-body').innerHTML=render(type);
  if(type==='donation') selAmt=null;
  panel.classList.add('show'); backdrop.classList.add('show');
}
function closePanel(){ if(panel){panel.classList.remove('show');backdrop.classList.remove('show');} }
function render(t){
  if(t==='login')    return loginHTML();
  if(t==='register') return registerHTML();
  if(t==='account')  return accountHTML();
  if(t==='download') return downloadHTML();
  if(t==='server')   return serverHTML();
  if(t==='donation') return donationHTML();
  return '';
}

/* ---- Login / Register / Account ---- */
function loginHTML(){ return `
  <p class="lead">Sign in to your NeRO account to donate, trade, and track your progress.</p>
  <label class="fld">Account ID</label><input class="inp" id="login-id" placeholder="yourname">
  <label class="fld">Password</label><input class="inp" id="login-pw" type="password" placeholder="••••••••">
  <button class="btn-gold" onclick="doLogin()">Login</button>
  <div class="rowlinks"><a href="#" onclick="return false">Forgot password?</a>
  <a href="#" onclick="openPanel('register');return false">Register</a></div>`;
}
function doLogin(){
  var id=(document.getElementById('login-id').value||'').trim()||'Adventurer';
  Auth.loggedIn=true; Auth.setUser(id); renderAcct(); openPanel('account');
}
function registerHTML(){ return `
  <p class="lead">Create a new NeRO account. It's free.</p>
  <label class="fld">Account ID</label><input class="inp" placeholder="choose an ID">
  <label class="fld">Email</label><input class="inp" type="email" placeholder="name@email.com">
  <label class="fld">Password</label><input class="inp" type="password" placeholder="••••••••">
  <label class="fld">Confirm Password</label><input class="inp" type="password" placeholder="••••••••">
  <button class="btn-gold" onclick="alert('Registration needs the backend (demo)')">Create Account</button>
  <div class="rowlinks"><span></span><a href="#" onclick="openPanel('login');return false">Already have an account?</a></div>`;
}
function accountHTML(){
  var n=Auth.user()||'Adventurer';
  return `
  <div class="prof-hero"><div class="prof-av">${initials(n)}</div>
    <div><div class="prof-nm">${n}</div><div class="prof-sub">Member since 2026</div></div></div>
  <div class="kv"><span>Cash Point</span><span>1,250,000 CP</span></div>
  <div class="kv"><span>Characters</span><span>3</span></div>
  <div class="kv"><span>Guild</span><span>Valhalla</span></div>
  <div class="kv"><span>Status</span><span style="color:#46d17f">Online</span></div>
  <button class="btn-gold" onclick="openPanel('donation')">Donate / Top Up</button>
  <a class="btn-ghost" href="${ROOT}pages/marketplace.html">My Marketplace Listings</a>
  <button class="btn-ghost" onclick="doLogout()">Log Out</button>
  <p class="lead" style="margin-top:16px;font-size:12px">Profile data is placeholder until the backend is connected.</p>`;
}
function doLogout(){ Auth.logout(); renderAcct(); closePanel(); }

/* ---- Download ---- */
function downloadHTML(){ return `
  <p class="lead">Download the NeRO game client and patcher to begin your adventure.</p>
  <div class="kv"><span>Client size</span><span>~3.5 GB</span></div>
  <div class="kv"><span>Patch</span><span>Auto (on launch)</span></div>
  <div class="kv"><span>OS</span><span>Windows 10 / 11</span></div>
  <a class="btn-gold" href="#" onclick="alert('Google Drive link coming soon');return false">Download Full Client</a>
  <a class="btn-ghost" href="#" onclick="return false">Manual Patch (mirror)</a>`;
}

/* ---- Server detail ---- */
function serverHTML(){ var s=SERVER_INFO; return `
  <p class="lead">Core settings of New Era Ragnarok Online — NeRO.</p>
  <div class="kv"><span>Base Rate</span><span>${s.base}</span></div>
  <div class="kv"><span>Job Rate</span><span>${s.job}</span></div>
  <div class="kv"><span>Drop Rate</span><span>${s.drop}</span></div>
  <div class="kv"><span>Max Base Level</span><span>${s.maxbase}</span></div>
  <div class="kv"><span>Max Job Level</span><span>${s.maxjob}</span></div>
  <div class="kv"><span>Episode</span><span>${s.episode}</span></div>
  <label class="fld" style="margin-top:22px">Statistics</label>
  <div class="statbtns">
    <a class="statbtn" href="${ROOT}pages/stat-woe.html"><i class="ti ti-swords"></i>WoE</a>
    <a class="statbtn" href="${ROOT}pages/stat-pvp.html"><i class="ti ti-skull"></i>PvP</a>
    <a class="statbtn" href="${ROOT}pages/stat-mvp.html"><i class="ti ti-crown"></i>MVP</a>
    <a class="statbtn" href="${ROOT}pages/stat-zeny.html"><i class="ti ti-coins"></i>Zeny</a>
  </div>
  <a class="btn-ghost" href="${ROOT}wiki/index.html" style="margin-top:16px">Open Full Wiki</a>`;
}

/* ---- Donation (1 CP : 1 Rp) ---- */
var selAmt=null;
function donationHTML(){
  var amts=DONATE_AMOUNTS.map(function(a,i){
    return '<div class="amt" data-i="'+i+'" onclick="pickAmt('+i+')">'+
      '<div class="cp">'+fmtNum(a.cp)+' CP</div><div class="lbl">'+fmtRp(a.cp)+'</div></div>';}).join('');
  var st=STREAMERS.map(function(s){return '<option>'+s+'</option>';}).join('');
  var gd=GUILDS.map(function(g){return '<option>'+g+'</option>';}).join('');
  return `
  <p class="lead">Support NeRO and receive Cash Points. Logged in as <b style="color:var(--gold)">${Auth.user()||'Adventurer'}</b>.</p>
  <label class="fld">Choose amount</label><div class="amt-grid">${amts}</div>
  <label class="fld">Support a streamer</label>
  <select class="inp" id="don-streamer" onchange="updateSummary()"><option value="">— None —</option>${st}</select>
  <div class="hintline">Get 10% bonus by choosing the streamer you want to support.</div>
  <label class="fld">Support your guild</label>
  <select class="inp" id="don-guild" onchange="updateSummary()"><option value="">— None —</option>${gd}</select>
  <div class="hintline">Support your guild leader by mentioning your guild.</div>
  <div class="summary" id="don-summary">Select an amount to see your total.</div>
  <button class="btn-gold" onclick="alert('Payment gateway needs the backend (demo)')">Proceed to Payment</button>`;
}
function pickAmt(i){ selAmt=i;
  document.querySelectorAll('.amt').forEach(function(e){e.classList.toggle('sel',+e.dataset.i===i);});
  updateSummary();
}
function updateSummary(){
  var box=document.getElementById('don-summary'); if(!box) return;
  if(selAmt===null){ box.innerHTML='Select an amount to see your total.'; return; }
  var cp=DONATE_AMOUNTS[selAmt].cp;
  var streamer=document.getElementById('don-streamer').value;
  var guild=document.getElementById('don-guild').value;
  var bonus=streamer?Math.round(cp*0.10):0;
  box.innerHTML='Base: <b>'+fmtNum(cp)+' CP</b><br>'+
    (streamer?'Streamer bonus (+10%): <b>+'+fmtNum(bonus)+' CP</b> → '+streamer+'<br>':'')+
    (guild?'Guild: <b>'+guild+'</b><br>':'')+
    '<hr style="border:none;border-top:1px solid rgba(228,184,75,.3);margin:8px 0">'+
    'You receive: <b>'+fmtNum(cp+bonus)+' CP</b><br>You pay: <b>'+fmtRp(cp)+'</b>';
}

/* ================= TABLE / GRID SEARCH ================= */
function filterTable(){
  var q=(document.getElementById('tblsearch').value||'').toLowerCase();
  var tbl=document.getElementById('stbl'); if(!tbl) return;
  var rows=tbl.tBodies[0].rows, shown=0;
  for(var i=0;i<rows.length;i++){
    if(rows[i].classList.contains('norow-row')) continue;
    var hit=rows[i].textContent.toLowerCase().indexOf(q)>-1;
    rows[i].style.display=hit?'':'none'; if(hit)shown++;
  }
  var hits=document.getElementById('hits');
  if(hits) hits.textContent=q?shown+' result'+(shown===1?'':'s'):'';
  var empty=tbl.querySelector('.norow-row');
  if(shown===0){
    if(!empty){ var r=tbl.tBodies[0].insertRow(); r.className='norow-row';
      var c=r.insertCell(); c.colSpan=tbl.rows[0].cells.length; c.className='norow'; c.textContent='No results found.'; }
  } else if(empty){ empty.remove(); }
}
var curF='all';
function setFilter(f,el){ curF=f;
  document.querySelectorAll('.toggle button').forEach(function(b){b.classList.remove('on');});
  el.classList.add('on'); filterItems();
}
function filterItems(){
  var qEl=document.getElementById('mkt-q'); if(!qEl) return;
  var q=(qEl.value||'').toLowerCase();
  document.querySelectorAll('.card-item').forEach(function(c){
    var okF=curF==='all'||c.dataset.type===curF;
    var okQ=c.dataset.name.indexOf(q)>-1;
    c.style.display=(okF&&okQ)?'':'none';
  });
}

/* ================= ONLINE COUNTER ================= */
(function(){
  var el=document.getElementById('online-num'); if(!el) return;
  var n=parseInt(sessionStorage.getItem('nero_online')||'0',10);
  if(!n){ n=1180+Math.floor(Math.random()*180); }
  el.textContent=fmtNum(n);
  setInterval(function(){ n+=Math.floor(Math.random()*7)-3; if(n<900)n=900;
    sessionStorage.setItem('nero_online',n); el.textContent=fmtNum(n); },5000);
})();

/* ================= MUSIC PLAYER ================= */
var bgm=document.getElementById('bgm');
var MUS={idx:0,playing:false};
function musSave(){ try{
  sessionStorage.setItem('nero_mus',JSON.stringify({i:MUS.idx,t:bgm.currentTime,v:bgm.volume,p:MUS.playing}));
}catch(e){} }
function musLoad(){ try{ return JSON.parse(sessionStorage.getItem('nero_mus')||'null'); }catch(e){ return null; } }
function musIcon(){
  var b=document.getElementById('mus-toggle'); if(!b) return;
  b.innerHTML = MUS.playing ? '<i class="ti ti-player-pause"></i>' : '<i class="ti ti-player-play"></i>';
}
function musLabel(){
  var t=document.getElementById('mus-track');
  if(t) t.textContent = TRACKS.length ? TRACKS[MUS.idx].title : 'No track';
  document.querySelectorAll('.mus-item').forEach(function(e){ e.classList.toggle('on',+e.dataset.i===MUS.idx); });
}
function musLoadTrack(i,autoplay,seek){
  if(!TRACKS.length) return;
  MUS.idx=(i+TRACKS.length)%TRACKS.length;
  bgm.src=ROOT+TRACKS[MUS.idx].file;
  if(seek) bgm.currentTime=seek;
  musLabel();
  if(autoplay) musPlay();
}
function musPlay(){ var p=bgm.play(); MUS.playing=true; musIcon();
  if(p&&p.catch) p.catch(function(){ MUS.playing=false; musIcon(); }); }
function musPause(){ bgm.pause(); MUS.playing=false; musIcon(); musSave(); }
function musToggle(){ MUS.playing?musPause():musPlay(); musSave(); }
function musNext(){ musLoadTrack(MUS.idx+1,true); musSave(); }
function musPick(i){ musLoadTrack(i,true); musSave(); document.getElementById('mus-panel').classList.remove('show'); }
function musBuildList(){
  var p=document.getElementById('mus-panel'); if(!p) return;
  p.innerHTML='<div class="mus-title">Playlist</div>'+TRACKS.map(function(t,i){
    return '<div class="mus-item'+(i===MUS.idx?' on':'')+'" data-i="'+i+'" onclick="musPick('+i+')">'+
      '<i class="ti ti-music"></i>'+t.title+'</div>';}).join('');
}
(function initMusic(){
  if(!bgm) return;
  var saved=musLoad();
  var vol = saved && typeof saved.v==='number' ? saved.v : 0.5;   /* default 50% */
  bgm.volume=vol;
  var volEl=document.getElementById('mus-vol');
  if(volEl){ volEl.value=Math.round(vol*100);
    volEl.addEventListener('input',function(){ bgm.volume=this.value/100; musSave(); }); }
  musBuildList();
  musLoadTrack(saved?saved.i:0,false,saved?saved.t:0);
  bgm.addEventListener('ended',function(){ musNext(); });
  bgm.addEventListener('timeupdate',function(){ if(MUS.playing && Math.floor(bgm.currentTime)%3===0) musSave(); });
  var tg=document.getElementById('mus-toggle'); if(tg) tg.addEventListener('click',musToggle);
  var nx=document.getElementById('mus-next');   if(nx) nx.addEventListener('click',musNext);
  var lb=document.getElementById('mus-list-btn');
  if(lb) lb.addEventListener('click',function(e){ e.stopPropagation();
    document.getElementById('mus-panel').classList.toggle('show'); });
  document.addEventListener('click',function(){ var p=document.getElementById('mus-panel'); if(p)p.classList.remove('show'); });
  /* autoplay: on by default, resume after first interaction if blocked */
  var want = saved ? saved.p!==false : true;
  if(want){ musPlay();
    var kick=function(){ if(!MUS.playing&&want) musPlay();
      document.removeEventListener('click',kick); document.removeEventListener('keydown',kick); document.removeEventListener('touchstart',kick); };
    document.addEventListener('click',kick); document.addEventListener('keydown',kick); document.addEventListener('touchstart',kick);
  } else { musIcon(); }
})();

renderAcct();
