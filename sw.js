const CACHE_NAME = 'menu-v1';
const STATIC_FILES = [
'/',
'/index.html',
'/manifest.json'
];


// Instalação
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES))
);
});


// Ativação
self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
)
);
});


// Fetch – estratégia iFood (network first)
self.addEventListener('fetch', event => {
const url = event.request.url;


// JSON do cardápio sempre tenta internet
if (url.includes('cardapio.json')) {
event.respondWith(
fetch(event.request)
.then(res => {
const clone = res.clone();
caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
return res;
})
.catch(() => caches.match(event.request))
);
return;
}


// Demais arquivos
event.respondWith(
fetch(event.request).catch(() => caches.match(event.request))
);
});
