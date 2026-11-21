const CACHE='deutsch-trainer-b2-v6';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('deutsch-trainer-b2-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request,url=new URL(r.url);
 if(r.method!=='GET'||url.origin!==self.location.origin)return;
 // Online: comprobar primero actualizaciones de código; offline: servir la copia instalada.
 if(/\.(js|css|html|webmanifest)$/.test(url.pathname)||url.pathname.endsWith('/')){
   e.respondWith(fetch(r).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE).then(c=>c.put(r,clone));}return response;}).catch(()=>caches.match(r).then(c=>c||caches.match('./index.html'))));
 }else e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(r,copy))}return res})));
});
