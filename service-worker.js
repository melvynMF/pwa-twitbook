console.log('Service worker loaded');


   const PRECACHE = 'precache-v1';
   const RUNTIME = 'runtime';
   
   // A list of local resources we always want to be cached.
   const PRECACHE_URLS = [
     'index.html',
     './src/assets/images/1f680.png',
     './src/components/data/chat-auth.js',
     './src/components/data/chat-data.js',
     './src/components/data/chat-login.js',
     './src/components/data/chat-profile.js',
     './src/components/data/chat-chat-store.js',
     './src/components/layout/navigation/chat-header.js',
     './src/components/chat-app.js'
   ];
   
   // The install handler takes care of precaching the resources we always need.
   self.addEventListener('install', event => {
     event.waitUntil(
       caches.open(PRECACHE)
         .then(cache => cache.addAll(PRECACHE_URLS))
         .then(self.skipWaiting())
     );
   });
