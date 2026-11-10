/* Navigasi responsif dan pencarian program studi FK-KMK. */
document.addEventListener("DOMContentLoaded", () => {
  // Navigasi hamburger.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");

  if (menuButton && navigation) {
    const closeMenu = () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka menu navigasi");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      navigation.classList.toggle("is-open", !isOpen);
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Buka menu navigasi" : "Tutup menu navigasi");
    });

    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Tahun pada footer.
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // Komponen pencarian dan filter departemen.
  const searchInput = document.querySelector("#program-search");
  const levelFilter = document.querySelector("#level-filter");
  const countLabel = document.querySelector("#program-count");
  const clearButton = document.querySelector("#clear-search");
  const departmentList = document.querySelector("#department-list");
  const emptyState = document.querySelector("#empty-state");

  if (!searchInput || !levelFilter || !countLabel || !departmentList) return;

  const searchPanel = searchInput.closest(".department-search-panel");
  let resultsPanel = document.querySelector("#program-results");
  if (!resultsPanel) {
    resultsPanel = document.createElement("div");
    resultsPanel.id = "program-results";
    resultsPanel.className = "program-results";
    resultsPanel.hidden = true;
    departmentList.insertAdjacentElement("afterend", resultsPanel);
  }

  const departments = Array.from(departmentList.querySelectorAll("[data-department-item]"));
  const allPrograms = departments.flatMap((department) => {
    const departmentName = department.querySelector(".department-title")?.textContent.trim()
      || department.dataset.department
      || "Departemen";

    return Array.from(department.querySelectorAll("[data-program-row]")).map((row) => {
      const group = row.closest("[data-level-group]");
      const level = group?.querySelector(".program-level-heading")?.textContent.trim() || "Jenjang tidak dicantumkan";
      const name = row.querySelector(".program-name")?.textContent.trim() || row.textContent.trim();
      const sourceSearch = row.dataset.search || "";
      return { row, department, departmentName, level, name, sourceSearch };
    });
  });

  const normalize = (value) => String(value || "")
    .toLocaleLowerCase("id-ID")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const makeResultCard = (program) => {
    const card = document.createElement("article");
    card.className = "program-result-card";

    const details = document.createElement("div");
    details.className = "program-result-details";

    const title = document.createElement("h3");
    title.className = "program-result-name";
    title.textContent = program.name;

    const level = document.createElement("p");
    level.className = "program-result-level";
    level.textContent = program.level;

    const department = document.createElement("span");
    department.className = "program-result-department";
    department.textContent = program.departmentName;

    details.append(title, level);
    card.append(details, department);
    return card;
  };

  const filterPrograms = () => {
    const query = normalize(searchInput.value);
    const selectedLevel = normalize(levelFilter.value);
    const isSearching = Boolean(query || selectedLevel);

    const matches = allPrograms.filter((program) => {
      const haystack = normalize(`${program.name} ${program.level} ${program.departmentName} ${program.sourceSearch}`);
      const matchesQuery = !query || haystack.includes(query);
      const matchesLevel = !selectedLevel || normalize(program.level) === selectedLevel;
      return matchesQuery && matchesLevel;
    });

    const matchingDepartmentNames = new Set(matches.map((program) => program.departmentName));
    searchPanel?.classList.toggle("is-searching", isSearching);

    // Mode default: daftar departemen accordion, program ditampilkan per jenjang dalam grid.
    departmentList.hidden = isSearching;
    resultsPanel.hidden = !isSearching || matches.length === 0;
    resultsPanel.replaceChildren();

    if (isSearching && matches.length) {
      matches.forEach((program) => resultsPanel.appendChild(makeResultCard(program)));
    }

    // Saat tidak ada filter, seluruh isi accordion dipulihkan tanpa mengubah pilihan buka/tutup pengguna.
    if (!isSearching) {
      departments.forEach((department) => {
        department.hidden = false;
        department.querySelectorAll("[data-level-group], [data-program-row]").forEach((item) => {
          item.hidden = false;
        });
      });
    }

    const visibleDepartments = matchingDepartmentNames.size;
    if (isSearching) {
      countLabel.textContent = matches.length
        ? `${matches.length} program studi ditemukan · ${visibleDepartments} departemen`
        : "Tidak ada program studi yang cocok";
    } else {
      countLabel.textContent = `${allPrograms.length} program tersedia · ${departments.length} departemen`;
    }

    if (emptyState) {
      emptyState.hidden = !isSearching || matches.length > 0;
      emptyState.textContent = "Tidak ada program yang cocok. Coba kata kunci atau jenjang pendidikan lain.";
    }
  };

  searchInput.addEventListener("input", filterPrograms);
  levelFilter.addEventListener("change", filterPrograms);

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      levelFilter.value = "";
      filterPrograms();
      searchInput.focus();
    });
  }

  filterPrograms();
});
