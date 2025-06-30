import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Clock, Flame, Users, Star, Bookmark, Share, Target, TrendingUp } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEquipment } from '@/hooks/useEquipment';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  exercises: number;
  calories: number;
  rating: number;
  participants: number;
  image_url: string;
  tags: string[];
  targetMuscles: string[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  restTime: number;
  instructions: string[];
}

export default function EquipmentWorkoutsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { equipment, loading, error } = useEquipment();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentEquipment = equipment.find(item => item.id === id);

  // Mock workout templates for the equipment
  const workoutTemplates: WorkoutTemplate[] = [
    {
      id: '1',
      name: 'Full Body Strength',
      description: 'Complete workout targeting all major muscle groups with progressive overload',
      difficulty: 'Intermediate',
      duration: 45,
      exercises: 8,
      calories: 320,
      rating: 4.8,
      participants: 1247,
      image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tags: ['Strength', 'Full Body', 'Muscle Building'],
      targetMuscles: ['Chest', 'Back', 'Legs', 'Arms']
    },
    {
      id: '2',
      name: 'Upper Body Power',
      description: 'Intense upper body workout focusing on strength and muscle definition',
      difficulty: 'Advanced',
      duration: 35,
      exercises: 6,
      calories: 280,
      rating: 4.9,
      participants: 892,
      image_url: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tags: ['Upper Body', 'Strength', 'Power'],
      targetMuscles: ['Chest', 'Shoulders', 'Arms', 'Back']
    },
    {
      id: '3',
      name: 'Beginner Basics',
      description: 'Perfect introduction to strength training with proper form focus',
      difficulty: 'Beginner',
      duration: 25,
      exercises: 5,
      calories: 180,
      rating: 4.6,
      participants: 2156,
      image_url: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tags: ['Beginner', 'Form', 'Foundation'],
      targetMuscles: ['Full Body']
    },
    {
      id: '4',
      name: 'Endurance Builder',
      description: 'High-rep, moderate weight workout to build muscular endurance',
      difficulty: 'Intermediate',
      duration: 40,
      exercises: 10,
      calories: 350,
      rating: 4.7,
      participants: 743,
      image_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tags: ['Endurance', 'High Rep', 'Conditioning'],
      targetMuscles: ['Full Body', 'Core']
    }
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredWorkouts = workoutTemplates.filter(workout => 
    selectedDifficulty === 'All' || workout.difficulty === selectedDifficulty
  );

  if (loading) {
    return <LoadingSpinner message="Loading equipment details..." />;
  }

  if (error || !currentEquipment) {
    return <ErrorMessage message="Equipment not found" onRetry={() => router.back()} />;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#059669';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#64748B';
    }
  };

  const handleStartWorkout = (workoutId: string) => {
    router.push(`/workouts/workout/${workoutId}`);
  };

  const WorkoutCard = ({ workout }: { workout: WorkoutTemplate }) => (
    <TouchableOpacity 
      style={styles.workoutCard}
      onPress={() => handleStartWorkout(workout.id)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: workout.image_url }}
        style={styles.workoutImage}
        resizeMode="cover"
      />
      <View style={styles.workoutContent}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutTitleRow}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(workout.difficulty) }]}>
              <Text style={styles.difficultyText}>{workout.difficulty}</Text>
            </View>
          </View>
          <View style={styles.ratingRow}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{workout.rating}</Text>
            <Text style={styles.participantsText}>({workout.participants})</Text>
          </View>
        </View>
        
        <Text style={styles.workoutDescription} numberOfLines={2}>
          {workout.description}
        </Text>
        
        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.statText}>{workout.duration} min</Text>
          </View>
          <View style={styles.statItem}>
            <Target size={14} color="#64748B" />
            <Text style={styles.statText}>{workout.exercises} exercises</Text>
          </View>
          <View style={styles.statItem}>
            <Flame size={14} color="#64748B" />
            <Text style={styles.statText}>{workout.calories} cal</Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {workout.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => handleStartWorkout(workout.id)}
        >
          <Play size={16} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          {currentEquipment.name}
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
          {currentEquipment.image_url ? (
            <Image 
              source={{ uri: currentEquipment.image_url }}
              style={styles.equipmentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Target size={48} color="#64748B" />
            </View>
          )}
          <View style={styles.equipmentDetails}>
            <Text style={styles.equipmentName}>{currentEquipment.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentEquipment.category}</Text>
            </View>
            <Text style={styles.equipmentDescription}>
              {currentEquipment.description}
            </Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#2563EB" />
            <Text style={styles.statValue}>{workoutTemplates.length}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#059669" />
            <Text style={styles.statValue}>
              {workoutTemplates.reduce((sum, w) => sum + w.participants, 0)}
            </Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#F59E0B" />
            <Text style={styles.statValue}>
              {(workoutTemplates.reduce((sum, w) => sum + w.rating, 0) / workoutTemplates.length).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Difficulty Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Available Workouts</Text>
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
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Workouts List */}
        <View style={styles.workoutsSection}>
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View>

        {/* Empty State */}
        {filteredWorkouts.length === 0 && (
          <View style={styles.emptyState}>
            <Target size={48} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No workouts found</Text>
            <Text style={styles.emptyStateText}>
              Try selecting a different difficulty level
            </Text>
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
  workoutsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  workoutCard: {
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
  workoutImage: {
    width: '100%',
    height: 160,
  },
  workoutContent: {
    padding: 16,
  },
  workoutHeader: {
    marginBottom: 12,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  workoutTitle: {
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
  workoutDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutStats: {
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
});