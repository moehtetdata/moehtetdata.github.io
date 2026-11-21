/* MoeHtet Tech service worker: offline app shell, fresh feed */
var CACHE='moehtet-v1';
var SHELL=['/','/index.html','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png','/icons/icon-512-maskable.png','/icons/apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  if(u.hostname==='script.google.com'||u.hostname==='script.googleusercontent.com'){
    e.respondWith(fetch(e.request).then(function(r){if(r&&r.ok){var c=r.clone();caches.open(CACHE).then(function(ca){ca.put(e.request,c);});}return r;}).catch(function(){return caches.match(e.request);}));
    return;
  }
  if(u.origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(function(r){if(r&&r.ok){var c=r.clone();caches.open(CACHE).then(function(ca){ca.put(e.request,c);});}return r;}).catch(function(){return caches.match(e.request).then(function(r){return r||caches.match('/');});}));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(nr){if(nr&&nr.ok){var c=nr.clone();caches.open(CACHE).then(function(ca){ca.put(e.request,c);});}return nr;});}));
});
