/* =========================================================
   UNIVERSITAS SERUNI — SHARED INTERACTIONS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  setupMobileNavigation();
  setupCurrentYear();
  setupNewsPagination();
  setupFacultyDirectory();
});

function setupMobileNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Buka menu navigasi');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = year;
  });
}

function setupNewsPagination() {
  const list = document.getElementById('news-list');
  const pagination = document.getElementById('news-pagination');
  if (!list || !pagination || !Array.isArray(window.SERUNI_NEWS)) return;

  const articles = window.SERUNI_NEWS;
  const perPage = 10;
  const pageCount = Math.ceil(articles.length / perPage);
  const rangeLabel = document.querySelector('[data-news-range]');
  const totalLabel = document.querySelector('[data-news-total]');
  let currentPage = 1;

  if (totalLabel) totalLabel.textContent = String(articles.length);

  function renderPage(page) {
    currentPage = Math.min(Math.max(page, 1), pageCount);
    const first = (currentPage - 1) * perPage;
    const visibleArticles = articles.slice(first, first + perPage);

    list.innerHTML = visibleArticles.map((article) => `
      <article class="news-card">
        <time class="news-date">${escapeHtml(article.date)}</time>
        <div class="news-content">${article.content}</div>
      </article>
    `).join('');

    const last = Math.min(first + perPage, articles.length);
    if (rangeLabel) rangeLabel.textContent = `Menampilkan ${first + 1}–${last} dari ${articles.length} berita`;
    renderPagination();
  }

  function renderPagination() {
    const controls = [];
    controls.push(makePageButton('← Sebelumnya', currentPage - 1, currentPage === 1, false));
    for (let page = 1; page <= pageCount; page += 1) {
      controls.push(makePageButton(String(page), page, false, page === currentPage));
    }
    controls.push(makePageButton('Berikutnya →', currentPage + 1, currentPage === pageCount, false));
    pagination.innerHTML = '';
    controls.forEach((button) => pagination.appendChild(button));
  }

  function makePageButton(label, page, disabled, selected) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `page-button${selected ? ' is-current' : ''}`;
    button.textContent = label;
    button.disabled = disabled;
    if (selected) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
      renderPage(page);
      document.getElementById('news-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return button;
  }

  renderPage(1);
}

function setupFacultyDirectory() {
  const grid = document.getElementById('faculty-grid');
  const search = document.getElementById('faculty-search');
  const resultCount = document.getElementById('faculty-result-count');
  const emptyState = document.getElementById('faculty-empty');
  if (!grid || !search) return;

  let selectedFilter = 'all';
  const cards = Array.from(grid.querySelectorAll('.faculty-card'));
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));

  function applyFilters() {
    const query = search.value.trim().toLocaleLowerCase('id');
    let visible = 0;

    cards.forEach((card) => {
      const matchesName = (card.dataset.name || '').includes(query);
      const matchesFilter = selectedFilter === 'all' || card.dataset.level === selectedFilter;
      const isVisible = matchesName && matchesFilter;
      card.hidden = !isVisible;
      if (isVisible) visible += 1;
    });

    if (resultCount) resultCount.textContent = `Menampilkan ${visible} dari ${cards.length} unit akademik`;
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  search.addEventListener('input', applyFilters);
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedFilter = button.dataset.filter || 'all';
      filterButtons.forEach((item) => {
        const isSelected = item === button;
        item.classList.toggle('is-selected', isSelected);
        item.setAttribute('aria-pressed', String(isSelected));
      });
      applyFilters();
    });
  });

  applyFilters();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}
