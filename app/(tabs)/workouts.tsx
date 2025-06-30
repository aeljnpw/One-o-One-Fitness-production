import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dumbbell, Clock, Flame, Filter } from 'lucide-react-native';

interface Workout {
  id: number;
  name: string;
  duration: string;
  calories: string;
  exercises: number;
  intensity: string;
}

export default function WorkoutsScreen() {
  const workouts: Workout[] = [
    {
      id: 1,
      name: 'Upper Body Strength',
      duration: '45 min',
      calories: '320',
      exercises: 8,
      intensity: 'Intermediate',
    },
    {
      id: 2,
      name: 'Core Blast',
      duration: '20 min',
      calories: '180',
      exercises: 6,
      intensity: 'Beginner',
    },
    {
      id: 3,
      name: 'HIIT Cardio',
      duration: '30 min',
      calories: '400',
      exercises: 10,
      intensity: 'Advanced',
    },
    {
      id: 4,
      name: 'Leg Day',
      duration: '60 min',
      calories: '450',
      exercises: 12,
      intensity: 'Intermediate',
    },
  ];

  const WorkoutCard = ({ workout }: { workout: Workout }) => (
    <TouchableOpacity style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <View style={styles.intensityBadge}>
          <Text style={styles.intensityText}>{workout.intensity}</Text>
        </View>
      </View>
      
      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <Clock size={16} color="#64748B" />
          <Text style={styles.statText}>{workout.duration}</Text>
        </View>
        <View style={styles.statItem}>
          <Flame size={16} color="#64748B" />
          <Text style={styles.statText}>{workout.calories} cal</Text>
        </View>
        <View style={styles.statItem}>
          <Dumbbell size={16} color="#64748B" />
          <Text style={styles.statText}>{workout.exercises} exercises</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Workouts List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  intensityBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  intensityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
});