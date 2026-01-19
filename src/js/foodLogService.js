export default class FoodLogService {
  constructor() {
    this.storageKey = "foodLog";
    this.weeklyKey = "weeklyCalories";
  }

  getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  }

  getAllItems() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addItem(item) {
    const items = this.getAllItems();
    item.id = Date.now();
    item.date = this.getTodayDate(); 
    items.push(item);
    
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    
    this.saveTodayCalories();
    
    window.dispatchEvent(new Event("foodLogUpdated"));
  }

  deleteItem(id) {
    let items = this.getAllItems();
    items = items.filter(item => item.id !== id);
    
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    
    this.saveTodayCalories();
    
    window.dispatchEvent(new Event("foodLogUpdated"));
  }

  clearAll() {
    localStorage.setItem(this.storageKey, JSON.stringify([]));
    
    this.saveTodayCalories();
    
    window.dispatchEvent(new Event("foodLogUpdated"));
  }

  saveTodayCalories() {
    const today = this.getTodayDate();  
    const items = this.getAllItems();   

    let totalCalories = 0;
    
    items.forEach(item => {
      if (item.date === today) { 
        totalCalories += item.calories || 0;
      }
    });
    
    const weeklyData = this.getWeeklyCalories();
    
    weeklyData[today] = totalCalories;
    
    localStorage.setItem(this.weeklyKey, JSON.stringify(weeklyData));
  }

  getWeeklyCalories() {
    const data = localStorage.getItem(this.weeklyKey);
    return data ? JSON.parse(data) : {};
  }

  getCaloriesForDate(date) {
    const weeklyData = this.getWeeklyCalories();
    return weeklyData[date] || 0;
  }
}