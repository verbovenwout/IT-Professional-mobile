import RecipeService from '@/app/services/RecipeService';
import { Recipe } from '@/app/types/Recipe';
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  // Laad recepten en subscribe op updates
  useEffect(() => {
    loadRecipes();
    
    // Subscribe op recept updates
    const unsubscribe = RecipeService.subscribe(() => {
      loadRecipes();
    });
    
    return () => unsubscribe(); // Cleanup bij unmount
  }, []);

  // Filter recepten bij zoeken
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      filterRecipes(searchQuery);
    }
  }, [searchQuery, recipes]);

  const loadRecipes = async () => {
    await RecipeService.loadFromStorage();
    const allRecipes = await RecipeService.getAll();
    setRecipes(allRecipes);
    setFilteredRecipes(allRecipes);
  };

  const filterRecipes = async (query: string) => {
    const results = await RecipeService.search(query);
    setFilteredRecipes(results);
  };

  const handleDeleteRecipe = async (id: string) => {
    Alert.alert(
      "Verwijder Recept",
      "Weet je zeker dat je dit recept wilt verwijderen?",
      [
        { text: "Annuleren", style: "cancel" },
        { 
          text: "Verwijderen", 
          style: "destructive",
          onPress: async () => {
            const result = await RecipeService.delete(id);
            if (result.success) {
              Alert.alert("Succes", result.message || "Recept is verwijderd!");
              // State wordt automatisch geüpdatet via subscription
            } else {
              Alert.alert("Fout", result.message || "Kon recept niet verwijderen");
            }
          }
        }
      ]
    );
  };

const renderRecipeItem = ({ item }: { item: Recipe }) => (
  <TouchableOpacity 
    style={styles.card}
    onPress={() => router.push({
      pathname: "/recipes/[id]/detail",
      params: { id: item.id }
    })}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardActions}>
        <Link href={{
          pathname: "/recipes/edit/[id]",
          params: { id: item.id }
        }} asChild>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => e.stopPropagation()} // Voorkom dubbele navigatie
          >
            <Ionicons name="create-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteRecipe(item.id);
          }}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.cardDescription} numberOfLines={2}>
      {item.description}
    </Text>
    
    <View style={styles.cardFooter}>
      <Text style={styles.cardTime}>⏱️ {item.prepTime} min</Text>
      <Text style={styles.cardDifficulty}>📊 {item.difficulty}</Text>
      <Text style={styles.cardServes}>👥 {item.serves} personen</Text>
    </View>
    
    <Text style={styles.cardIngredients}>
      🛒 {item.ingredients.slice(0, 3).join(', ')}
      {item.ingredients.length > 3 && '...'}
    </Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mijn Recepten</Text>
      
      {/* Zoekbalk */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek recepten..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Statistieken */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recipes.length}</Text>
          <Text style={styles.statLabel}>Recepten</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {recipes.length > 0 
              ? Math.round(recipes.reduce((acc, r) => acc + r.prepTime, 0) / recipes.length)
              : 0
            }
          </Text>
          <Text style={styles.statLabel}>Gem. tijd</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {recipes.filter(r => r.difficulty === 'easy').length}
          </Text>
          <Text style={styles.statLabel}>Makkelijk</Text>
        </View>
      </View>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Geen recepten gevonden</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Probeer een andere zoekterm' : 'Voeg je eerste recept toe!'}
            </Text>
          </View>
        }
      />

      <Link href="/recipes/new" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#2c3e50" },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  
  listContent: { paddingBottom: 100 },
  
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#2c3e50", flex: 1 },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  cardDescription: { 
    color: "#666", 
    marginBottom: 15,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTime: { color: "#3498db", fontWeight: '500' },
  cardDifficulty: { color: "#e74c3c", fontWeight: '500' },
  cardServes: { color: "#9b59b6", fontWeight: '500' },
  cardIngredients: {
    color: "#27ae60",
    fontStyle: 'italic',
    fontSize: 14,
  },
  
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
});