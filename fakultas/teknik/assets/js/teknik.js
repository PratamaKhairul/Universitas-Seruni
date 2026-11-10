/* ==========================================================
   FAKULTAS TEKNIK UNIVERSITAS SERUNI
   Shared interactions: mobile navigation and program search
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNavigation = document.querySelector('#primaryNavigation');
  const topbar = document.querySelector('.topbar');

  const setMenuOpen = (isOpen) => {
    if (!menuToggle || !primaryNavigation) return;

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
    primaryNavigation.classList.toggle('is-open', isOpen);
  };

  if (menuToggle && primaryNavigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });

    primaryNavigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 980 && topbar && !topbar.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) setMenuOpen(false);
    });
  }

  initializeProgramSearch();
});

function initializeProgramSearch() {
  const searchInput = document.querySelector('#programSearch');
  const departmentList = document.querySelector('#departmentList');
  const searchResults = document.querySelector('#programSearchResults');
  const searchResultsHead = document.querySelector('#searchResultsHead');
  const searchResultsList = document.querySelector('#searchResultsList');
  const emptyState = document.querySelector('#emptyState');

  // Fitur pencarian hanya tersedia pada halaman Departemen.
  if (
    !searchInput ||
    !departmentList ||
    !searchResults ||
    !searchResultsHead ||
    !searchResultsList ||
    !emptyState
  ) return;

  const departmentCards = Array.from(departmentList.querySelectorAll('.department'));
  const allPrograms = [];

  // Kumpulkan nama program studi, jenjang, dan departemen dari daftar asli.
  departmentCards.forEach((card) => {
    const departmentName = card.querySelector('summary')?.textContent.trim() || 'Departemen';
    const content = card.querySelector('.department-content');
    if (!content) return;

    let currentLevel = 'Program Studi';

    Array.from(content.children).forEach((element) => {
      if (element.matches('h4')) {
        currentLevel = element.textContent.trim();
        return;
      }

      if (element.matches('ul')) {
        element.querySelectorAll(':scope > li').forEach((item) => {
          const programName = item.textContent.trim();
          if (programName) {
            allPrograms.push({
              name: programName,
              department: departmentName,
              level: currentLevel
            });
          }
        });
      }
    });
  });

  const normalizeText = (value) => value
    .toLocaleLowerCase('id')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const renderProgramResults = () => {
    const query = normalizeText(searchInput.value.trim());
    searchResultsList.replaceChildren();

    if (!query) {
      departmentList.hidden = false;
      searchResults.hidden = true;
      emptyState.hidden = true;
      return;
    }

    // Nama departemen ditampilkan sebagai keterangan, bukan kata kunci pencarian.
    const matches = allPrograms.filter((program) =>
      normalizeText(program.name).includes(query)
    );

    departmentList.hidden = true;
    searchResults.hidden = matches.length === 0;
    emptyState.hidden = matches.length !== 0;

    if (matches.length === 0) return;

    searchResultsHead.textContent = `${matches.length} program studi ditemukan`;

    matches.forEach((program) => {
      const card = document.createElement('article');
      card.className = 'program-result';

      const main = document.createElement('div');
      main.className = 'program-result-main';

      const title = document.createElement('h3');
      title.textContent = program.name;

      const level = document.createElement('span');
      level.className = 'program-result-level';
      level.textContent = program.level;

      const department = document.createElement('span');
      department.className = 'program-result-department';
      department.textContent = program.department;

      main.append(title, level);
      card.append(main, department);
      searchResultsList.append(card);
    });
  };

  searchInput.addEventListener('input', renderProgramResults);
  renderProgramResults();
}
