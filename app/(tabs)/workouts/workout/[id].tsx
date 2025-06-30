import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Flame, Target, Users, Star, CircleCheck as CheckCircle, Circle, Info, Dumbbell } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useWorkoutTemplates, WorkoutTemplateWithExercises } from '@/hooks/useWorkoutTemplates';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

interface MockExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  restTime: number;
  instructions: string[];
  targetMuscles: string[];
  image_url: string;
  tips: string[];
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchTemplateWithExercises } = useWorkoutTemplates();
  const { createWorkoutSession, updateWorkoutSession, addExerciseSet } = useWorkoutSessions();
  
  const [workoutTemplate, setWorkoutTemplate] = useState<WorkoutTemplateWithExercises | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Mock exercises for when database doesn't have data
  const mockExercises: MockExercise[] = [
    {
      id: '1',
      name: 'Dumbbell Bench Press',
      sets: 3,
      reps: '8-12',
      restTime: 90,
      instructions: [
        'Lie flat on bench with dumbbells in each hand',
        'Lower weights to chest level with control',
        'Press weights up until arms are fully extended',
        'Squeeze chest muscles at the top'
      ],
      targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
      image_url: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tips: ['Keep your core engaged', 'Control the negative movement', 'Don\'t arch your back excessively']
    },
    {
      id: '2',
      name: 'Bent-Over Rows',
      sets: 3,
      reps: '10-15',
      restTime: 75,
      instructions: [
        'Stand with feet hip-width apart, holding dumbbells',
        'Hinge at hips, keeping back straight',
        'Pull weights to your ribcage',
        'Squeeze shoulder blades together'
      ],
      targetMuscles: ['Back', 'Biceps', 'Rear Delts'],
      image_url: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tips: ['Keep your core tight', 'Don\'t round your back', 'Focus on squeezing your lats']
    },
    {
      id: '3',
      name: 'Goblet Squats',
      sets: 3,
      reps: '12-15',
      restTime: 60,
      instructions: [
        'Hold dumbbell at chest level',
        'Stand with feet shoulder-width apart',
        'Lower into squat position',
        'Drive through heels to return to start'
      ],
      targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
      image_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tips: ['Keep chest up', 'Go as low as mobility allows', 'Drive through your heels']
    },
    {
      id: '4',
      name: 'Overhead Press',
      sets: 3,
      reps: '8-10',
      restTime: 90,
      instructions: [
        'Stand with dumbbells at shoulder height',
        'Press weights overhead until arms are extended',
        'Lower with control to starting position',
        'Keep core engaged throughout'
      ],
      targetMuscles: ['Shoulders', 'Triceps', 'Core'],
      image_url: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tips: ['Don\'t arch your back', 'Press in a straight line', 'Engage your core']
    },
    {
      id: '5',
      name: 'Romanian Deadlifts',
      sets: 3,
      reps: '10-12',
      restTime: 75,
      instructions: [
        'Hold dumbbells in front of thighs',
        'Hinge at hips, lowering weights',
        'Feel stretch in hamstrings',
        'Drive hips forward to return to start'
      ],
      targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
      image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tips: ['Keep weights close to body', 'Don\'t round your back', 'Feel the stretch in hamstrings']
    }
  ];

  useEffect(() => {
    loadWorkoutTemplate();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted) {
      interval = setInterval(() => {
        setWorkoutTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  const loadWorkoutTemplate = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const template = await fetchTemplateWithExercises(id);
      setWorkoutTemplate(template);
    } catch (err) {
      setError('Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const calculateCalories = (duration: number, difficulty: string) => {
    const baseCalories = duration * 6;
    const multiplier = difficulty === 'advanced' ? 1.3 : difficulty === 'intermediate' ? 1.1 : 0.9;
    return Math.round(baseCalories * multiplier);
  };

  const generateParticipants = (templateId: string) => {
    const hash = templateId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 2000) + 500;
  };

  const generateRating = (templateId: string) => {
    const hash = templateId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return 4.2 + (Math.abs(hash % 80) / 100);
  };

  const handleStartWorkout = async () => {
    if (!workoutTemplate && !id?.startsWith('mock-')) return;
    
    setIsStarted(true);
    
    // Create workout session in database
    const session = await createWorkoutSession({
      name: workoutTemplate?.name || 'Sample Workout',
      workout_id: workoutTemplate?.id,
      duration: 0,
      calories_burned: 0,
    });
    
    if (session) {
      setCurrentSessionId(session.id);
    }
    
    Alert.alert('Workout Started!', 'Good luck with your training session!');
  };

  const handlePauseWorkout = () => {
    setIsStarted(false);
  };

  const handleResetWorkout = () => {
    setIsStarted(false);
    setWorkoutTime(0);
    setCurrentExerciseIndex(0);
    setCompletedExercises(new Set());
    setCurrentSessionId(null);
  };

  const handleCompleteWorkout = async () => {
    if (currentSessionId && workoutTemplate) {
      const calories = calculateCalories(workoutTime / 60, workoutTemplate.difficulty);
      
      await updateWorkoutSession(currentSessionId, {
        duration: Math.floor(workoutTime / 60),
        calories_burned: calories,
      });
      
      Alert.alert(
        'Workout Complete!', 
        `Great job! You burned ${calories} calories in ${formatTime(workoutTime)}.`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    }
  };

  const toggleExerciseComplete = async (index: number) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
      
      // Add exercise set to database if we have a session
      if (currentSessionId) {
        const exercise = workoutTemplate?.exercises[index] || mockExercises[index];
        if (exercise) {
          await addExerciseSet({
            workout_session_id: currentSessionId,
            exercise_id: exercise.id,
            set_number: 1,
            reps: workoutTemplate?.exercises[index]?.reps || undefined,
            rest_time: workoutTemplate?.exercises[index]?.rest_time || 60,
          });
        }
      }
    }
    setCompletedExercises(newCompleted);
    
    // Check if all exercises are completed
    const totalExercises = workoutTemplate?.exercises.length || mockExercises.length;
    if (newCompleted.size === totalExercises) {
      handleCompleteWorkout();
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading workout details..." />;
  }

  if (error && !id?.startsWith('mock-')) {
    return <ErrorMessage message={error} onRetry={loadWorkoutTemplate} />;
  }

  // Use mock data if no template found or if it's a mock ID
  const displayData = workoutTemplate || {
    id: id || 'mock-1',
    name: 'Full Body Strength Training',
    description: 'A comprehensive strength training workout targeting all major muscle groups. Perfect for building lean muscle mass and improving overall strength.',
    difficulty: 'intermediate' as const,
    estimated_duration: 45,
    target_muscles: ['Chest', 'Back', 'Legs', 'Arms', 'Core'],
    equipment_needed: ['Dumbbells', 'Barbell', 'Bench'],
    category: 'strength',
    is_public: true,
    created_by: null,
    image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    exercises: []
  };

  const displayExercises = workoutTemplate?.exercises.length ? 
    workoutTemplate.exercises.map(ex => ({
      id: ex.exercise.id,
      name: ex.exercise.name,
      sets: ex.sets,
      reps: ex.reps?.toString() || '8-12',
      restTime: ex.rest_time,
      instructions: ex.exercise.instructions || ['Follow proper form', 'Control the movement', 'Focus on the target muscles'],
      targetMuscles: ex.exercise.primary_muscles || ['Target Muscles'],
      image_url: ex.exercise.thumbnail_url || 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      tips: ex.exercise.tips?.split('\n') || ['Focus on proper form', 'Control the movement']
    })) : mockExercises;

  const calories = calculateCalories(displayData.estimated_duration, displayData.difficulty);
  const participants = generateParticipants(displayData.id);
  const rating = generateRating(displayData.id);

  const ExerciseCard = ({ exercise, index }: { exercise: any; index: number }) => {
    const isCompleted = completedExercises.has(index);
    const isCurrent = index === currentExerciseIndex;

    return (
      <TouchableOpacity 
        style={[
          styles.exerciseCard,
          isCurrent && styles.currentExerciseCard,
          isCompleted && styles.completedExerciseCard
        ]}
        onPress={() => setCurrentExerciseIndex(index)}
      >
        <View style={styles.exerciseHeader}>
          <Image 
            source={{ uri: exercise.image_url }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
          <View style={styles.exerciseInfo}>
            <View style={styles.exerciseNameRow}>
              <Text style={[styles.exerciseName, isCompleted && styles.completedText]}>
                {exercise.name}
              </Text>
              <TouchableOpacity 
                onPress={() => toggleExerciseComplete(index)}
                style={styles.checkButton}
              >
                {isCompleted ? (
                  <CheckCircle size={24} color="#059669" />
                ) : (
                  <Circle size={24} color="#94A3B8" />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.exerciseStats}>
              <Text style={styles.exerciseStatText}>{exercise.sets} sets</Text>
              <Text style={styles.exerciseStatText}>•</Text>
              <Text style={styles.exerciseStatText}>{exercise.reps} reps</Text>
              <Text style={styles.exerciseStatText}>•</Text>
              <Text style={styles.exerciseStatText}>{exercise.restTime}s rest</Text>
            </View>
            <View style={styles.muscleTargets}>
              {exercise.targetMuscles.slice(0, 3).map((muscle: string, idx: number) => (
                <View key={idx} style={styles.muscleTag}>
                  <Text style={styles.muscleTagText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {isCurrent && (
          <View style={styles.exerciseDetails}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {exercise.instructions.map((instruction: string, idx: number) => (
              <Text key={idx} style={styles.instructionText}>
                {idx + 1}. {instruction}
              </Text>
            ))}
            
            {exercise.tips && exercise.tips.length > 0 && (
              <>
                <Text style={styles.tipsTitle}>Tips:</Text>
                {exercise.tips.map((tip: string, idx: number) => (
                  <View key={idx} style={styles.tipRow}>
                    <Info size={14} color="#2563EB" />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}
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
          Workout Details
        </Text>
        <TouchableOpacity 
          style={[styles.bookmarkButton, isBookmarked && styles.bookmarkedButton]}
          onPress={() => setIsBookmarked(!isBookmarked)}
        >
          <Star 
            size={20} 
            color={isBookmarked ? "#FFFFFF" : "#64748B"} 
            fill={isBookmarked ? "#FFFFFF" : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Workout Hero */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: displayData.image_url || 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.workoutTitle}>{displayData.name}</Text>
              <View style={styles.heroStats}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(displayData.difficulty) }]}>
                  <Text style={styles.difficultyText}>{getDifficultyLabel(displayData.difficulty)}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Workout Controls */}
        {isStarted && (
          <View style={styles.workoutControls}>
            <Text style={styles.timerText}>{formatTime(workoutTime)}</Text>
            <View style={styles.controlButtons}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleResetWorkout}
              >
                <RotateCcw size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.playButton, isStarted && styles.pauseButton]}
                onPress={isStarted ? handlePauseWorkout : handleStartWorkout}
              >
                {isStarted ? (
                  <Pause size={24} color="#FFFFFF" />
                ) : (
                  <Play size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Clock size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Workout Info */}
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutDescription}>
            {displayData.description || 'A comprehensive workout designed to help you reach your fitness goals.'}
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Clock size={20} color="#2563EB" />
              <Text style={styles.statValue}>{displayData.estimated_duration} min</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={20} color="#059669" />
              <Text style={styles.statValue}>{displayExercises.length}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={20} color="#EA580C" />
              <Text style={styles.statValue}>{calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={20} color="#8B5CF6" />
              <Text style={styles.statValue}>{participants}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
          </View>

          {/* Target Muscles */}
          <View style={styles.musclesSection}>
            <Text style={styles.sectionTitle}>Target Muscles</Text>
            <View style={styles.musclesContainer}>
              {displayData.target_muscles.map((muscle, index) => (
                <View key={index} style={styles.muscleChip}>
                  <Text style={styles.muscleChipText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.equipmentSection}>
            <Text style={styles.sectionTitle}>Equipment Needed</Text>
            <View style={styles.equipmentContainer}>
              {displayData.equipment_needed.map((equipment, index) => (
                <View key={index} style={styles.equipmentChip}>
                  <Dumbbell size={14} color="#2563EB" />
                  <Text style={styles.equipmentChipText}>{equipment}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Exercises List */}
        <View style={styles.exercisesSection}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.sectionTitle}>Exercises ({displayExercises.length})</Text>
            <Text style={styles.progressText}>
              {completedExercises.size}/{displayExercises.length} completed
            </Text>
          </View>
          
          {displayExercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </View>

        {/* Start Workout Button */}
        {!isStarted && (
          <View style={styles.startSection}>
            <TouchableOpacity 
              style={styles.startWorkoutButton}
              onPress={handleStartWorkout}
            >
              <Play size={20} color="#FFFFFF" />
              <Text style={styles.startWorkoutText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Database Status */}
        {!workoutTemplate && (
          <View style={styles.databaseNote}>
            <Text style={styles.databaseNoteText}>
              💡 Showing sample workout. Connect to your database to see real workout templates with exercises.
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
  bookmarkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkedButton: {
    backgroundColor: '#F59E0B',
  },
  heroSection: {
    position: 'relative',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  workoutTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  workoutControls: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 20,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#EF4444',
  },
  workoutInfo: {
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
  workoutDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  musclesSection: {
    marginBottom: 24,
  },
  musclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleChip: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  muscleChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  equipmentSection: {
    marginBottom: 0,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 6,
  },
  equipmentChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  exercisesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  currentExerciseCard: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  completedExerciseCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#059669',
  },
  checkButton: {
    padding: 4,
  },
  exerciseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  exerciseStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  muscleTargets: {
    flexDirection: 'row',
    gap: 6,
  },
  muscleTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  muscleTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  exerciseDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 4,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
    lineHeight: 20,
    flex: 1,
  },
  startSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  databaseNote: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  databaseNoteText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
});