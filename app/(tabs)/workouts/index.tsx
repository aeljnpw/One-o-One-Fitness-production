import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dumbbell, Clock, Flame, Filter, Search, ChevronRight, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react-native';
import { useEquipment } from '@/hooks/useEquipment';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { router } from 'expo-router';

interface EquipmentWithWorkouts {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  workoutCount: number;
  estimatedDuration: string;
  caloriesBurned: string;
}

export default function WorkoutsScreen() {
  const { equipment, loading, error, refetch } = useEquipment();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Debug logging
  console.log('🏋️ Workouts Screen - Equipment data:', equipment?.length || 0);
  console.log('⏳ Workouts Screen - Loading:', loading);
  console.log('❌ Workouts Screen - Error:', error);
  console.log('📋 Workouts Screen - Equipment items:', equipment);

  // Transform equipment data to include workout information
  const equipmentWithWorkouts: EquipmentWithWorkouts[] = equipment.map(item => ({
    ...item,
    workoutCount: Math.floor(Math.random() * 15) + 3, // Simulated workout count
    estimatedDuration: `${Math.floor(Math.random() * 45) + 15} min`,
    caloriesBurned: `${Math.floor(Math.random() * 300) + 150}`,
  }));

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(equipment.map(item => item.category)))];

  // Filter equipment based on search and category
  const filteredEquipment = equipmentWithWorkouts.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('Filtered equipment count:', filteredEquipment.length);

  if (loading) {
    return <LoadingSpinner message="Loading equipment..." />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Equipment & Workouts</Text>
        </View>
        <ErrorMessage message={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const handleEquipmentPress = (equipmentId: string) => {
    console.log('Navigating to equipment:', equipmentId);
    router.push(`/workouts/equipment/${equipmentId}`);
  };

  const EquipmentCard = ({ equipment }: { equipment: EquipmentWithWorkouts }) => (
    <TouchableOpacity 
      style={styles.equipmentCard}
      onPress={() => handleEquipmentPress(equipment.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {equipment.image_url ? (
          <Image 
            source={{ uri: equipment.image_url }} 
            style={styles.equipmentImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Dumbbell size={32} color="#64748B" />
          </View>
        )}
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <Text style={styles.equipmentName}>{equipment.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{equipment.category}</Text>
            </View>
          </View>
          <Text style={styles.equipmentDescription} numberOfLines={2}>
            {equipment.description}
          </Text>
          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Dumbbell size={14} color="#64748B" />
              <Text style={styles.statText}>{equipment.workoutCount} workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={14} color="#64748B" />
              <Text style={styles.statText}>{equipment.estimatedDuration}</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={14} color="#64748B" />
              <Text style={styles.statText}>{equipment.caloriesBurned} cal</Text>
            </View>
          </View>
        </View>
        <ChevronRight size={20} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );

  const CategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
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
            styles.categoryButtonText,
            selectedCategory === category && styles.activeCategoryButtonText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Debug info component
  const DebugInfo = () => (
    <View style={styles.debugInfo}>
      <Text style={styles.debugText}>
        Equipment loaded: {equipment.length} | Filtered: {filteredEquipment.length}
      </Text>
      {equipment.length === 0 && (
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <RefreshCw size={16} color="#2563EB" />
          <Text style={styles.retryText}>Retry Loading</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Equipment & Workouts</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Debug Info */}
      <DebugInfo />

      {/* Stats Overview */}
      <View style={styles.statsOverview}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{equipment.length}</Text>
          <Text style={styles.statLabel}>Equipment</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{categories.length - 1}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {equipmentWithWorkouts.reduce((sum, item) => sum + item.workoutCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
      </View>

      {/* Equipment List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {equipment.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertCircle size={48} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No equipment found</Text>
            <Text style={styles.emptyStateText}>
              Check your database connection or add equipment to your database
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredEquipment.length === 0 ? (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No equipment matches your search</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        ) : (
          filteredEquipment.map((equipment) => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCategoryButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  debugInfo: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  retryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  statsOverview: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  equipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  equipmentName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  equipmentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
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
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
});