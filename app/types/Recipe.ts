export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  serves: number;
  imageUri?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NewRecipe = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
export type RecipeUpdate = Partial<NewRecipe>;