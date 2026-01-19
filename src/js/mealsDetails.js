export default class MealDetailsUI {
  constructor() {
    this.section = document.getElementById("meal-details");
    this.backBtn = document.getElementById("back-to-meals-btn");

    this.heroImg = document.getElementById("meal-hero-img");
    this.title = document.getElementById("meal-title");
    this.category = document.getElementById("meal-category");
    this.area = document.getElementById("meal-area");
    this.tagsContainer = document.getElementById("meal-tags");

    this.ingredientsContainer = document.getElementById("ingredients-container");
    this.instructionsContainer = document.getElementById("instructions-container");
    this.video = document.getElementById("meal-video");
    
    this.heroCalories = document.getElementById("hero-calories");
    this.heroServings = document.getElementById("hero-servings");
    this.nutritionContainer = document.getElementById("nutrition-facts-container");

    this.apiUrl = "https://nutriplan-api.vercel.app/api/nutrition/analyze";
    this.apiKey = "IeUxgS5K2SBJV7dDoX0kYrui7YrXeuqU2yPFBnYm";
  }

  show() {
    this.section.classList.remove("hidden");
  }

  hide() {
    this.section.classList.add("hidden");
  }

  async render(meal) {
    this.heroImg.src = meal.thumbnail;
    this.heroImg.alt = meal.name;
    this.title.textContent = meal.name;
    this.category.textContent = meal.category;
    this.area.textContent = meal.area;

    this.tagsContainer.innerHTML = "";
    meal.tags?.forEach((tag) => {
      this.tagsContainer.innerHTML += `
        <span class="px-3 py-1 bg-purple-500 text-white text-sm rounded-full">
          ${tag}
        </span>
      `;
    });

    this.ingredientsContainer.innerHTML = "";
    meal.ingredients.forEach((item) => {
      this.ingredientsContainer.innerHTML += `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <input type="checkbox" class="w-5 h-5 text-emerald-600" />
          <span>
            <span class="font-medium">${item.measure}</span>
            ${item.ingredient}
          </span>
        </div>
      `;
    });

    this.instructionsContainer.innerHTML = "";
    meal.instructions.forEach((step, index) => {
      const stepDiv = document.createElement("div");
      stepDiv.className = "flex gap-4 p-4 rounded-xl hover:bg-gray-50";
      stepDiv.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
          ${index + 1}
        </div>
        <p class="pt-2 text-gray-700">
          ${step}
        </p>
      `;
      this.instructionsContainer.appendChild(stepDiv);
    });

    if (meal.youtube) {
      const videoId = meal.youtube.split("v=")[1];
      this.video.src = `https://www.youtube.com/embed/${videoId}`;
    }

    await this.loadNutrition(meal);
  }

  async loadNutrition(meal) {
    try {
      this.showNutritionLoading();

      const recipeData = this.getRecipeObject(meal);
      
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      
      console.log("API Response:", data); 
      
      if (data.success && data.data) {
        this.renderNutrition(data.data);
      } else {
        console.error("API returned unsuccessful response:", data);
        this.showNutritionError();
      }
    } catch (error) {
      console.error("Error loading nutrition:", error);
      this.showNutritionError();
    }
  }

  showNutritionLoading() {
    this.heroCalories.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    this.nutritionContainer.innerHTML = `
      <div class="text-center py-8">
        <i class="fa-solid fa-spinner fa-spin text-3xl text-emerald-600 mb-3"></i>
        <p class="text-gray-500">Calculating nutrition...</p>
      </div>
    `;
  }

  showNutritionError() {
    this.heroCalories.textContent = "N/A";
    this.nutritionContainer.innerHTML = `
      <div class="text-center py-8">
        <i class="fa-solid fa-exclamation-circle text-3xl text-red-500 mb-3"></i>
        <p class="text-gray-500">Could not calculate nutrition</p>
      </div>
    `;
  }

  renderNutrition(nutritionData) {
    if (!nutritionData || !nutritionData.perServing) {
      console.error("Invalid nutrition data:", nutritionData);
      this.showNutritionError();
      return;
    }

    const perServing = nutritionData.perServing;
    const total = nutritionData.totals;
    const servings = nutritionData.servings;

    this.heroCalories.textContent = `${Math.round(perServing.calories || 0)} cal/serving`;
    this.heroServings.textContent = `${servings || 1} servings`;

    const proteinPercent = Math.min(((perServing.protein || 0) / 50) * 100, 100);
    const carbsPercent = Math.min(((perServing.carbs || 0) / 300) * 100, 100);
    const fatPercent = Math.min(((perServing.fat || 0) / 70) * 100, 100);
    const fiberPercent = Math.min(((perServing.fiber || 0) / 30) * 100, 100);
    const sugarPercent = Math.min(((perServing.sugar || 0) / 50) * 100, 100);

    this.nutritionContainer.innerHTML = `
      <p class="text-sm text-gray-500 mb-4">Per serving</p>

      <div class="text-center py-4 mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
        <p class="text-sm text-gray-600">Calories per serving</p>
        <p class="text-4xl font-bold text-emerald-600">${Math.round(perServing.calories)}</p>
        <p class="text-xs text-gray-500 mt-1">Total: ${Math.round(total.calories)} cal</p>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span class="text-gray-700">Protein</span>
          </div>
          <span class="font-bold text-gray-900">${Math.round(perServing.protein)}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPercent}%"></div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-gray-700">Carbs</span>
          </div>
          <span class="font-bold text-gray-900">${Math.round(perServing.carbs)}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPercent}%"></div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-purple-500"></div>
            <span class="text-gray-700">Fat</span>
          </div>
          <span class="font-bold text-gray-900">${Math.round(perServing.fat)}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-purple-500 h-2 rounded-full" style="width: ${fatPercent}%"></div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <span class="text-gray-700">Fiber</span>
          </div>
          <span class="font-bold text-gray-900">${Math.round(perServing.fiber)}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-orange-500 h-2 rounded-full" style="width: ${fiberPercent}%"></div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-pink-500"></div>
            <span class="text-gray-700">Sugar</span>
          </div>
          <span class="font-bold text-gray-900">${Math.round(perServing.sugar)}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-pink-500 h-2 rounded-full" style="width: ${sugarPercent}%"></div>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">
          Vitamins & Minerals (% Daily Value)
        </h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Vitamin A</span>
            <span class="font-medium">15%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Vitamin C</span>
            <span class="font-medium">25%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Calcium</span>
            <span class="font-medium">4%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Iron</span>
            <span class="font-medium">12%</span>
          </div>
        </div>
      </div>
    `;

    this.currentNutritionData = nutritionData;
  }

  getRecipeObject(meal) {
    return {
      recipeName: meal.name,
      ingredients: meal.ingredients.map((item) => {
        return `${item.measure} ${item.ingredient}`.trim();
      }),
    };
  }
}