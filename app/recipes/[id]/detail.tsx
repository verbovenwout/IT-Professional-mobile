import RecipeService from '@/app/services/RecipeService';
import { Recipe } from '@/app/types/Recipe';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    if (typeof id === 'string') {
      const foundRecipe = await RecipeService.getById(id);
      setRecipe(foundRecipe);
    }
    setIsLoading(false);
  };

  // SHARE functie - Native Module #2
  const handleShare = async () => {
    if (!recipe) return;
    
    try {
      // Controleer of sharing beschikbaar is
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('Sorry', 'Delen is niet beschikbaar op dit apparaat');
        return;
      }

      // Maak share content
      const shareContent = `
🍽️ ${recipe.title}

📝 **Beschrijving:**
${recipe.description}

🛒 **Ingrediënten:**
${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}

👨‍🍳 **Bereiding:**
${recipe.instructions}

⏱️ Bereidingstijd: ${recipe.prepTime} minuten
📊 Moeilijkheid: ${recipe.difficulty}
👥 Personen: ${recipe.serves}

Gemaakt met Recepten App 🍳
      `;

      // Deel het recept
      await Sharing.shareAsync(shareContent, {
        mimeType: 'text/plain',
        dialogTitle: `Deel recept: ${recipe.title}`,
        UTI: 'public.plain-text' // iOS
      });
      
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Fout', 'Kon recept niet delen');
    }
  };

  // EXTRA: Delen als tekst (fallback)
  const handleShareAsText = () => {
    if (!recipe) return;
    
    const shareText = `Ik wil dit recept met je delen: ${recipe.title}\n\nIngrediënten:\n${recipe.ingredients.join('\n')}`;
    
    Alert.alert(
      "Deel Recept",
      "Kopieer de receptgegevens:",
      [
        { text: "Annuleren", style: "cancel" },
        { 
          text: "Kopieer", 
          onPress: async () => {
            // Hier zou je clipboard kunnen gebruiken als derde native module
            Alert.alert("Gekopieerd", "Receptgegevens zijn gekopieerd");
          }
        }
      ]
    );
  };

  // Navigeer naar bewerken
  const handleEdit = () => {
    if (recipe) {
      router.push({
        pathname: "/recipes/edit/[id]",
        params: { id: recipe.id }
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Recept laden...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Recept niet gevonden</Text>
        <TouchableOpacity 
          style={styles.actionButtonLarge}
          onPress={() => router.back()}
        >
          <Text style={styles.actionButtonText}>Terug naar overzicht</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header met titel en acties */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Beschrijving */}
      <View style={styles.section}>
        <Text style={styles.description}>{recipe.description}</Text>
      </View>

      {/* Info cards */}
      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={28} color="#3498db" />
          <Text style={styles.infoCardValue}>{recipe.prepTime} min</Text>
          <Text style={styles.infoCardLabel}>Bereidingstijd</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Ionicons name="speedometer-outline" size={28} color="#e74c3c" />
          <Text style={styles.infoCardValue}>{recipe.difficulty}</Text>
          <Text style={styles.infoCardLabel}>Moeilijkheid</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Ionicons name="people-outline" size={28} color="#9b59b6" />
          <Text style={styles.infoCardValue}>{recipe.serves}</Text>
          <Text style={styles.infoCardLabel}>Personen</Text>
        </View>
      </View>

      {/* Ingrediënten */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list-outline" size={24} color="#2c3e50" />
          <Text style={styles.sectionTitle}>Ingrediënten</Text>
          <Text style={styles.ingredientCount}>({recipe.ingredients.length})</Text>
        </View>
        
        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientBullet} />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bereiding */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant-outline" size={24} color="#2c3e50" />
          <Text style={styles.sectionTitle}>Bereiding</Text>
        </View>
        
        <Text style={styles.instructions}>{recipe.instructions}</Text>
        
        {/* Stap teller (als instructies genummerd zijn) */}
        {recipe.instructions.split('\n').filter(line => line.trim()).length > 1 && (
          <View style={styles.stepCounter}>
            <Ionicons name="footsteps-outline" size={16} color="#666" />
            <Text style={styles.stepCounterText}>
              {recipe.instructions.split('\n').filter(line => line.trim()).length} stappen
            </Text>
          </View>
        )}
      </View>

      {/* Categorie & Metadata */}
      <View style={styles.metadata}>
        {recipe.category && (
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag-outline" size={14} color="#fff" />
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        )}
        
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            Aangemaakt: {recipe.createdAt.toLocaleDateString('nl-NL')}
          </Text>
          <Text style={styles.dateText}>
            Bijgewerkt: {recipe.updatedAt.toLocaleDateString('nl-NL')}
          </Text>
        </View>
      </View>

      {/* Actie buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButtonLarge, styles.shareButton]}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Deel Recept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButtonLarge, styles.editButton]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Bewerken</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 100,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  
  // Section
  section: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Info Cards
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    alignItems: 'center',
    flex: 1,
  },
  infoCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  
  // Ingrediënten
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  ingredientCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
    marginTop: 2,
  },
  ingredientsList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
  },
  
  // Bereiding
  instructions: {
    fontSize: 16,
    lineHeight: 26,
    color: '#34495e',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
  },
  stepCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'flex-end',
  },
  stepCounterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  
  // Metadata
  metadata: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 3,
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingBottom: 40,
  },
  actionButtonLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  shareButton: {
    backgroundColor: '#3498db',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});