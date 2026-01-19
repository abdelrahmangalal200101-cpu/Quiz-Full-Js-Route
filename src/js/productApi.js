export default class ProductApi {
  constructor() {
    this.baseURL = "https://nutriplan-api.vercel.app/api/products";
  }

  async getSearchMeal(name, page = 1, limit = 24) {
    const res = await fetch(
      `${this.baseURL}/search?q=${name}&page=${page}&limit=${limit}`,
    );
    if (!res.ok) {
      throw new Error("SEARCH_API_ERROR");
    }

    return res.json();
  }

  async getBarcoodMeal(barcode) {
    const res = await fetch(`${this.baseURL}/barcode/${barcode}`);
    if (!res.ok) {
      throw new Error("BARCODE_API_ERROR");
    }

    return res.json();
  }

  async getProductByCat(cat) {
    const res = await fetch(`${this.baseURL}/category/${cat}`);
    if (!res.ok) {
      throw new Error("Cat Feh Moshkla");
    }
    return res.json();
  }
}
