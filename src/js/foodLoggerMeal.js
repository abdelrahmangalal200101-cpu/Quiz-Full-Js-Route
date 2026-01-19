import FoodLogService from "./foodLogService.js";

export default class FoodLogger {
  constructor(mealDetailsUI) {
    this.mealDetailsUI = mealDetailsUI;
    this.foodLogService = new FoodLogService();

    this.init();
  }

  init() {
    const logMealBtn = document.getElementById("log-meal-btn");

    logMealBtn.addEventListener("click", async () => {
      this.showServingsModal();
    });
  }

  showServingsModal() {
    const modalHTML = `
      <div id="servings-modal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all animate-slideUp">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i class="fa-solid fa-utensils text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Log This Meal</h3>
            <p class="text-gray-500">How many servings did you have?</p>
          </div>
          
          <!-- Input -->
          <div class="mb-6">
            <div class="relative">
              <input 
                type="number" 
                id="servings-input" 
                class="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-center text-3xl font-bold text-gray-900 transition-all"
                value="1"
                min="0.5"
                max="20"
                step="0.5"
              />
              <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                
              </div>
            </div>
            <div class="flex justify-center gap-2 mt-3">
              <button class="serving-quick-btn px-4 py-2 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl text-sm font-semibold transition" data-value="0.5">½</button>
              <button class="serving-quick-btn px-4 py-2 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl text-sm font-semibold transition" data-value="1">1</button>
              <button class="serving-quick-btn px-4 py-2 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl text-sm font-semibold transition" data-value="2">2</button>
              <button class="serving-quick-btn px-4 py-2 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl text-sm font-semibold transition" data-value="3">3</button>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="flex gap-3">
            <button 
              id="cancel-servings" 
              class="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all hover:scale-105"
            >
              <i class="fa-solid fa-xmark mr-2"></i>Cancel
            </button>
            <button 
              id="confirm-servings" 
              class="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              <i class="fa-solid fa-check mr-2"></i>Confirm
            </button>
          </div>
        </div>
      </div>

      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      </style>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("servings-modal");
    const cancelBtn = document.getElementById("cancel-servings");
    const confirmBtn = document.getElementById("confirm-servings");
    const servingsInput = document.getElementById("servings-input");
    const quickBtns = document.querySelectorAll(".serving-quick-btn");

    quickBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        servingsInput.value = btn.dataset.value;
        servingsInput.focus();
      });
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    cancelBtn.addEventListener("click", () => {
      modal.remove();
    });

    const escHandler = (e) => {
      if (e.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);

    confirmBtn.addEventListener("click", async () => {
      const servings = parseFloat(servingsInput.value);
      
      if (servings <= 0 || isNaN(servings)) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Input",
          text: "Please enter a valid number of servings",
          confirmButtonColor: "#10b981"
        });
        return;
      }

      modal.remove();
      document.removeEventListener("keydown", escHandler);
      await this.logMealWithServings(servings);
    });

    servingsInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        confirmBtn.click();
      }
    });

    servingsInput.focus();
    servingsInput.select();
  }

async logMealWithServings(servings) {
  try {
    const nutritionData = this.mealDetailsUI.currentNutritionData;
    
    if (!nutritionData) {
      throw new Error("Nutrition data not available");
    }

    const logItem = {
      type: "meal",
      name: nutritionData.recipeName,
      servings: servings,
      calories: Math.round(nutritionData.perServing.calories * servings),
      protein: Math.round(nutritionData.perServing.protein * servings),
      carbs: Math.round(nutritionData.perServing.carbs * servings),
      fat: Math.round(nutritionData.perServing.fat * servings),
      perServing: nutritionData.perServing,
      originalServings: nutritionData.servings
    };

    this.foodLogService.addItem(logItem);

    Swal.fire({
      icon: "success",
      title: "Meal Logged!",
      text: `${servings} serving(s) added successfully`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

  } catch (err) {
    console.error("Error:", err);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to log meal. Please try again.",
      confirmButtonColor: "#10b981"
    });
  }
}
}