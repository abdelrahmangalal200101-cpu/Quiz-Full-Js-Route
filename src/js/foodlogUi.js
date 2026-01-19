import FoodLogService from "./foodLogService.js";

export default class FoodLogUI {
  constructor(sectionManager) {
    this.foodLogService = new FoodLogService();
    this.sectionManager = sectionManager;

    this.loggedItemsList = document.getElementById("logged-items-list");
    this.clearBtn = document.getElementById("clear-foodlog");
    this.dateElement = document.getElementById("foodlog-date");

    this.init();
  }

  init() {
    this.updateDate();
    this.render();
    this.setupClearButton();
    this.setupQuickActions();
    this.renderWeeklyChart();

    window.addEventListener("foodLogUpdated", () => {
      this.render();
      this.renderWeeklyChart();
    });
  }

  setupQuickActions() {
    const quickBtns = document.querySelectorAll(".quick-log-btn");
    
    quickBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        if (index === 0) {
          this.sectionManager.show([
            "search-filters-section",
            "meal-categories-section",
            "all-recipes-section",
          ]);
          
          const mealsTab = document.querySelector('[data-section="meals"]');
          if (mealsTab) mealsTab.click();
          
        } else if (index === 1) {
          this.sectionManager.show("products-section");
          
          const productsTab = document.querySelector('[data-section="products"]');
          if (productsTab) productsTab.click();
        }
      });
    });
  }

  renderWeeklyChart() {
    const weeklyData = this.getWeeklyData();
    const chartContainer = document.getElementById('weekly-chart');
    
    chartContainer.innerHTML = `
      <div class="grid grid-cols-7 gap-4 text-center">
        ${weeklyData.map(day => `
          <div class="flex flex-col items-center">
            <p class="text-sm font-semibold text-gray-700 mb-1">${day.day}</p>
            <span class="text-lg font-bold text-emerald-600">${day.calories}</span>
            <span class="text-xs text-gray-400">cal</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  getWeeklyData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const today = new Date();
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dateString = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      
      const calories = this.foodLogService.getCaloriesForDate(dateString);
      
      last7Days.push({ day: dayName, calories });
    }
    
    return last7Days;
  }

  updateDate() {
    const today = new Date();
    this.dateElement.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  setupClearButton() {
    this.clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all items?")) {
        this.foodLogService.clearAll();
        this.render();
      }
    });
  }

  render() {
    const items = this.foodLogService.getAllItems();

    if (items.length === 0) {
      this.showEmptyState();
      this.clearBtn.style.display = "none";
      this.updateProgressBars(0, 0, 0, 0);
      this.updateCount(0);
      return;
    }

    this.clearBtn.style.display = "block";
    this.showItems(items);
    this.updateCount(items.length);

    const totals = this.getTotals(items);
    this.updateProgressBars(
      totals.calories,
      totals.protein,
      totals.carbs,
      totals.fat,
    );
  }

  showEmptyState() {
    this.loggedItemsList.innerHTML = `
      <div class="text-center py-12 text-gray-500">
        <i class="fa-solid fa-utensils text-5xl mb-4 text-gray-300"></i>
        <p class="font-semibold text-lg">No meals logged today</p>
        <p class="text-sm mt-2">Add meals from the Meals page or scan products</p>
      </div>
    `;
  }

  showItems(items) {
    this.loggedItemsList.innerHTML = "";

    items.forEach((item) => {
      const isProduct = item.type === "product";
      const icon = isProduct ? "box" : "utensils";
      const color = isProduct ? "teal" : "emerald";

      const itemHTML = `
        <div class="bg-white rounded-xl p-4 border-2 border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center">
                <i class="fa-solid fa-${icon} text-${color}-600 text-xl"></i>
              </div>
              <div>
                <p class="font-bold text-gray-900">${item.name}</p>
                <p class="text-sm text-gray-500">${item.servings} serving(s)</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p class="text-sm font-bold text-emerald-700">${item.calories}</p>
                  <p class="text-xs text-gray-400">cal</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-blue-700">${item.protein}g</p>
                  <p class="text-xs text-gray-400">pro</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-amber-700">${item.carbs}g</p>
                  <p class="text-xs text-gray-400">carb</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-purple-700">${item.fat}g</p>
                  <p class="text-xs text-gray-400">fat</p>
                </div>
              </div>
              
              <button class="delete-btn text-red-500 hover:text-red-600 p-2" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      this.loggedItemsList.innerHTML += itemHTML;
    });

    this.setupDeleteButtons();
  }

  setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Delete this item?")) {
          const id = parseInt(btn.dataset.id);
          this.foodLogService.deleteItem(id);
          this.render();
        }
      });
    });
  }

  getTotals(items) {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    items.forEach((item) => {
      calories += item.calories || 0;
      protein += item.protein || 0;
      carbs += item.carbs || 0;
      fat += item.fat || 0;
    });

    return { calories, protein, carbs, fat };
  }

  updateProgressBars(calories, protein, carbs, fat) {
    this.updateBar("calories", calories, 2000, "kcal");
    this.updateBar("protein", protein, 150, "g");
    this.updateBar("carbs", carbs, 250, "g");
    this.updateBar("fat", fat, 65, "g");
  }

  updateBar(nutrient, current, goal, unit) {
    const container = document.querySelector(`[data-nutrient="${nutrient}"]`);
    if (!container) return;

    const percentage = Math.min((current / goal) * 100, 100);

    const text = container.querySelector(".nutrient-text");
    const bar = container.querySelector(".nutrient-bar");

    if (text) text.textContent = `${Math.round(current)} / ${goal} ${unit}`;
    if (bar) bar.style.width = `${percentage}%`;
  }

  updateCount(count) {
    const header = document.querySelector("#foodlog-today-section h4");
    if (header) header.textContent = `Logged Items (${count})`;
  }
}