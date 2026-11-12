const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const navItems = [
  ['geografikur.html', 'Beranda'],
  ['profil.html', 'Profil'],
  ['tentang.html', 'Tentang'],
  ['sejarah.html', 'Sejarah'],
  ['mata-kuliah.html', 'Mata Kuliah'],
  ['kurikulum.html', 'Kurikulum'],
  ['riset-pengabdian.html', 'Riset & Pengabdian']
];

const THEME_KEY = 'geografi-portal-theme';

function preferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (error) {
    // The portal still works when browser storage is unavailable.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, save = false) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content', nextTheme === 'dark' ? '#112d25' : '#183b35'
  );

  const toggle = $('#theme-toggle');
  if (toggle) {
    const darkMode = nextTheme === 'dark';
    toggle.setAttribute('aria-pressed', String(darkMode));
    toggle.setAttribute('aria-label', darkMode ? 'Aktifkan tema terang' : 'Aktifkan tema gelap');
    toggle.title = darkMode ? 'Beralih ke tema terang' : 'Beralih ke tema gelap';
    toggle.innerHTML = `<span class="theme-icon" aria-hidden="true">${darkMode ? '☀' : '☾'}</span><span class="theme-label">${darkMode ? 'Tema terang' : 'Tema gelap'}</span>`;
  }

  if (save) {
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
      // Ignore storage restrictions; the current page theme is already updated.
    }
  }
}

// Apply the saved/system theme before the page is initialized.
applyTheme(preferredTheme());

function nav() {
  const current = location.pathname.split('/').pop() || 'geografikur.html';
  const element = $('#site-nav');
  if (!element) return;

  element.innerHTML = navItems.map(([href, label]) =>
    `<a href="${href}" class="${current === href ? 'active' : ''}">${label}</a>`
  ).join('') + `
    <a href="kurikulum.html" class="nav-cta">Lihat Kurikulum ↗</a>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-pressed="false">
      <span class="theme-icon" aria-hidden="true">☾</span>
      <span class="theme-label">Tema gelap</span>
    </button>`;

  const menuButton = $('#menu-btn');
  menuButton?.addEventListener('click', () => {
    const isOpen = element.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  $('#theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });
  applyTheme(document.documentElement.dataset.theme || preferredTheme());
}

function footer() {
  const element = $('#site-footer');
  if (!element) return;

  element.innerHTML = `
    <div class="shell">
      <div class="footer-grid">
        <div>
          <div class="brand" style="color:white">
            <div class="brand-mark" style="background:#d6ec8b;color:#183b35">GEO</div>
            <div class="brand-name">PROGRAM STUDI GEOGRAFI
              <small style="color:#b8c9bf">DEPARTEMEN GEOGRAFI DAN ILMU WILAYAH</small>
            </div>
          </div>
          <p style="max-width:360px;margin-top:16px">Mempelajari bumi, manusia, dan dinamika ruang melalui sains geospasial, analisis kewilayahan, dan pendekatan berkelanjutan.</p>
        </div>
        <div>
          <h4>Jelajahi</h4>
          <div class="footer-links">${navItems.slice(1).map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</div>
        </div>
        <div>
          <h4>Informasi Akademik</h4>
          <div class="footer-links">
            <a href="kurikulum.html">Struktur 144 SKS</a>
            <a href="mata-kuliah.html">Katalog Mata Kuliah</a>
            <a href="riset-pengabdian.html">Riset & Pengabdian</a>
            <a href="sejarah.html">Sejarah Program Studi</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Program Studi Geografi · Universitas Seruni</span>
        <span>Materi kurikulum merupakan rancangan informasi akademik untuk pengembangan.</span>
      </div>
    </div>`;
}

function groupLabel(group) {
  return ({
    GKWK: 'Wajib Fakultas',
    GLWK: 'Wajib Departemen',
    GEWK: 'Wajib / Pilihan Prodi',
    USWK: 'Wajib Universitas'
  })[group] || group;
}

function semesterLabel(semester) {
  return semester ? `Semester ${semester}` : 'Semester belum ditetapkan';
}

window.renderCourses = function renderCourses() {
  const root = $('#course-list');
  if (!root || !Array.isArray(window.GEOGRAFI_COURSES)) return;

  const search = $('#course-search');
  const group = $('#group-filter');
  const semester = $('#semester-filter');
  const kind = $('#kind-filter');
  const tabs = $$('.tab[data-track]');
  let activeTrack = 'Semua';
  let filteredCourses = [...window.GEOGRAFI_COURSES];

  function paint() {
    const query = (search?.value || '').toLocaleLowerCase('id').trim();
    filteredCourses = window.GEOGRAFI_COURSES.filter(course => {
      const searchable = [
        course.name,
        course.code,
        course.group,
        groupLabel(course.group),
        course.kind,
        course.track,
        semesterLabel(course.semester),
        course.notes
      ].join(' ').toLocaleLowerCase('id');

      return (!query || searchable.includes(query))
        && (!group || group.value === 'all' || course.group === group.value)
        && (!semester || semester.value === 'all' || String(course.semester ?? '') === semester.value)
        && (!kind || kind.value === 'all' || course.kind === kind.value)
        && (activeTrack === 'Semua' || course.track === activeTrack);
    });

    const count = $('#course-count');
    if (count) count.textContent = `${filteredCourses.length} dari ${window.GEOGRAFI_COURSES.length} mata kuliah`;

    root.innerHTML = filteredCourses.length ? filteredCourses.map(course => `
      <article class="course" title="${course.notes || course.name}">
        <div class="course-info">
          <h3>${course.name}</h3>
          <div class="meta">
            <span class="course-code">${course.code}</span>
            <span>·</span>
            <span>${groupLabel(course.group)}</span>
            <span>·</span>
            <span>${course.kind}</span>
            ${course.track ? `<span class="tag">${course.track}</span>` : ''}
            <span>${semesterLabel(course.semester)}</span>
          </div>
        </div>
        <div class="sks">${course.displaySks}<small>SKS</small></div>
      </article>`).join('') : `
      <div class="empty">
        <strong>Tidak ada mata kuliah yang cocok.</strong>
        <p>Coba ubah kata kunci atau filter pencarian.</p>
      </div>`;
  }

  [search, group, semester, kind].filter(Boolean).forEach(control => {
    control.addEventListener('input', paint);
    control.addEventListener('change', paint);
  });

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    activeTrack = tab.dataset.track || 'Semua';
    if (kind && activeTrack !== 'Semua') kind.value = 'Pilihan';
    if (kind && activeTrack === 'Semua') kind.value = 'all';
    paint();
  }));

  $('#reset-filter')?.addEventListener('click', () => {
    if (search) search.value = '';
    if (group) group.value = 'all';
    if (semester) semester.value = 'all';
    if (kind) kind.value = 'all';
    activeTrack = 'Semua';
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.track === 'Semua'));
    paint();
  });

  $('#download-csv')?.addEventListener('click', () => {
    const rows = [[
      'Kode katalog usulan', 'Nama Mata Kuliah', 'Kode Kelompok',
      'Kategori', 'Peminatan', 'Semester', 'SKS', 'Catatan'
    ], ...filteredCourses.map(course => [
      course.code,
      course.name,
      course.group,
      course.kind,
      course.track,
      course.semester ?? 'Belum ditetapkan',
      course.displaySks,
      course.notes
    ])];
    const csv = rows.map(row => row.map(value =>
      `"${String(value ?? '').replaceAll('"', '""')}"`
    ).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'katalog-mata-kuliah-geografi.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  paint();
};

window.renderCurriculum = function renderCurriculum() {
  const root = $('#semester-list');
  if (!root || !window.GEOGRAFI_CURRICULUM) return;

  const semesters = Object.entries(window.GEOGRAFI_CURRICULUM);
  const totals = Object.fromEntries(semesters.map(([semester, courses]) => [
    semester,
    courses.reduce((sum, [, credits]) => sum + Number(credits || 0), 0)
  ]));
  const totalCredits = Object.values(totals).reduce((sum, value) => sum + value, 0);

  root.innerHTML = semesters.map(([semester, courses]) => `
    <article class="semester-card">
      <div class="sem-top">
        <div>
          <h3>Semester ${semester}</h3>
          <span class="semester-count">${courses.length} komponen pembelajaran</span>
        </div>
        <div class="credit">${totals[semester]}<small>SKS total</small></div>
      </div>
      <ul>
        ${courses.map(([name, credits]) => `
          <li class="${name === 'Pilihan / MBKM' ? 'allocation-row' : ''}">
            <span>${name}</span>
            <span>${credits} SKS</span>
          </li>`).join('')}
      </ul>
    </article>`).join('');

  const totalOutput = $('#curriculum-total');
  if (totalOutput) totalOutput.textContent = `${totalCredits} SKS`;

  const slider = $('#credit-slider');
  if (slider) {
    const output = $('#credit-value');
    const status = $('#credit-status');
    const progress = $('#credit-progress');

    const update = () => {
      const credits = Number(slider.value);
      if (output) output.textContent = credits;
      if (progress) progress.style.width = `${Math.min(100, (credits / 164) * 100)}%`;
      if (!status) return;

      if (credits < 144) {
        status.textContent = `Masih kurang ${144 - credits} SKS dari syarat minimum kelulusan.`;
        status.dataset.state = 'warning';
      } else if (credits <= 164) {
        status.textContent = 'Jumlah kredit berada dalam rentang rancangan kelulusan (144–164 SKS).';
        status.dataset.state = 'success';
      } else {
        status.textContent = `Melebihi batas maksimum rancangan sebanyak ${credits - 164} SKS.`;
        status.dataset.state = 'warning';
      }
    };

    slider.addEventListener('input', update);
    update();
  }
};

function init() {
  nav();
  footer();
  if (window.GEOGRAFI_COURSES && window.renderCourses) window.renderCourses();
  if (window.GEOGRAFI_CURRICULUM && window.renderCurriculum) window.renderCurriculum();
}

document.addEventListener('DOMContentLoaded', init);
