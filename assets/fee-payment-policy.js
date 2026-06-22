const wrapper = document.getElementById("yearSelectWrapper");
const btn = document.getElementById("yearSelectBtn");
const dropdown = document.getElementById("yearDropdown");
const label = document.getElementById("yearSelectLabel");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  wrapper.classList.toggle("open");
});

dropdown.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    dropdown
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("active"));
    item.classList.add("active");
    label.textContent = item.dataset.year;
    wrapper.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!wrapper.contains(e.target)) {
    wrapper.classList.remove("open");
  }
});

// ---- Tab switching ----
const tabLinks = document.querySelectorAll(".policy-tabs a");
const tabPanels = document.querySelectorAll(".tab-panel");

tabLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.tab;

    tabLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${target}`);
    });
  });
});
