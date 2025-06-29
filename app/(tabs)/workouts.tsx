import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Clock, Zap, Target, Filter, Dumbbell as Equipment } from 'lucide-react-native';
import { useExercises } from '@/hooks/useExercises';
import { useEquipment } from '@/hooks/useEquipment';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];

export default function WorkoutsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const { exercises, loading: exercisesLoading, error: exercisesError, refetch: refetchExercises } = useExercises();
  const { equipment, loading: equipmentLoading, error: equipmentError } = useEquipment();

  const loading = exercisesLoading || equipmentLoading;
  const error = exercisesError || equipmentError;

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (exercise.primary_muscles || []).some(muscle => 
                           muscle.toLowerCase().includes(searchQuery.toLowerCase())
                         ) ||
                         (exercise.secondary_muscles || []).some(muscle => 
                           muscle.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'All' || exercise.muscle_group === selectedCategory;
    
    const matchesEquipment = selectedEquipment === 'All' || 
                            exercise.equipment_data?.name === selectedEquipment ||
                            (selectedEquipment === 'Bodyweight' && !exercise.equipment_data);
    
    return matchesSearch && matchesCategory && matchesEquipment;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return '#059669';
      case 'intermediate': return '#EA580C';
      case 'advanced': return '#DC2626';
      default: return '#64748B';
    }
  };

  const equipmentOptions = ['All', 'Bodyweight', ...equipment.map(eq => eq.name)];

  if (loading) {
    return <LoadingSpinner message="Loading exercises..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetchExercises} />;
  }

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
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.activeFilterButton]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? "#FFFFFF" : "#64748B"} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Muscle Group Filter */}
          <Text style={styles.filterTitle}>Muscle Groups</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {muscleGroups.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  selectedCategory === category && styles.activeFilterButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterText,
                  selectedCategory === category && styles.activeFilterText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Equipment Filter */}
          <Text style={styles.filterTitle}>Equipment</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {equipmentOptions.map((equipmentName) => (
              <TouchableOpacity
                key={equipmentName}
                style={[
                  styles.filterButton,
                  selectedEquipment === equipmentName && styles.activeFilterButton
                ]}
                onPress={() => setSelectedEquipment(equipmentName)}
              >
                <Text style={[
                  styles.filterText,
                  selectedEquipment === equipmentName && styles.activeFilterText
                ]}>
                  {equipmentName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Exercise List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.exerciseList}>
        {filteredExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Equipment size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptyMessage}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        ) : (
          filteredExercises.map((exercise) => (
            <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseImageContainer}>
                  {exercise.thumbnail_url ? (
                    <Image 
                      source={{ uri: exercise.thumbnail_url }} 
                      style={styles.exerciseImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.exercisePlaceholder}>
                      <Equipment size={24} color="#64748B" />
                    </View>
                  )}
                </View>
                
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseCategory}>{exercise.muscle_group}</Text>
                  
                  {exercise.equipment_data && (
                    <View style={styles.equipmentTag}>
                      <Equipment size={14} color="#64748B" />
                      <Text style={styles.equipmentText}>{exercise.equipment_data.name}</Text>
                    </View>
                  )}
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
                {exercise.duration && (
                  <View style={styles.detailItem}>
                    <Clock size={16} color="#64748B" />
                    <Text style={styles.detailText}>{exercise.duration}</Text>
                  </View>
                )}
                
                {(exercise.primary_muscles || exercise.secondary_muscles) && (
                  <View style={styles.detailItem}>
                    <Target size={16} color="#64748B" />
                    <Text style={styles.detailText}>
                      {[...(exercise.primary_muscles || []), ...(exercise.secondary_muscles || [])].join(', ')}
                    </Text>
                  </View>
                )}
              </View>
              
              {exercise.proper_form && (
                <Text style={styles.exerciseDescription} numberOfLines={2}>
                  {exercise.proper_form}
                </Text>
              )}
              
              <TouchableOpacity style={styles.startButton}>
                <Zap size={16} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Start Exercise</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Popular Workouts */}
      <View style={styles.templatesSection}>
        <Text style={styles.sectionTitle}>Popular Workouts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templatesContainer}
        >
          <TouchableOpacity style={styles.templateCard}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2' }}
              style={styles.templateImage}
              resizeMode="cover"
            />
            <View style={styles.templateContent}>
              <Text style={styles.templateTitle}>Full Body HIIT</Text>
              <Text style={styles.templateSubtitle}>30 min • 8 exercises</Text>
              <View style={styles.templateStats}>
                <Text style={styles.templateStat}>🔥 320 cal</Text>
                <Text style={styles.templateStat}>⭐ 4.8</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.templateCard}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2' }}
              style={styles.templateImage}
              resizeMode="cover"
            />
            <View style={styles.templateContent}>
              <Text style={styles.templateTitle}>Strength Builder</Text>
              <Text style={styles.templateSubtitle}>45 min • 6 exercises</Text>
              <View style={styles.templateStats}>
                <Text style={styles.templateStat}>💪 Strength</Text>
                <Text style={styles.templateStat}>⭐ 4.9</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.templateCard}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2' }}
              style={styles.templateImage}
              resizeMode="cover"
            />
            <View style={styles.templateContent}>
              <Text style={styles.templateTitle}>Core Focus</Text>
              <Text style={styles.templateSubtitle}>20 min • 5 exercises</Text>
              <View style={styles.templateStats}>
                <Text style={styles.templateStat}>🎯 Core</Text>
                <Text style={styles.templateStat}>⭐ 4.7</Text>
              </View>
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
  activeFilterButton: {
    backgroundColor: '#2563EB',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingTop: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContent: {
    gap: 12,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseImageContainer: {
    marginRight: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  exercisePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 6,
  },
  equipmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  equipmentText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  exerciseDetails: {
    gap: 8,
    marginBottom: 12,
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
  exerciseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  templateImage: {
    width: '100%',
    height: 100,
  },
  templateContent: {
    padding: 16,
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