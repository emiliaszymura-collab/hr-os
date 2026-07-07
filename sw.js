// HR-OS — service worker (offline + szybkie ładowanie po instalacji)
// v3: strona (HTML) = network-first (zawsze najświeższa gdy online, cache jako
//     offline fallback). Reszta (obrazy, ikony, biblioteki) = stale-while-revalidate.
const CACHE='hr-os-v3';
const CORE=['./hr-os.html','./hr-os-cloud.html','./office.jpg','./icon-192.png','./icon-512.png','./manifest.json'];

self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });

self.addEventListener('activate',e=>{ e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())
); });

self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  const req=e.request;
  const isDoc = req.mode==='navigate' || req.destination==='document'
    || req.url.endsWith('.html') || req.url.endsWith('/hr-os');

  if(isDoc){
    // network-first — najświeższa strona; przy braku sieci sięgamy po cache
    e.respondWith(
      fetch(req).then(res=>{ const cp=res.clone(); if(res.ok) caches.open(CACHE).then(c=>c.put(req,cp)); return res; })
        .catch(()=>caches.match(req).then(r=>r||caches.match('./hr-os.html')))
    );
    return;
  }

  // stale-while-revalidate — szybko z cache, w tle odświeżamy
  e.respondWith(caches.match(req).then(cached=>{
    const net=fetch(req).then(res=>{
      if(res.ok && (req.url.startsWith(self.location.origin)||req.url.includes('jsdelivr'))){
        const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp));
      }
      return res;
    }).catch(()=>cached);
    return cached||net;
  }));
});
