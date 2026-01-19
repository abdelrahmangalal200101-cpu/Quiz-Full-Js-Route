import ProductApi from "./ProductApi.js";
import ProductUI from "./productUi.js";
import FoodLogService from "./foodLogService.js";

export default class ProductApp {
  constructor() {
    this.api = new ProductApi();
    this.ui = new ProductUI();
    this.foodLogService = new FoodLogService();

    this.searchInput = document.getElementById("product-search-input");
    this.searchBtn = document.getElementById("search-product-btn");

    this.barcodeInput = document.getElementById("barcode-input");
    this.barcodeBtn = document.getElementById("lookup-barcode-btn");

    this.currentProducts = [];

    this.addEvents();
  }

  addEvents() {
    this.searchBtn.addEventListener("click", () => {
      const value = this.searchInput.value.trim();
      if (!value) return;

      this.searchByName(value);
    });

    this.barcodeBtn.addEventListener("click", () => {
      const value = this.barcodeInput.value.trim();
      if (!value) return;

      this.searchByBarcode(value);
    });

    document.querySelectorAll(".nutri-score-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterByGrade(btn.dataset.grade);
      });
    });
    document.querySelectorAll(".product-category-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        this.ui.showProductsLoading();
        const category = btn.dataset.category;
        const data = await this.api.getProductByCat(category);
        this.currentProducts = data.results || [];
        this.ui.renderProducts(this.currentProducts);
      });
    });
    this.ui.productsGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".log-meal-button");
      if (!btn) return;

      const barcode = btn.dataset.barcode;
      const product = this.currentProducts.find((p) => p.barcode === barcode);

      if (product) {
        this.logProduct(product);
      }
    });
  }

  async logProduct(product) {
    const servings = 1;
    const logItem = {
      type: "product",
      name: product.name,
      brand: product.brand,
      servings: servings,
      calories: Math.round(product.nutrients.calories * servings),
      protein: Math.round(product.nutrients.protein * servings),
      carbs: Math.round(product.nutrients.carbs * servings),
      fat: Math.round(product.nutrients.fat * servings),
      perServing: product.nutrients,
      barcode: product.barcode,
      image: product.image,
      nutritionGrade: product.nutritionGrade,
    };

    this.foodLogService.addItem(logItem);

    Swal.fire({
      icon: "success",
      title: "Product Logged!",
      text: `${product.name} added successfully`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  async searchByName(name) {
    this.ui.showProductsLoading();

    const data = await this.api.getSearchMeal(name);

    this.currentProducts = data.results || [];
    this.ui.renderProducts(this.currentProducts);
  }

  async searchByBarcode(barcode) {
    this.ui.showProductsLoading();

    const product = await this.api.getBarcoodMeal(barcode);

    this.currentProducts = product.result ? [product.result] : [];
    this.ui.renderProducts(this.currentProducts);
  }

  filterByGrade(grade) {
    this.ui.setActiveGrade(grade);
    this.ui.showProductsLoading();

    if (!grade) {
      this.ui.renderProducts(this.currentProducts);
      return;
    }

    const filtered = this.currentProducts.filter(
      (p) => p.nutritionGrade === grade,
    );

    this.ui.renderProducts(filtered);
  }
}
