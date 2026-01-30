import { NewRecipe, Recipe, RecipeUpdate } from '@/app/types/Recipe';

class RecipeService {
  private recipes: Recipe[] = [];
  private nextId = 1;
  private listeners: Array<() => void> = [];

  // Voeg listener toe voor state updates
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify alle listeners
  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // CREATE
  async create(newRecipe: NewRecipe): Promise<{ success: boolean; recipe?: Recipe; errors?: string[] }> {
    const errors: string[] = [];
    if (!newRecipe.title?.trim()) errors.push('Titel is verplicht');
    if (!newRecipe.ingredients?.length) errors.push('Minimaal 1 ingrediënt nodig');
    if (newRecipe.prepTime <= 0) errors.push('Bereidingstijd moet positief zijn');

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const recipe: Recipe = {
      ...newRecipe,
      id: `recipe_${Date.now()}_${this.nextId++}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.recipes.push(recipe);
    this.notify(); // <- BELANGRIJK: Notify listeners
    console.log('Recipe created:', recipe.title);
    return { success: true, recipe };
  }

  // READ ALL
  async getAll(): Promise<Recipe[]> {
    // Voeg voorbeeld recepten toe als er geen zijn
    if (this.recipes.length === 0) {
      this.recipes = [
        {
          id: '1',
          title: 'Spaghetti Bolognese',
          description: 'Klassieke Italiaanse pasta',
          ingredients: ['300g spaghetti', '500g gehakt', '1 ui'],
          instructions: '1. Fruit ui\n2. Bak gehakt\n3. Serveer',
          prepTime: 30,
          difficulty: 'easy',
          category: 'Pasta',
          serves: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];
    }
    return [...this.recipes];
  }

  // READ ONE
  async getById(id: string): Promise<Recipe | null> {
    return this.recipes.find(r => r.id === id) || null;
  }

  // UPDATE
  async update(id: string, updates: RecipeUpdate): Promise<{ success: boolean; recipe?: Recipe; errors?: string[] }> {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, errors: ['Recept niet gevonden'] };
    }

    // Validatie
    if (updates.title?.trim() === '') {
      return { success: false, errors: ['Titel mag niet leeg zijn'] };
    }

    this.recipes[index] = {
      ...this.recipes[index],
      ...updates,
      updatedAt: new Date(),
      id: this.recipes[index].id,
      createdAt: this.recipes[index].createdAt,
    };

    this.notify(); // <- BELANGRIJK: Notify listeners
    console.log('Recipe updated:', this.recipes[index].title);
    return { success: true, recipe: this.recipes[index] };
  }

  // DELETE
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    const initialLength = this.recipes.length;
    this.recipes = this.recipes.filter(r => r.id !== id);
    
    if (this.recipes.length < initialLength) {
      this.notify(); // <- BELANGRIJK: Notify listeners
      return { success: true, message: 'Recept verwijderd' };
    }
    return { success: false, message: 'Recept niet gevonden' };
  }

  // SEARCH
  async search(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase();
    return this.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Laad data
  async loadFromStorage(): Promise<void> {
    console.log('Loading recipes from storage...');
  }
}

export default new RecipeService();