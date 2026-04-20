const CACHE_NAME = 'latelier-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/utils.jsx',
  '/js/hooks/useLocalStorage.jsx',
  '/js/hooks/useDebounce.jsx',
  '/js/hooks/useTheme.jsx',
  '/js/context/AppContext.jsx',
  '/js/components/UI.jsx',
  '/js/components/DashboardView.jsx',
  '/js/components/AIGeneratorView.jsx',
  '/js/components/MenuAnalyzerView.jsx',
  '/js/components/InventoryManagerView.jsx',
  '/js/components/RecipeOptimizerView.jsx',
  '/js/components/AnalyticsDashboardView.jsx',
  '/js/components/MealPlannerView.jsx',
  '/js/App.jsx'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request);
            })
    );
});
