import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Clock, Zap, Target, Filter } from 'lucide-react-native';

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscleGroups: string[];
}

const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    category: 'Upper Body',
    duration: '3 sets × 12 reps',
    difficulty: 'Beginner',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders']
  },
  {
    id: '2',
    name: 'Pull-ups',
    category: 'Upper Body',
    duration: '3 sets × 8 reps',
    difficulty: 'Intermediate',
    muscleGroups: ['Back', 'Biceps']
  },
  {
    id: '3',
    name: 'Squats',
    category: 'Lower Body',
    duration: '4 sets × 15 reps',
    difficulty: 'Beginner',
    muscleGroups: ['Quadriceps', 'Glutes']
  },
  {
    id: '4',
    name: 'Deadlifts',
    category: 'Lower Body',
    duration: '3 sets × 6 reps',
    difficulty: 'Advanced',
    muscleGroups: ['Hamstrings', 'Glutes', 'Back']
  },
  {
    id: '5',
    name: 'Plank',
    category: 'Core',
    duration: '3 sets × 60s',
    difficulty: 'Beginner',
    muscleGroups: ['Core', 'Shoulders']
  },
  {
    id: '6',
    name: 'Burpees',
    category: 'Cardio',
    duration: '4 sets × 10 reps',
    difficulty: 'Advanced',
    muscleGroups: ['Full Body']
  }
];

const categories = ['All', 'Upper Body', 'Lower Body', 'Core', 'Cardio'];

export default function WorkoutsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.muscleGroups.some(group => 
                           group.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#059669';
      case 'Intermediate': return '#EA580C';
      case 'Advanced': return '#DC2626';
      default: return '#64748B';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.exerciseList}>
        {filteredExercises.map((exercise) => (
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseCategory}>{exercise.category}</Text>
              </View>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' }
              ]}>
                <Text style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(exercise.difficulty) }
                ]}>
                  {exercise.difficulty}
                </Text>
              </View>
            </View>
            
            <View style={styles.exerciseDetails}>
              <View style={styles.detailItem}>
                <Clock size={16} color="#64748B" />
                <Text style={styles.detailText}>{exercise.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Target size={16} color="#64748B" />
                <Text style={styles.detailText}>
                  {exercise.muscleGroups.join(', ')}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.startButton}>
              <Zap size={16} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Workout Templates */}
      <View style={styles.templatesSection}>
        <Text style={styles.sectionTitle}>Popular Workouts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templatesContainer}
        >
          <TouchableOpacity style={styles.templateCard}>
            <Text style={styles.templateTitle}>Full Body HIIT</Text>
            <Text style={styles.templateSubtitle}>30 min • 8 exercises</Text>
            <View style={styles.templateStats}>
              <Text style={styles.templateStat}>🔥 320 cal</Text>
              <Text style={styles.templateStat}>⭐ 4.8</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.templateCard}>
            <Text style={styles.templateTitle}>Strength Builder</Text>
            <Text style={styles.templateSubtitle}>45 min • 6 exercises</Text>
            <View style={styles.templateStats}>
              <Text style={styles.templateStat}>💪 Strength</Text>
              <Text style={styles.templateStat}>⭐ 4.9</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.templateCard}>
            <Text style={styles.templateTitle}>Core Focus</Text>
            <Text style={styles.templateSubtitle}>20 min • 5 exercises</Text>
            <View style={styles.templateStats}>
              <Text style={styles.templateStat}>🎯 Core</Text>
              <Text style={styles.templateStat}>⭐ 4.7</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCategoryButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  exerciseDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  templatesSection: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  templatesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  templateCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  templateTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  templateSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  templateStat: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
});