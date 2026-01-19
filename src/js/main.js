import MealsApp from "./MealsApp.js";
import ProductApp from "./productApp.js";
import FoodLogUI from "./foodlogUi.js";

const tabs = document.querySelectorAll(".nav-link");
const Sections = document.querySelectorAll("section");
const loadingOverlay = document.getElementById("app-loading-overlay");


function showLoading() {
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex";
  }
}

function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.style.display = "none";
  }
}


class Sidebarnavmanager {
  constructor() {
    this.sections = document.querySelectorAll("section");
  }

  show(ids) {
    this.sections.forEach((section) =>
      section.classList.add("hidden")
    );

    if (Array.isArray(ids)) {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("hidden");
      });
    } else {
      const el = document.getElementById(ids);
      if (el) el.classList.remove("hidden");
    }
  }
}

const sectionManager = new Sidebarnavmanager();



tabs.forEach((tab) => {
  tab.addEventListener("click", function (e) {
    e.preventDefault();
    const targetSection = tab.dataset.section;
    if (targetSection === "meals") {
      sectionManager.show([
        "search-filters-section",
        "meal-categories-section",
        "all-recipes-section",
      ]);
    } else if (targetSection === "products") {
      sectionManager.show("products-section");
    } else if (targetSection === "foodlog") {
      sectionManager.show("foodlog-section");
    }
    localStorage.setItem("activeTab", targetSection);

    tabs.forEach((t) => {
      t.classList.remove("bg-emerald-50", "text-emerald-700");
      t.classList.add("text-gray-600");
    });

    tab.classList.add("bg-emerald-50", "text-emerald-700");
    tab.classList.remove("text-gray-600");
  });
});

const savedTab = localStorage.getItem("activeTab") || "meals";

tabs.forEach((tab) => {
  if (tab.dataset.section === savedTab) {
    tab.click();
  }
});

if (!localStorage.getItem("activeTab")) {
  sectionManager.show([
    "search-filters-section",
    "meal-categories-section",
    "all-recipes-section",
  ]);
}

showLoading();

const mealsApp = new MealsApp(sectionManager);
const productApp = new ProductApp(); 
const foodloguiapp = new FoodLogUI(sectionManager);

mealsApp.init().then(() => {
  hideLoading();
});