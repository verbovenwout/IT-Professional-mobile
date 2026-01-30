import { useImagePicker } from '@/app/hooks/useImagePicker';
import RecipeService from '@/app/services/RecipeService';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function NewRecipe() {
  const { pickImage, takePhoto } = useImagePicker();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [category, setCategory] = useState('');
  const [serves, setServes] = useState('4');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setImageUri(uri);
      Alert.alert('Foto gemaakt', 'Foto is toegevoegd aan het recept');
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
      Alert.alert('Foto geselecteerd', 'Foto is toegevoegd aan het recept');
    }
  };

const handleSave = async () => {
  const ingredientsArray = ingredients.split('\n').filter(ing => ing.trim() !== '');
  
  const newRecipe = {
    title,
    description,
    ingredients: ingredientsArray,
    instructions,
    prepTime: parseInt(prepTime) || 0,
    difficulty,
    category,
    serves: parseInt(serves) || 1,
    imageUri: imageUri || undefined,
  };

  const result = await RecipeService.create(newRecipe);
  
  if (result.success && result.recipe) {
    Alert.alert('Succes', 'Recept is aangemaakt!');
    // Forceer terug navigeren NA de alert
    setTimeout(() => {
      router.back();
    }, 500);
  } else {
    Alert.alert('Fout', result.errors?.join('\n') || 'Kon recept niet aanmaken');
  }
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nieuw Recept</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.mediaButton} onPress={handleTakePhoto}>
          <Text>📷 Maak foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaButton} onPress={handlePickImage}>
          <Text>🖼 Kies uit galerij</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.imagePreview}>
          <Text style={styles.imagePreviewText}>✓ Foto toegevoegd</Text>
        </View>
      )}

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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Recept opslaan</Text>
      </TouchableOpacity>
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
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  mediaButton: {
    backgroundColor: "#dff2e1",
    padding: 15,
    borderRadius: 8,
    width: "48%",
    alignItems: "center"
  },
  imagePreview: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePreviewText: {
    color: '#2e7d32',
    fontWeight: 'bold',
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
  saveButton: {
    backgroundColor: "#4CAF50",
    marginTop: 30,
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});