/* WorkNest service worker — network-first for the app shell, pass-through for everything cross-origin.
   Bump VERSION on every upload so phones pick up the new version. */
const VERSION='worknest-1.0.1';
const SHELL=['./','index.html','manifest.json','privacy_policy.html','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('worknest-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return; // fonts/CDN: let the browser handle it
 e.respondWith(fetch(req,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy))}return res})
  .catch(()=>caches.match(req).then(r=>r||(req.mode==='navigate'?caches.match('index.html'):undefined))));
});
