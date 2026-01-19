export default class ProductUI {
  constructor() {
    this.productsGrid = document.getElementById("products-grid");
    this.productsCount = document.getElementById("products-count");
  }
  setActiveGrade(grade) {
    const allBtns = document.querySelectorAll(".nutri-score-filter");
    allBtns.forEach((btn) => {
      btn.classList.remove(
        "active",
        "bg-gradient-to-r",
        "from-emerald-500",
        "to-teal-500",
        "text-white",
        "shadow-xl",
        "ring-4",
        "ring-emerald-200",
        "scale-105",
        "font-bold",
      );
      btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
    });

    const activeBtn = document.querySelector(
      `.nutri-score-filter[data-grade="${grade}"]`,
    );
    if (activeBtn) {
      activeBtn.classList.remove(
        "bg-gray-100",
        "text-gray-700",
        "hover:bg-gray-200",
      );
      activeBtn.classList.add(
        "active",
        "bg-gradient-to-r",
        "from-emerald-500",
        "to-teal-500",
        "text-white",
        "shadow-xl",
        "ring-4",
        "ring-emerald-200",
        "scale-105",
        "font-bold",
      );
    }
  }

  showProductsLoading() {
    this.productsGrid.innerHTML = `
      <div class="col-span-full flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    `;
    this.productsCount.textContent = "Loading...";
  }

  renderProducts(products) {
    this.productsGrid.innerHTML = "";

    if (!products.length) {
      this.renderEmptyState();
      return;
    }

    products.forEach((product) => {
      this.productsGrid.innerHTML += `
        <div
          class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
          data-barcode="${product.barcode}"
          data-grade="${product.nutritionGrade}"
        >
          <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            />

            <div
              class="absolute top-2 left-2 bg-${this.getGradeColor(
                product.nutritionGrade,
              )}-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
            >
              Nutri-Score ${product.nutritionGrade.toUpperCase()}
            </div>

            <div
              class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
              title="NOVA ${product.novaGroup}"
            >
              ${product.novaGroup}
            </div>
          </div>

          <div class="p-4">
            <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
              ${product.brand}
            </p>

            <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
              ${product.name}
            </h3>

            <div class="grid grid-cols-4 gap-1 text-center">
              <div class="bg-emerald-50 rounded p-1.5">
                <p class="text-xs font-bold text-emerald-700">
                  ${product.nutrients.protein}g
                </p>
                <p class="text-[10px] text-gray-500">Protein</p>
              </div>

              <div class="bg-blue-50 rounded p-1.5">
                <p class="text-xs font-bold text-blue-700">
                  ${product.nutrients.carbs}g
                </p>
                <p class="text-[10px] text-gray-500">Carbs</p>
              </div>

              <div class="bg-purple-50 rounded p-1.5">
                <p class="text-xs font-bold text-purple-700">
                  ${product.nutrients.fat}g
                </p>
                <p class="text-[10px] text-gray-500">Fat</p>
              </div>

              <div class="bg-orange-50 rounded p-1.5">
                <p class="text-xs font-bold text-orange-700">
                  ${product.nutrients.sugar}g
                </p>
                <p class="text-[10px] text-gray-500">Sugar</p>
              </div>
            </div>
              <button
    class="log-meal-button w-full text-sm font-semibold mt-4 pb text-emerald-700 border border-emerald-200 rounded-lg py-2 hover:bg-emerald-50 transition"
    data-barcode="${product.barcode}"
  >
    <i class="fa-solid fa-plus"></i> Log This Meal
  </button>
          </div>
        </div>
      `;
    });

    this.productsCount.textContent = `Showing ${products.length} products`;
  }

  renderEmptyState() {
    this.productsGrid.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i class="fa-solid fa-box-open text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500 text-lg">No Product found</p>
        <p class="text-gray-400 text-sm mt-2">
          Try searching for something else
        </p>
      </div>
    `;

    this.productsCount.textContent = "0 products";
  }

  getGradeColor(grade) {
    const colors = {
      a: "green",
      b: "lime",
      c: "yellow",
      d: "orange",
      e: "red",
    };
    return colors[grade] || "gray";
  }
}
