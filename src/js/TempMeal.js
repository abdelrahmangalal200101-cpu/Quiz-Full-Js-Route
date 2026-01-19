const CATEGORY_ICONS = {
  Beef: "fa-drumstick-bite",
  Chicken: "fa-drumstick-bite",
  Dessert: "fa-ice-cream",
  Lamb: "fa-cow",
  Miscellaneous: "fa-box-open",
  Pasta: "fa-bowl-food",
  Pork: "fa-bacon",
  Seafood: "fa-fish",
  Side: "fa-plate-wheat",
  Starter: "fa-utensils",
  Vegan: "fa-seedling",
  Vegetarian: "fa-leaf",
};

const DEFAULT_ICON = "fa-utensils";

export default class MealsUI {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.countriesContainer = document.getElementById("Countries-Btns");
    this.categoriesGrid = document.getElementById("categories-grid");
    this.recipesGrid = document.getElementById("recipes-grid");
    this.recipesCount = document.getElementById("recipes-count");
  }

  renderCountries(countries) {
    this.countriesContainer.innerHTML = `
    <button
      data-country="all"
      class="country-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all active"
    >
      All Recipes
    </button>
  `;

    countries.forEach((country) => {
      this.countriesContainer.innerHTML += `
      <button
        data-country="${country.name}"
        class="country-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
      >
        ${country.name}
      </button>
    `;
    });
  }

  setActiveCountry(countryName) {
    const allBtns = this.countriesContainer.querySelectorAll(".country-btn");
    allBtns.forEach((btn) => {
      btn.classList.remove("active", "bg-emerald-600", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-700");
    });

    const activeBtn = this.countriesContainer.querySelector(
      `[data-country="${countryName}"]`,
    );
    if (activeBtn) {
      activeBtn.classList.remove("bg-gray-100", "text-gray-700");
      activeBtn.classList.add("active", "bg-emerald-600", "text-white");
    }
  }

  renderCategories(categories) {
    this.categoriesGrid.innerHTML = "";

    categories.forEach((cat) => {
      const icon = CATEGORY_ICONS[cat.name] || DEFAULT_ICON;

      this.categoriesGrid.innerHTML += `
      <div
        class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
        data-category="${cat.name}"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
          >
            <i class="fa-solid ${icon}"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">
              ${cat.name}
            </h3>
          </div>
        </div>
      </div>
    `;
    });
  }

  setActiveCategory(categoryName) {
    const allCards = this.categoriesGrid.querySelectorAll(".category-card");
    allCards.forEach((card) => {
      card.classList.remove(
        "active",
        "border-emerald-600",
        "shadow-lg",
        "bg-gradient-to-br",
      );
      card.classList.add(
        "bg-gradient-to-br",
        "from-emerald-50",
        "to-teal-50",
        "border-emerald-200",
      );
    });

    const activeCard = this.categoriesGrid.querySelector(
      `[data-category="${categoryName}"]`,
    );
    if (activeCard) {
      activeCard.classList.remove(
        "from-emerald-50",
        "to-teal-50",
        "border-emerald-200",
      );
      activeCard.classList.add(
        "active",
        "from-emerald-100",
        "to-teal-100",
        "border-emerald-600",
        "shadow-lg",
      );
    }
  }

  renderRecipes(meals) {
    this.recipesGrid.innerHTML = "";

    meals.forEach((meal) => {
      this.recipesGrid.innerHTML += `
      <div
        class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        data-meal-id="${meal.idMeal || meal.id}"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src="${meal.thumbnail}"
            alt="${meal.name}"
            loading="lazy"
          />
          <div class="absolute bottom-3 left-3 flex gap-2">
            <span
              class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
            >
              ${meal.category}
            </span>
            <span
              class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
            >
              ${meal.area}
            </span>
          </div>
        </div>
        <div class="p-4">
          <h3
            class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
          >
            ${meal.name}
          </h3>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">
            ${meal.instructions}
          </p>
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-gray-900">
              <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
              ${meal.category}
            </span>
            <span class="font-semibold text-gray-500">
              <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
              ${meal.area}
            </span>
          </div>
        </div>
      </div>
    `;
    });

    this.recipesCount.textContent = `Showing ${meals.length} recipes`;
  }
  showRecipesLoading() {
    this.recipesGrid.innerHTML = `
    <div class="col-span-full flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  `;
    this.recipesCount.textContent = "Loading...";
  }
}
