/* ================= MOCK DATA — replace with backend later ================= */
const STREAMERS = ["AsuraLive","PoringTV","ValkyrieVODs","MidgardMaster","BraninRO"];
const GUILDS    = ["Valhalla","Nidhogg","Ragnarok Elite","Prontera Knights","Shadow Covenant"];

/* Donation: CP and Rupiah are 1 : 1 */
const DONATE_AMOUNTS = [
  {cp:100000},{cp:250000},{cp:500000},{cp:1000000},{cp:5000000}
];

const SERVER_INFO = {base:"x30", job:"x30", drop:"x30", maxbase:"99", maxjob:"70", episode:"10.3 (Abyss Lake)"};

/* Music playlist — add more tracks here as you upload them */
const TRACKS = [
  {title:"NeRO Theme 08", file:"assets/08.mp3"}
];

/* Session auth (demo only) */
const Auth = {
  get loggedIn(){ return sessionStorage.getItem("nero_login")==="1"; },
  set loggedIn(v){ sessionStorage.setItem("nero_login", v?"1":"0"); },
  user(){ return sessionStorage.getItem("nero_user")||""; },
  setUser(n){ sessionStorage.setItem("nero_user",n); },
  logout(){ sessionStorage.removeItem("nero_login"); sessionStorage.removeItem("nero_user"); }
};
function fmtRp(n){ return "Rp " + n.toLocaleString("id-ID"); }
function fmtNum(n){ return n.toLocaleString("en-US"); }
