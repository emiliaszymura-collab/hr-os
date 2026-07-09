// HR-OS — service worker
// v5: strona = network-first (zawsze najświeższa gdy online), reszta = stale-while-revalidate.
//     PRZY AKTUALIZACJI z starszej wersji: czyścimy stary cache i JEDNORAZOWO przeładowujemy
//     otwarte karty, żeby użytkownik od razu dostał świeżą wersję (koniec z zaciętym cache).
const CACHE='hr-os-v6';
const CORE=['./hr-os.html','./hr-os-cloud.html','./office.jpg','./icon-192.png','./icon-512.png','./manifest.json'];

self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });

self.addEventListener('activate',e=>{ e.waitUntil((async()=>{
  const keys=await caches.keys();
  const hadOld=keys.some(k=>k!==CACHE);                       // czy przechodzimy ze starszej wersji?
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
  if(hadOld){                                                 // tylko przy upgrade — nie migamy nowym userom
    const cs=await self.clients.matchAll({type:'window'});
    for(const c of cs){ try{ c.navigate(c.url); }catch(_){} } // jednorazowe przeładowanie na świeżą stronę
  }
})()); });

self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  const req=e.request;
  const isDoc = req.mode==='navigate' || req.destination==='document'
    || req.url.endsWith('.html') || req.url.endsWith('/hr-os');

  if(isDoc){
    // network-first — najświeższa strona; przy braku sieci sięgamy po cache
    e.respondWith(
      fetch(req,{cache:'reload'}).then(res=>{ const cp=res.clone(); if(res.ok) caches.open(CACHE).then(c=>c.put(req,cp)); return res; })
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
