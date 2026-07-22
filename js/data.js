// ---- Mock data (replace with real backend later) ----
const STREAMERS = ["AsuraLive","PoringTV","ValkyrieVODs","MidgardMaster","BraninRO"];
const GUILDS = ["Valhalla","Nidhogg","Ragnarok Elite","Prontera Knights","Shadow Covenant"];
const DONATE_AMOUNTS = [
  {cp:"100,000",  price:"Rp 50.000"},
  {cp:"250,000",  price:"Rp 120.000"},
  {cp:"500,000",  price:"Rp 230.000"},
  {cp:"1,000,000",price:"Rp 450.000"},
  {cp:"5,000,000",price:"Rp 2.100.000"},
];
const SERVER_INFO = {
  base:"x30", job:"x30", drop:"x30",
  maxbase:"99", maxjob:"70", episode:"10.3 (Abyss Lake)"
};
// simple in-session auth flag
const Auth = {
  get loggedIn(){ return sessionStorage.getItem("nero_login")==="1"; },
  set loggedIn(v){ sessionStorage.setItem("nero_login", v?"1":"0"); },
  user(){ return sessionStorage.getItem("nero_user")||""; }
};
