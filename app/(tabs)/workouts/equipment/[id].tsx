import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Clock, Flame, Users, Star, Bookmark, Share, Target, TrendingUp, Dumbbell, ChevronRight, CircleAlert as AlertCircle, RefreshCw, Plus } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEquipment } from '@/hooks/useEquipment';
import { useExercises } from '@/hooks/useExercises';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function EquipmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { equipment, loading: equipmentLoading, error: equipmentError, refetch: refetchEquipment } = useEquipment();
  const { exercises, loading: exercisesLoading, error: exercisesError, refetch: refetchExercises } = useExercises();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const equipmentItem = equipment.find(item => item.id === id);
  
  // Filter exercises by equipment ID
  const equipmentExercises = exercises.filter(exercise => exercise.equipment_id === id);
  
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

  const filteredExercises = equipmentExercises.filter(exercise => 
    selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty
  );

  useEffect(() => {
    console.log('Equipment item:', equipmentItem);
    console.log('Equipment exercises:', equipmentExercises.length);
    console.log('Filtered exercises:', filteredExercises.length);
  }, [equipmentItem, equipmentExercises, filteredExercises]);

  if (equipmentLoading || exercisesLoading) {
    return <LoadingSpinner message="Loading equipment and exercises..." />;
  }

  if (equipmentError || !equipmentItem) {
    return <ErrorMessage message="Equipment not found" onRetry={refetchEquipment} />;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#059669';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const calculateCalories = (difficulty: string) => {
    const baseCalories = 200; // Base calories for exercise
    const multiplier = difficulty === 'advanced' ? 1.3 : difficulty === 'intermediate' ? 1.1 : 0.9;
    return Math.round(baseCalories * multiplier);
  };

  const generateParticipants = (exerciseId: string) => {
    const hash = exerciseId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 1000) + 100;
  };

  const generateRating = (exerciseId: string) => {
    const hash = exerciseId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return 4.0 + (Math.abs(hash % 100) / 100); // Rating between 4.0 and 5.0
  };

  const handleStartExercise = (exerciseId: string) => {
    router.push(`/workouts/exercise/${exerciseId}`);
  };

  const ExerciseCard = ({ exercise }: { exercise: any }) => {
    const calories = calculateCalories(exercise.difficulty);
    const participants = generateParticipants(exercise.id);
    const rating = generateRating(exercise.id);

    return (
      <TouchableOpacity 
        style={styles.exerciseCard}
        onPress={() => handleStartExercise(exercise.id)}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: exercise.thumbnail_url || 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2' }}
          style={styles.exerciseImage}
          resizeMode="cover"
        />
        <View style={styles.exerciseContent}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseTitleRow}>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                <Text style={styles.difficultyText}>{getDifficultyLabel(exercise.difficulty)}</Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              <Text style={styles.participantsText}>({participants})</Text>
            </View>
          </View>
          
          <Text style={styles.exerciseDescription} numberOfLines={2}>
            {exercise.proper_form || `A ${exercise.difficulty} level exercise targeting ${exercise.muscle_group}`}
          </Text>
          
          <View style={styles.exerciseStats}>
            <View style={styles.statItem}>
              <Target size={14} color="#64748B" />
              <Text style={styles.statText}>{exercise.muscle_group}</Text>
            </View>
            <View style={styles.statItem}>
              <Dumbbell size={14} color="#64748B" />
              <Text style={styles.statText}>{exercise.type || 'Exercise'}</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={14} color="#64748B" />
              <Text style={styles.statText}>{calories} cal</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {exercise.primary_muscles?.slice(0, 3).map((muscle: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{muscle}</Text>
              </View>
            )) || (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{exercise.muscle_group}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => handleStartExercise(exercise.id)}
          >
            <Play size={16} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {equipmentItem.name}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.actionButton, isBookmarked && styles.bookmarkedButton]}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark 
              size={20} 
              color={isBookmarked ? "#FFFFFF" : "#64748B"} 
              fill={isBookmarked ? "#FFFFFF" : "none"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Equipment Info */}
        <View style={styles.equipmentInfo}>
          {equipmentItem.image_url ? (
            <Image 
              source={{ uri: equipmentItem.image_url }}
              style={styles.equipmentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Dumbbell size={48} color="#64748B" />
            </View>
          )}
          <View style={styles.equipmentDetails}>
            <Text style={styles.equipmentName}>{equipmentItem.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{equipmentItem.category}</Text>
            </View>
            <Text style={styles.equipmentDescription}>
              {equipmentItem.description}
            </Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#2563EB" />
            <Text style={styles.statValue}>{equipmentExercises.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#059669" />
            <Text style={styles.statValue}>
              {equipmentExercises.reduce((sum, ex) => sum + generateParticipants(ex.id), 0)}
            </Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#F59E0B" />
            <Text style={styles.statValue}>
              {equipmentExercises.length > 0 ? (equipmentExercises.reduce((sum, ex) => sum + generateRating(ex.id), 0) / equipmentExercises.length).toFixed(1) : '0.0'}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Database Connection Status */}
        {equipmentExercises.length === 0 && !exercisesError && (
          <View style={styles.connectionStatus}>
            <View style={styles.statusIcon}>
              <AlertCircle size={20} color="#F59E0B" />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>No Exercises Found</Text>
              <Text style={styles.statusText}>
                No exercises found for {equipmentItem.name}. Add exercises to your database with equipment_id: {id}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={refetchExercises}
            >
              <RefreshCw size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
        )}

        {/* Exercises Error */}
        {exercisesError && (
          <View style={styles.errorBanner}>
            <AlertCircle size={20} color="#EF4444" />
            <Text style={styles.errorText}>{exercisesError}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={refetchExercises}
            >
              <RefreshCw size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Difficulty Filter */}
        {equipmentExercises.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Available Exercises</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.difficultyFilter}
              contentContainerStyle={styles.difficultyFilterContent}
            >
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === difficulty && styles.activeDifficultyButton
                  ]}
                  onPress={() => setSelectedDifficulty(difficulty)}
                >
                  <Text style={[
                    styles.difficultyButtonText,
                    selectedDifficulty === difficulty && styles.activeDifficultyButtonText
                  ]}>
                    {difficulty === 'All' ? 'All' : getDifficultyLabel(difficulty)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Exercises List */}
        {filteredExercises.length > 0 && (
          <View style={styles.exercisesSection}>
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </View>
        )}

        {/* Empty State for filtered results */}
        {equipmentExercises.length > 0 && filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Target size={48} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No exercises found</Text>
            <Text style={styles.emptyStateText}>
              Try selecting a different difficulty level
            </Text>
          </View>
        )}

        {/* Create Exercise Suggestion */}
        {equipmentExercises.length === 0 && !exercisesError && (
          <View style={styles.createExerciseSection}>
            <View style={styles.createExerciseCard}>
              <Plus size={48} color="#2563EB" />
              <Text style={styles.createExerciseTitle}>Add Your First Exercise</Text>
              <Text style={styles.createExerciseText}>
                Start adding exercises for {equipmentItem.name} to your database. Set the equipment_id to {id} when creating exercises.
              </Text>
              <View style={styles.createExerciseInfo}>
                <Text style={styles.createExerciseInfoTitle}>Database Info:</Text>
                <Text style={styles.createExerciseInfoText}>Table: exercises</Text>
                <Text style={styles.createExerciseInfoText}>Equipment ID: {id}</Text>
                <Text style={styles.createExerciseInfoText}>Equipment: {equipmentItem.name}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkedButton: {
    backgroundColor: '#2563EB',
  },
  equipmentInfo: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  equipmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  equipmentDetails: {
    alignItems: 'center',
  },
  equipmentName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  equipmentDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusIcon: {
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
  },
  retryButton: {
    padding: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    marginLeft: 12,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  difficultyFilter: {
    marginBottom: 8,
  },
  difficultyFilterContent: {
    gap: 12,
  },
  difficultyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeDifficultyButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeDifficultyButtonText: {
    color: '#FFFFFF',
  },
  exercisesSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 160,
  },
  exerciseContent: {
    padding: 16,
  },
  exerciseHeader: {
    marginBottom: 12,
  },
  exerciseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  participantsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  exerciseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  createExerciseSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  createExerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  createExerciseTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  createExerciseText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createExerciseInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  createExerciseInfoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  createExerciseInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
});