const panel=document.getElementById('panel');
const backdrop=document.getElementById('backdrop');
const pnlBody=document.getElementById('pnl-body');
const pnlTitle=document.getElementById('pnl-title');
const pnlIcon=document.getElementById('pnl-icon');

const ICONS={server:'ti-scroll',download:'ti-download',marketplace:'ti-scale',donation:'ti-heart',login:'ti-login',register:'ti-user-plus'};
const TITLES={server:'Server Detail',download:'Download',donation:'Donation',login:'Login',register:'Create Account'};

function openPanel(type){
  if(type==='marketplace'){ location.href='pages/marketplace.html'; return; }
  if(type==='donation' && !Auth.loggedIn){ type='login'; }
  pnlIcon.className='ti '+ICONS[type];
  pnlTitle.textContent=TITLES[type];
  pnlBody.innerHTML=render(type);
  if(type==='donation') initDonation();
  panel.classList.add('show'); backdrop.classList.add('show');
}
function closePanel(){ panel.classList.remove('show'); backdrop.classList.remove('show'); }

function render(type){
  if(type==='login')    return loginHTML();
  if(type==='download') return downloadHTML();
  if(type==='server')   return serverHTML();
  if(type==='donation') return donationHTML();
  if(type==='register') return registerHTML();
  return '';
}

/* ---------- LOGIN ---------- */
function loginHTML(){
  return `
    <p class="lead">Sign in to your NeRO account to donate, trade, and track your progress.</p>
    <label class="fld">Account ID</label>
    <input class="inp" id="login-id" placeholder="yourname">
    <label class="fld">Password</label>
    <input class="inp" id="login-pw" type="password" placeholder="••••••••">
    <button class="btn-gold" onclick="doLogin()">Login</button>
    <div class="rowlinks"><a href="#" onclick="return false">Forgot password?</a><a href="#" onclick="openPanel('register');return false">Register</a></div>
  `;
}
function doLogin(){
  const id=document.getElementById('login-id').value.trim()||'Adventurer';
  Auth.loggedIn=true; sessionStorage.setItem('nero_user',id);
  closePanel();
  setTimeout(()=>alert('Logged in as '+id+' (demo — no real backend yet)'),200);
}

/* ---------- DOWNLOAD ---------- */
function downloadHTML(){
  return `
    <p class="lead">Download the NeRO game client and patcher to begin your adventure.</p>
    <div class="kv"><span>Client size</span><span>~3.5 GB</span></div>
    <div class="kv"><span>Patch</span><span>Auto (on launch)</span></div>
    <div class="kv"><span>OS</span><span>Windows 10 / 11</span></div>
    <a class="btn-gold" id="dl-link" href="#" onclick="alert('Google Drive link coming soon');return false">Download Full Client</a>
    <a class="btn-ghost" href="#" onclick="return false">Manual Patch (mirror)</a>
    <p class="lead" style="margin-top:18px;font-size:12px">Client link will be provided via Google Drive.</p>
  `;
}

/* ---------- SERVER DETAIL ---------- */
function serverHTML(){
  const s=SERVER_INFO;
  return `
    <p class="lead">Core settings of the New Era Ragnarok Online — NeRO server.</p>
    <div class="kv"><span>Base Rate</span><span>${s.base}</span></div>
    <div class="kv"><span>Job Rate</span><span>${s.job}</span></div>
    <div class="kv"><span>Drop Rate</span><span>${s.drop}</span></div>
    <div class="kv"><span>Max Base Level</span><span>${s.maxbase}</span></div>
    <div class="kv"><span>Max Job Level</span><span>${s.maxjob}</span></div>
    <div class="kv"><span>Episode</span><span>${s.episode}</span></div>
    <label class="fld" style="margin-top:22px">Statistics</label>
    <div class="statbtns">
      <a class="statbtn" href="pages/stat-woe.html"><i class="ti ti-swords"></i>WoE</a>
      <a class="statbtn" href="pages/stat-pvp.html"><i class="ti ti-skull"></i>PvP</a>
      <a class="statbtn" href="pages/stat-mvp.html"><i class="ti ti-crown"></i>MVP</a>
      <a class="statbtn" href="pages/stat-zeny.html"><i class="ti ti-coins"></i>Zeny</a>
    </div>
    <a class="btn-ghost" href="wiki/index.html" style="margin-top:16px">Open Full Wiki</a>
  `;
}

/* ---------- DONATION ---------- */
function donationHTML(){
  const amts=DONATE_AMOUNTS.map((a,i)=>`
    <div class="amt" data-i="${i}" onclick="pickAmt(${i})">
      <div class="cp">${a.cp} CP</div><div class="lbl">${a.price}</div></div>`).join('');
  const streamers=STREAMERS.map(s=>`<option value="${s}">${s}</option>`).join('');
  const guilds=GUILDS.map(g=>`<option value="${g}">${g}</option>`).join('');
  return `
    <p class="lead">Support NeRO and receive Cash Points. Logged in as <b style="color:var(--gold)">${Auth.user()||'Adventurer'}</b>.</p>
    <label class="fld">Choose amount</label>
    <div class="amt-grid">${amts}</div>
    <label class="fld">Support a streamer <span style="text-transform:none;color:var(--gold-soft)">(+10% bonus CP)</span></label>
    <select class="inp" id="don-streamer" onchange="updateSummary()">
      <option value="">— None —</option>${streamers}
    </select>
    <div class="hintline">Get 10% bonus by choosing the streamer you want to support.</div>
    <label class="fld">Support your guild</label>
    <select class="inp" id="don-guild" onchange="updateSummary()">
      <option value="">— None —</option>${guilds}
    </select>
    <div class="hintline">Support your guild leader by mentioning your guild.</div>
    <div class="summary" id="don-summary">Select an amount to see your total.</div>
    <button class="btn-gold" onclick="alert('Payment gateway coming soon (demo)')">Proceed to Payment</button>
  `;
}
let selAmt=null;
function initDonation(){ selAmt=null; }
function pickAmt(i){
  selAmt=i;
  document.querySelectorAll('.amt').forEach(e=>e.classList.toggle('sel', +e.dataset.i===i));
  updateSummary();
}
function updateSummary(){
  const box=document.getElementById('don-summary'); if(!box) return;
  if(selAmt===null){ box.innerHTML='Select an amount to see your total.'; return; }
  const a=DONATE_AMOUNTS[selAmt];
  const streamer=document.getElementById('don-streamer').value;
  const guild=document.getElementById('don-guild').value;
  const base=parseInt(a.cp.replace(/,/g,''));
  const bonus=streamer?Math.round(base*0.10):0;
  const total=(base+bonus).toLocaleString('en-US');
  box.innerHTML=`Base: <b>${a.cp} CP</b><br>`+
    (streamer?`Streamer bonus (+10%): <b>+${bonus.toLocaleString('en-US')} CP</b> → ${streamer}<br>`:'')+
    (guild?`Guild: <b>${guild}</b><br>`:'')+
    `<hr style="border:none;border-top:1px solid rgba(228,184,75,.3);margin:8px 0">`+
    `Total: <b>${total} CP</b> — ${a.price}`;
}

function registerHTML(){
  return `
    <p class="lead">Create a new NeRO account. It's free.</p>
    <label class="fld">Account ID</label><input class="inp" placeholder="choose an ID">
    <label class="fld">Email</label><input class="inp" type="email" placeholder="name@email.com">
    <label class="fld">Password</label><input class="inp" type="password" placeholder="••••••••">
    <label class="fld">Confirm Password</label><input class="inp" type="password" placeholder="••••••••">
    <button class="btn-gold" onclick="alert('Registration coming soon (demo)')">Create Account</button>
    <div class="rowlinks"><span></span><a href="#" onclick="openPanel('login');return false">Already have an account? Login</a></div>
  `;
}
