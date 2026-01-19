export default class MealsAPI {
  constructor() {
    this.baseURL = "https://nutriplan-api.vercel.app/api";
  }

  async getCountries() {
    const res = await fetch(`${this.baseURL}/meals/areas`);
    return res.json();
  }

  async getCategories() {
    const res = await fetch(`${this.baseURL}/meals/categories`);
    return res.json();
  }

  async getRandomMeals(count = 24) {
    const res = await fetch(`${this.baseURL}/meals/random?count=${count}`);
    return res.json();
  }

  async filterByCategory(category, page = 1, limit = 25) {
    const res = await fetch(
      `${this.baseURL}/meals/filter?category=${category}&page=${page}&limit=${limit}`,
    );
    return res.json();
  }

  async filterByCountry(area, page = 1, limit = 25) {
    const res = await fetch(
      `${this.baseURL}/meals/filter?area=${area}&page=${page}&limit=${limit}`,
    );
    return res.json();
  }
  async searchMeals(query, page = 1, limit = 25) {
    const res = await fetch(
      `${this.baseURL}/meals/search?q=${query}&page=${page}&limit=${limit}`,
    );
    return res.json();
  }
  async getMealById(id) {
    const res = await fetch(`${this.baseURL}/meals/${id}`);
    return res.json();
  }
}
