const SB_URL = "https://ltjyovuyeyzcacfnderl.supabase.co";
const SB_KEY = "sb_publishable_5zuFsY7MtwCmpODNh6918A_JM7Wdqxa";

const H = { apikey: SB_KEY, "Content-Type": "application/json" };
if (!SB_KEY.startsWith("sb_")) H.Authorization = "Bearer " + SB_KEY;

async function api(path, { method = "GET", body, prefer } = {}) {
  const h = { ...H };
  if (prefer) h.Prefer = prefer;
  const r = await fetch(SB_URL + "/rest/v1/" + path, {
    method,
    headers: h,
    body: body && JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m],
  );

// ---- UI ----
function mascot(mood = "idle", cls = "") {
  const K = "#1a1405";
  const eyes = {
    idle: `<circle cx="38" cy="52" r="5.5" fill="${K}"/><circle cx="62" cy="52" r="5.5" fill="${K}"/><circle cx="40" cy="50" r="1.8" fill="#fff"/><circle cx="64" cy="50" r="1.8" fill="#fff"/>`,
    happy: `<path d="M31 55q7-10 14 0M55 55q7-10 14 0" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    sad: `<circle cx="38" cy="53" r="6" fill="${K}"/><circle cx="62" cy="53" r="6" fill="${K}"/><circle cx="40" cy="51" r="2.2" fill="#fff"/><circle cx="64" cy="51" r="2.2" fill="#fff"/><path d="M29 44l14 5M71 44l-14 5" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
  };
  const mouth = {
    idle: `<path d="M43 63q7 6 14 0" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M40 61q10 15 20 0z" fill="${K}"/><ellipse cx="50" cy="67" rx="4.5" ry="3" fill="#ff7a9a"/>`,
    sad: `<path d="M42 69q8-8 16 0" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  };
  const cheeks =
    '<ellipse cx="27" cy="62" rx="5" ry="3.2" fill="#ff8a8a" opacity=".7"/><ellipse cx="73" cy="62" rx="5" ry="3.2" fill="#ff8a8a" opacity=".7"/>';
  const tears =
    '<path class="tear" d="M33 60q-5 9 0 12q5-3 0-12z" fill="#5ac8fa"/><path class="tear t2" d="M67 60q-5 9 0 12q5-3 0-12z" fill="#5ac8fa"/>';
  return `<svg class="mascot ${mood} ${cls}" viewBox="0 0 100 100" aria-hidden="true">
<g class="wing"><ellipse cx="30" cy="30" rx="15" ry="9" fill="#fff" opacity=".8" transform="rotate(-30 30 30)"/></g>
<g class="wing"><ellipse cx="70" cy="30" rx="15" ry="9" fill="#fff" opacity=".8" transform="rotate(30 70 30)"/></g>
<path d="M42 24Q38 10 30 8M58 24Q62 10 70 8" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="8" r="3.5" fill="${K}"/><circle cx="70" cy="8" r="3.5" fill="${K}"/>
<defs><clipPath id="bb"><ellipse cx="50" cy="58" rx="36" ry="32"/></clipPath></defs>
<ellipse cx="50" cy="58" rx="36" ry="32" fill="#ffc800"/>
<g clip-path="url(#bb)"><rect x="0" y="76" width="100" height="8" fill="${K}"/><rect x="0" y="90" width="100" height="10" fill="${K}"/></g>
<ellipse cx="36" cy="38" rx="9" ry="4.5" fill="#fff" opacity=".35"/>
${eyes[mood]}${mouth[mood]}${mood === "sad" ? tears : cheeks}</svg>`;
}
const MASCOT = mascot("idle");
const BRAND = MASCOT + '<div class="logo">Quizzy</div>';
const rankRows = (arr) => {
  const mx = Math.max(1, ...arr.map((p) => p.score));
  return arr
    .map(
      (p, i) =>
        `<div class="row" style="--w:${(p.score / mx) * 100}%"><span>${["🥇", "🥈", "🥉"][i] || i + 1}</span><b>${esc(p.name)}</b><em>${p.score}</em></div>`,
    )
    .join("");
};
function confetti(n = 28) {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const c = ["#ffc800", "#ffffff", "#ff5a5f", "#3aa0ff"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i");
    s.className = "cf";
    s.style.cssText = `left:${Math.random() * 100}vw;background:${c[i % 4]};--dx:${(Math.random() - 0.5) * 160}px;animation-delay:${Math.random() * 0.4}s;animation-duration:${1.6 + Math.random()}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3000);
  }
}
