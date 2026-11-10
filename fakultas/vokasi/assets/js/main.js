/* Pendidikan Vokasi — responsive navigation and prodi-only catalogue search. */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-navigation');

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const searchInput = document.querySelector('#programSearch');
  const catalog = document.querySelector('#departmentCatalog');
  const resultContainer = document.querySelector('#programSearchResults');
  const resultCount = document.querySelector('#programResultCount');
  const guidance = document.querySelector('#programSearchGuidance');

  if (!searchInput || !catalog || !resultContainer) return;

  const normalize = value => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('id')
    .replace(/\s+/g, ' ')
    .trim();

  // Build a searchable index from the program names already present in the HTML.
  // Department and degree metadata are attached to each program but are not searched.
  const programs = [];
  catalog.querySelectorAll('[data-dept-card]').forEach(departmentCard => {
    const department = departmentCard.querySelector('.dept-title')?.textContent.trim() || 'Departemen belum dicantumkan';
    departmentCard.querySelectorAll('.degree-panel').forEach(degreePanel => {
      const degree = degreePanel.querySelector('h4')?.textContent.trim() || 'Jenjang belum dicantumkan';
      degreePanel.querySelectorAll('.program-list li').forEach(programItem => {
        const name = programItem.textContent.trim();
        if (name) programs.push({ name, degree, department });
      });
    });
  });

  const createField = (label, value, extraClass = '') => {
    const field = document.createElement('div');
    field.className = `program-result-field ${extraClass}`.trim();
    const caption = document.createElement('span');
    caption.className = 'program-result-label';
    caption.textContent = label;
    const text = document.createElement('strong');
    text.className = 'program-result-value';
    text.textContent = value;
    field.append(caption, text);
    return field;
  };

  const renderResults = () => {
    const query = normalize(searchInput.value);
    resultContainer.replaceChildren();

    if (!query) {
      catalog.hidden = false;
      resultContainer.hidden = true;
      if (guidance) guidance.hidden = false;
      if (resultCount) resultCount.textContent = `${programs.length} pilihan program studi tersedia`;
      return;
    }

    const terms = query.split(' ').filter(Boolean);
    const matches = programs.filter(program => {
      const programName = normalize(program.name);
      return terms.every(term => programName.includes(term));
    });

    catalog.hidden = true;
    resultContainer.hidden = false;
    if (guidance) guidance.hidden = true;
    if (resultCount) resultCount.textContent = `${matches.length} prodi ditemukan`;

    if (matches.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'program-search-empty';
      empty.textContent = `Belum ada program studi dengan nama “${searchInput.value.trim()}”. Coba kata kunci nama prodi yang lain.`;
      resultContainer.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    matches.forEach(program => {
      const card = document.createElement('article');
      card.className = 'program-result-card';
      card.append(
        createField('Program studi', program.name, 'program-result-main'),
        createField('Jenjang', program.degree),
        createField('Departemen', program.department)
      );
      fragment.append(card);
    });
    resultContainer.append(fragment);
  };

  searchInput.addEventListener('input', renderResults);
  renderResults();
});
