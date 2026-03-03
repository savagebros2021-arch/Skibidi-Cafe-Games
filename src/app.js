let games = [];
let searchQuery = '';
let selectedGame = null;

async function loadGames() {
  try {
    const response = await fetch('./src/data/games.json');
    games = await response.json();
    render();
  } catch (error) {
    console.error('Failed to load games:', error);
  }
}

function setSearch(query) {
  searchQuery = query;
  render();
}

function selectGame(game) {
  selectedGame = game;
  render();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function render() {
  const app = document.getElementById('app');
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  app.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div id="logo" class="flex items-center gap-2 cursor-pointer group">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
              <i data-lucide="gamepad-2" class="text-zinc-950 w-6 h-6"></i>
            </div>
            <h1 class="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span class="text-emerald-500">ARCADE</span>
            </h1>
          </div>

          <div class="flex-1 max-w-md relative">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"></i>
            <input
              id="search-input"
              type="text"
              placeholder="Search games..."
              value="${searchQuery}"
              class="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div class="flex items-center gap-2">
            <button id="fullscreen-btn" class="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
              <i data-lucide="maximize-2" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        ${!selectedGame ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${filteredGames.length > 0 ? filteredGames.map(game => `
              <div class="game-card group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10" data-id="${game.id}">
                <div class="aspect-video overflow-hidden">
                  <img
                    src="${game.thumbnail}"
                    alt="${game.title}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerpolicy="no-referrer"
                  />
                </div>
                <div class="p-4">
                  <h3 class="font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">
                    ${game.title}
                  </h3>
                  <p class="text-sm text-zinc-400 line-clamp-2">
                    ${game.description}
                  </p>
                </div>
                <div class="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors pointer-events-none"></div>
              </div>
            `).join('') : `
              <div class="col-span-full py-20 text-center">
                <p class="text-zinc-500 text-lg">No games found matching your search.</p>
              </div>
            `}
          </div>
        ` : `
          <div class="flex flex-col gap-4 h-[calc(100vh-12rem)]">
            <div class="flex items-center justify-between">
              <button id="back-btn" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                <i data-lucide="arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></i>
                Back to Games
              </button>
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-bold">${selectedGame.title}</h2>
                <a href="${selectedGame.iframeUrl}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                  <i data-lucide="external-link" class="w-5 h-5"></i>
                </a>
              </div>
            </div>

            <div class="flex-1 bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
              <iframe
                src="${selectedGame.iframeUrl}"
                class="w-full h-full border-none"
                title="${selectedGame.title}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            
            <div class="p-4 glass rounded-2xl">
              <h3 class="font-bold mb-2">About ${selectedGame.title}</h3>
              <p class="text-zinc-400">${selectedGame.description}</p>
            </div>
          </div>
        `}
      </main>

      <footer class="border-t border-white/10 py-8 mt-auto">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>© 2026 Unblocked Arcade. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  // Re-initialize icons
  lucide.createIcons();

  // Attach event listeners
  document.getElementById('logo').onclick = () => selectGame(null);
  document.getElementById('fullscreen-btn').onclick = toggleFullscreen;
  
  const searchInput = document.getElementById('search-input');
  searchInput.oninput = (e) => setSearch(e.target.value);
  searchInput.focus();
  // Keep cursor at end
  const val = searchInput.value;
  searchInput.value = '';
  searchInput.value = val;

  if (selectedGame) {
    document.getElementById('back-btn').onclick = () => selectGame(null);
  } else {
    document.querySelectorAll('.game-card').forEach(card => {
      card.onclick = () => {
        const id = card.getAttribute('data-id');
        const game = games.find(g => g.id === id);
        selectGame(game);
      };
    });
  }
}

export { loadGames };
