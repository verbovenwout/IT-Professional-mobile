import RecipeService from '@/app/services/RecipeService';
import { Recipe } from '@/app/types/Recipe';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function EditRecipe() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [category, setCategory] = useState('');
  const [serves, setServes] = useState('');

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    if (typeof id === 'string') {
      const foundRecipe = await RecipeService.getById(id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setTitle(foundRecipe.title);
        setDescription(foundRecipe.description);
        setIngredients(foundRecipe.ingredients.join('\n'));
        setInstructions(foundRecipe.instructions);
        setPrepTime(foundRecipe.prepTime.toString());
        setDifficulty(foundRecipe.difficulty);
        setCategory(foundRecipe.category);
        setServes(foundRecipe.serves.toString());
      }
    }
    setIsLoading(false);
  };

const handleSave = async () => {
  if (!recipe) return;

  const ingredientsArray = ingredients.split('\n').filter(ing => ing.trim() !== '');
  
  const updates = {
    title,
    description,
    ingredients: ingredientsArray,
    instructions,
    prepTime: parseInt(prepTime) || 0,
    difficulty,
    category,
    serves: parseInt(serves) || 1,
  };

  const result = await RecipeService.update(recipe.id, updates);
  
  if (result.success) {
    Alert.alert('Succes', 'Recept is bijgewerkt!');
    // Forceer terug navigeren NA de alert
    setTimeout(() => {
      router.back();
    }, 500);
  } else {
    Alert.alert('Fout', result.errors?.join('\n') || 'Kon recept niet bijwerken');
  }
};

  const handleDelete = () => {
    Alert.alert(
      "Verwijder Recept",
      "Weet je zeker dat je dit recept wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
      [
        { text: "Annuleren", style: "cancel" },
        { 
          text: "Verwijderen", 
          style: "destructive",
          onPress: async () => {
            if (recipe) {
              const result = await RecipeService.delete(recipe.id);
              if (result.success) {
                Alert.alert('Verwijderd', 'Recept is verwijderd');
                router.replace('/');
              }
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Laden...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recept niet gevonden</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Recept Bewerken</Text>

      <Text style={styles.label}>Titel*</Text>
      <TextInput 
        style={styles.input} 
        value={title}
        onChangeText={setTitle}
        placeholder="Bijv. Spaghetti Bolognese"
      />

      <Text style={styles.label}>Beschrijving</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={description}
        onChangeText={setDescription}
        placeholder="Korte beschrijving van het recept"
        multiline
      />

      <Text style={styles.label}>Ingrediënten* (één per regel)</Text>
      <TextInput
        style={[styles.input, styles.textAreaLarge]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="300g spaghetti\n500g gehakt\n1 ui\n2 teentjes knoflook"
        multiline
      />

      <Text style={styles.label}>Bereidingswijze*</Text>
      <TextInput
        style={[styles.input, styles.textAreaLarge]}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="Stap-voor-stap instructies..."
        multiline
      />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Bereidingstijd (min)*</Text>
          <TextInput 
            style={styles.input} 
            value={prepTime}
            onChangeText={setPrepTime}
            placeholder="30"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.halfInput}>
          <Text style={styles.label}>Moeilijkheid*</Text>
          <View style={styles.difficultyContainer}>
            <TouchableOpacity 
              style={[styles.difficultyButton, difficulty === 'easy' && styles.difficultySelected]}
              onPress={() => setDifficulty('easy')}
            >
              <Text style={difficulty === 'easy' ? styles.difficultySelectedText : styles.difficultyText}>
                Makkelijk
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.difficultyButton, difficulty === 'medium' && styles.difficultySelected]}
              onPress={() => setDifficulty('medium')}
            >
              <Text style={difficulty === 'medium' ? styles.difficultySelectedText : styles.difficultyText}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.difficultyButton, difficulty === 'hard' && styles.difficultySelected]}
              onPress={() => setDifficulty('hard')}
            >
              <Text style={difficulty === 'hard' ? styles.difficultySelectedText : styles.difficultyText}>
                Moeilijk
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Categorie</Text>
          <TextInput 
            style={styles.input} 
            value={category}
            onChangeText={setCategory}
            placeholder="Bijv. Pasta, Aziatisch"
          />
        </View>

        <View style={styles.halfInput}>
          <Text style={styles.label}>Aantal personen*</Text>
          <TextInput 
            style={styles.input} 
            value={serves}
            onChangeText={setServes}
            placeholder="4"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Opslaan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Verwijderen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metadata}>
        <Text style={styles.metadataText}>
          Aangemaakt: {recipe.createdAt.toLocaleDateString('nl-NL')}
        </Text>
        <Text style={styles.metadataText}>
          Laatst bijgewerkt: {recipe.updatedAt.toLocaleDateString('nl-NL')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 25, color: "#2c3e50" },
  label: { 
    marginTop: 15, 
    fontWeight: "bold", 
    fontSize: 16,
    color: "#34495e",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  halfInput: {
    width: '48%',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  difficultySelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  difficultyText: {
    color: '#34495e',
  },
  difficultySelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  metadata: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  metadataText: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 5,
  },
});