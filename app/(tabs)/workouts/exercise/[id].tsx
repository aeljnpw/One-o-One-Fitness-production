import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Pause, Square, Clock, Target, Dumbbell, Info, CheckCircle, Circle, Plus, Minus, RotateCcw, Save } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

interface ExerciseProgress {
  startTime: Date | null;
  endTime: Date | null;
  status: 'not_started' | 'in_progress' | 'completed';
  sets: {
    setNumber: number;
    reps: number;
    weight: number;
    completed: boolean;
    restTime: number;
  }[];
  notes: string;
  totalDuration: number;
}

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { exercises, loading: exercisesLoading, error: exercisesError, getExerciseById } = useExercises();
  const { createWorkoutSession, addExerciseSet } = useWorkoutSessions();
  
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [progress, setProgress] = useState<ExerciseProgress>({
    startTime: null,
    endTime: null,
    status: 'not_started',
    sets: [],
    notes: '',
    totalDuration: 0
  });

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    loadExercise();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && progress.status === 'in_progress') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, progress.status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            Alert.alert('Rest Complete!', 'Time for your next set!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const loadExercise = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to find in loaded exercises
      let exerciseData = exercises.find(ex => ex.id === id);
      
      // If not found, try to fetch by ID
      if (!exerciseData) {
        exerciseData = await getExerciseById(id);
      }
      
      if (!exerciseData) {
        throw new Error('Exercise not found');
      }
      
      setExercise(exerciseData);
      
      // Initialize sets based on exercise data or defaults
      const defaultSets = Array.from({ length: 3 }, (_, index) => ({
        setNumber: index + 1,
        reps: 10,
        weight: 0,
        completed: false,
        restTime: 60
      }));
      
      setProgress(prev => ({
        ...prev,
        sets: defaultSets
      }));
      
    } catch (err) {
      console.error('Error loading exercise:', err);
      setError(err instanceof Error ? err.message : 'Failed to load exercise');
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

  const handleStartExercise = async () => {
    try {
      // Create workout session
      const session = await createWorkoutSession({
        name: `${exercise.name} Session`,
        duration: 0,
        calories_burned: 0,
      });
      
      if (session) {
        setCurrentSessionId(session.id);
      }
      
      setProgress(prev => ({
        ...prev,
        startTime: new Date(),
        status: 'in_progress'
      }));
      
      setIsTimerRunning(true);
      Alert.alert('Exercise Started!', 'Good luck with your workout!');
    } catch (err) {
      console.error('Error starting exercise:', err);
      Alert.alert('Error', 'Failed to start exercise session');
    }
  };

  const handlePauseExercise = () => {
    setIsTimerRunning(false);
  };

  const handleResumeExercise = () => {
    setIsTimerRunning(true);
  };

  const handleFinishExercise = async () => {
    const completedSets = progress.sets.filter(set => set.completed);
    
    if (completedSets.length === 0) {
      Alert.alert('No Sets Completed', 'Please complete at least one set before finishing.');
      return;
    }

    try {
      // Save exercise sets to database
      if (currentSessionId) {
        for (const set of completedSets) {
          await addExerciseSet({
            workout_session_id: currentSessionId,
            exercise_id: exercise.id,
            set_number: set.setNumber,
            reps: set.reps,
            weight: set.weight > 0 ? set.weight : undefined,
            rest_time: set.restTime,
          });
        }
      }

      setProgress(prev => ({
        ...prev,
        endTime: new Date(),
        status: 'completed',
        totalDuration: timer
      }));

      setIsTimerRunning(false);
      setIsResting(false);

      Alert.alert(
        'Exercise Complete!',
        `Great job! You completed ${completedSets.length} sets in ${formatTime(timer)}.`,
        [
          { 
            text: 'View Progress', 
            onPress: () => router.push('/progress') 
          },
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (err) {
      console.error('Error finishing exercise:', err);
      Alert.alert('Error', 'Failed to save exercise progress');
    }
  };

  const handleSetComplete = (setIndex: number) => {
    setProgress(prev => ({
      ...prev,
      sets: prev.sets.map((set, index) => 
        index === setIndex ? { ...set, completed: !set.completed } : set
      )
    }));

    // Start rest timer if set was completed
    if (!progress.sets[setIndex].completed) {
      const restTime = progress.sets[setIndex].restTime;
      setRestTimer(restTime);
      setIsResting(true);
      setCurrentSetIndex(setIndex + 1);
    }
  };

  const updateSetValue = (setIndex: number, field: 'reps' | 'weight' | 'restTime', value: number) => {
    setProgress(prev => ({
      ...prev,
      sets: prev.sets.map((set, index) => 
        index === setIndex ? { ...set, [field]: Math.max(0, value) } : set
      )
    }));
  };

  const addSet = () => {
    setProgress(prev => ({
      ...prev,
      sets: [...prev.sets, {
        setNumber: prev.sets.length + 1,
        reps: 10,
        weight: 0,
        completed: false,
        restTime: 60
      }]
    }));
  };

  const removeSet = (setIndex: number) => {
    if (progress.sets.length <= 1) return;
    
    setProgress(prev => ({
      ...prev,
      sets: prev.sets.filter((_, index) => index !== setIndex)
        .map((set, index) => ({ ...set, setNumber: index + 1 }))
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading exercise details..." />;
  }

  if (error || !exercise) {
    return <ErrorMessage message={error || 'Exercise not found'} onRetry={loadExercise} />;
  }

  const ExerciseInfoTable = () => (
    <View style={styles.infoTable}>
      <Text style={styles.tableTitle}>Exercise Information</Text>
      
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Name</Text>
        <Text style={styles.tableValue}>{exercise.name}</Text>
      </View>
      
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Muscle Group</Text>
        <Text style={styles.tableValue}>{exercise.muscle_group}</Text>
      </View>
      
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Difficulty</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
          <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
        </View>
      </View>
      
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Type</Text>
        <Text style={styles.tableValue}>{exercise.type || 'General'}</Text>
      </View>
      
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Equipment</Text>
        <Text style={styles.tableValue}>{exercise.equipment || 'None'}</Text>
      </View>
      
      {exercise.primary_muscles && (
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Primary Muscles</Text>
          <View style={styles.musclesList}>
            {exercise.primary_muscles.map((muscle: string, index: number) => (
              <View key={index} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Secondary Muscles</Text>
          <View style={styles.musclesList}>
            {exercise.secondary_muscles.map((muscle: string, index: number) => (
              <View key={index} style={styles.secondaryMuscleTag}>
                <Text style={styles.secondaryMuscleTagText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const ExerciseInstructions = () => (
    <View style={styles.instructionsSection}>
      <Text style={styles.sectionTitle}>Form & Instructions</Text>
      
      {exercise.proper_form && (
        <View style={styles.instructionCard}>
          <View style={styles.instructionHeader}>
            <Info size={20} color="#2563EB" />
            <Text style={styles.instructionTitle}>Proper Form</Text>
          </View>
          <Text style={styles.instructionText}>{exercise.proper_form}</Text>
        </View>
      )}
      
      {exercise.instructions && exercise.instructions.length > 0 && (
        <View style={styles.instructionCard}>
          <View style={styles.instructionHeader}>
            <Target size={20} color="#059669" />
            <Text style={styles.instructionTitle}>Step-by-Step</Text>
          </View>
          {exercise.instructions.map((instruction: string, index: number) => (
            <Text key={index} style={styles.stepText}>
              {index + 1}. {instruction}
            </Text>
          ))}
        </View>
      )}
      
      {exercise.tips && (
        <View style={styles.instructionCard}>
          <View style={styles.instructionHeader}>
            <CheckCircle size={20} color="#F59E0B" />
            <Text style={styles.instructionTitle}>Tips</Text>
          </View>
          <Text style={styles.instructionText}>{exercise.tips}</Text>
        </View>
      )}
      
      {exercise.common_mistakes && (
        <View style={styles.instructionCard}>
          <View style={styles.instructionHeader}>
            <Circle size={20} color="#EF4444" />
            <Text style={styles.instructionTitle}>Common Mistakes</Text>
          </View>
          <Text style={styles.instructionText}>{exercise.common_mistakes}</Text>
        </View>
      )}
    </View>
  );

  const WorkoutTracker = () => (
    <View style={styles.trackerSection}>
      <Text style={styles.sectionTitle}>Workout Tracker</Text>
      
      {/* Timer Display */}
      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Exercise Time</Text>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
        <Text style={styles.statusText}>Status: {progress.status.replace('_', ' ').toUpperCase()}</Text>
      </View>

      {/* Rest Timer */}
      {isResting && (
        <View style={styles.restTimerCard}>
          <Text style={styles.restTimerLabel}>Rest Time</Text>
          <Text style={styles.restTimerText}>{formatTime(restTimer)}</Text>
        </View>
      )}

      {/* Sets Tracker */}
      <View style={styles.setsSection}>
        <View style={styles.setsHeader}>
          <Text style={styles.setsTitle}>Sets</Text>
          <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
            <Plus size={16} color="#2563EB" />
            <Text style={styles.addSetText}>Add Set</Text>
          </TouchableOpacity>
        </View>
        
        {progress.sets.map((set, index) => (
          <View key={index} style={[styles.setCard, set.completed && styles.completedSetCard]}>
            <View style={styles.setHeader}>
              <Text style={styles.setNumber}>Set {set.setNumber}</Text>
              <View style={styles.setActions}>
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => handleSetComplete(index)}
                >
                  {set.completed ? (
                    <CheckCircle size={20} color="#059669" />
                  ) : (
                    <Circle size={20} color="#94A3B8" />
                  )}
                </TouchableOpacity>
                {progress.sets.length > 1 && (
                  <TouchableOpacity 
                    style={styles.removeSetButton}
                    onPress={() => removeSet(index)}
                  >
                    <Minus size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <View style={styles.setInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reps</Text>
                <View style={styles.inputContainer}>
                  <TouchableOpacity 
                    style={styles.inputButton}
                    onPress={() => updateSetValue(index, 'reps', set.reps - 1)}
                  >
                    <Minus size={16} color="#64748B" />
                  </TouchableOpacity>
                  <Text style={styles.inputValue}>{set.reps}</Text>
                  <TouchableOpacity 
                    style={styles.inputButton}
                    onPress={() => updateSetValue(index, 'reps', set.reps + 1)}
                  >
                    <Plus size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <View style={styles.inputContainer}>
                  <TouchableOpacity 
                    style={styles.inputButton}
                    onPress={() => updateSetValue(index, 'weight', set.weight - 2.5)}
                  >
                    <Minus size={16} color="#64748B" />
                  </TouchableOpacity>
                  <Text style={styles.inputValue}>{set.weight}</Text>
                  <TouchableOpacity 
                    style={styles.inputButton}
                    onPress={() => updateSetValue(index, 'weight', set.weight + 2.5)}
                  >
                    <Plus size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Rest (s)</Text>
                <View style={styles.inputContainer}>
                  <TouchableOpacity 
                    style={styles.inputButton}
                    onPress={() => updateSetValue(index, 'restTime', set.restTime - 15)}
                  >
                    <Minus size={16} color="#64748B" />
                  </TouchableOpacity>
                  <Text style={styles.inputValue}>{set.restTime}</Text>
                  <TouchableOpacity 
                    style={styles.inputButton}
                    onPress={() => updateSetValue(index, 'restTime', set.restTime + 15)}
                  >
                    <Plus size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Notes */}
      <View style={styles.notesSection}>
        <Text style={styles.notesLabel}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add notes about your workout..."
          value={progress.notes}
          onChangeText={(text) => setProgress(prev => ({ ...prev, notes: text }))}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
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
          {exercise.name}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Save size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Exercise Image */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: exercise.thumbnail_url || 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2' }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
        </View>

        {/* Exercise Info Table */}
        <ExerciseInfoTable />

        {/* Exercise Instructions */}
        <ExerciseInstructions />

        {/* Workout Tracker */}
        {progress.status !== 'not_started' && <WorkoutTracker />}

        {/* Control Buttons */}
        <View style={styles.controlSection}>
          {progress.status === 'not_started' && (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartExercise}
            >
              <Play size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          )}

          {progress.status === 'in_progress' && (
            <View style={styles.controlButtons}>
              <TouchableOpacity 
                style={styles.pauseButton}
                onPress={isTimerRunning ? handlePauseExercise : handleResumeExercise}
              >
                {isTimerRunning ? (
                  <>
                    <Pause size={20} color="#FFFFFF" />
                    <Text style={styles.pauseButtonText}>Pause</Text>
                  </>
                ) : (
                  <>
                    <Play size={20} color="#FFFFFF" />
                    <Text style={styles.pauseButtonText}>Resume</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.finishButton}
                onPress={handleFinishExercise}
              >
                <Square size={20} color="#FFFFFF" />
                <Text style={styles.finishButtonText}>Finish Exercise</Text>
              </TouchableOpacity>
            </View>
          )}

          {progress.status === 'completed' && (
            <View style={styles.completedSection}>
              <CheckCircle size={48} color="#059669" />
              <Text style={styles.completedTitle}>Exercise Completed!</Text>
              <Text style={styles.completedText}>
                Duration: {formatTime(progress.totalDuration)}
              </Text>
              <Text style={styles.completedText}>
                Sets Completed: {progress.sets.filter(set => set.completed).length}
              </Text>
            </View>
          )}
        </View>
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
  imageSection: {
    height: 200,
    backgroundColor: '#FFFFFF',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  infoTable: {
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
  tableTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    width: 120,
  },
  tableValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    flex: 1,
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
    textTransform: 'capitalize',
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  muscleTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  muscleTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  secondaryMuscleTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  secondaryMuscleTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  instructionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  instructionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 8,
  },
  trackerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  restTimerCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  restTimerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    marginBottom: 4,
  },
  restTimerText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#92400E',
  },
  setsSection: {
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
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  setsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addSetText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  setCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedSetCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  setNumber: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  setActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeButton: {
    padding: 4,
  },
  removeSetButton: {
    padding: 4,
  },
  setInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    minWidth: 40,
    textAlign: 'center',
  },
  notesSection: {
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
  notesLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  controlSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  startButton: {
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
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  pauseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  finishButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  finishButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  completedSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginTop: 16,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
});