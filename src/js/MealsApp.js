import MealsAPI from "./mealsApi.js";
import MealsUI from "./TempMeal.js";
import MealDetailsUI from "./mealsDetails.js";
import FoodLogger from "./foodLoggerMeal.js"; 


export default class MealsApp {
  constructor(sectionManager) {
    this.api = new MealsAPI();
    this.ui = new MealsUI();
    this.mealDetailsUI = new MealDetailsUI();
    this.sectionManager = sectionManager;
    this.foodLogger = new FoodLogger(this.mealDetailsUI);
  }

  async init() {
    try {
      const countries = await this.api.getCountries();
      if (countries?.results) {
        this.ui.renderCountries(countries.results);
      }

      const categories = await this.api.getCategories();
      if (categories?.results) {
        this.ui.renderCategories(categories.results);
      }

      const meals = await this.api.getRandomMeals();
      if (meals?.results) {
        this.ui.renderRecipes(meals.results);
      }

      this.handleEvents();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }

  handleEvents() {
    if (this.ui.searchInput) {
      this.ui.searchInput.addEventListener("input", async (e) => {
        const searchValue = e.target.value.trim();

        if (searchValue.length === 0) {
          const data = await this.api.getRandomMeals();
          if (data?.results) {
            this.ui.renderRecipes(data.results);
          }
          return;
        }

        try {
          this.ui.showRecipesLoading();
          const data = await this.api.searchMeals(searchValue);
          if (data?.results && data.results.length > 0) {
            this.ui.renderRecipes(data.results);
          } else {
            this.ui.recipesGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
              </div>
              <p class="text-gray-500 text-lg">No recipes found</p>
              <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
            </div>
          `;
            this.ui.recipesCount.textContent = "Showing 0 recipes";
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      });
    }

    this.ui.countriesContainer.addEventListener("click", async (e) => {
      const country = e.target.dataset.country;
      if (!country) return;

      this.ui.setActiveCountry(country);
      this.ui.showRecipesLoading();

      try {
        if (country === "all") {
          const data = await this.api.getRandomMeals();
          if (data?.results) {
            this.ui.renderRecipes(data.results);
          }
        } else {
          const data = await this.api.filterByCountry(country);
          if (data?.results) {
            this.ui.renderRecipes(data.results);
          }
        }
      } catch (error) {
        console.error("Error filtering by country:", error);
      }
    });

    this.ui.categoriesGrid.addEventListener("click", async (e) => {
      const card = e.target.closest(".category-card");
      if (!card) return;

      const category = card.dataset.category;
      this.ui.setActiveCategory(category);
      this.ui.showRecipesLoading();

      try {
        const data = await this.api.filterByCategory(category);
        if (data?.results) {
          this.ui.renderRecipes(data.results);
        }
      } catch (error) {
        console.error("Error filtering by category:", error);
      }
    });

    this.ui.recipesGrid.addEventListener("click", async (e) => {
      const card = e.target.closest(".recipe-card");
      if (!card) return;

      const mealId = card.dataset.mealId;

      try {
        const data = await this.api.getMealById(mealId);

        if (!data?.result) return;

        this.sectionManager.show("meal-details");

        this.mealDetailsUI.show();
        this.mealDetailsUI.render(data.result);
      } catch (error) {
        console.error("Error loading meal details:", error);
      }
    });

    this.mealDetailsUI.backBtn.addEventListener("click", () => {
      this.mealDetailsUI.hide();

      this.sectionManager.show([
        "search-filters-section",
        "meal-categories-section",
        "all-recipes-section",
      ]);
    });
  }
}
