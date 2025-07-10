import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Target, Award, ChartBar as BarChart3, Activity, RefreshCw } from 'lucide-react-native';
import { useUserProgress } from '@/hooks/useUserProgress';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

const { width } = Dimensions.get('window');

interface ProgressData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export default function ProgressScreen() {
  const { progressData, loading, error, refetch } = useUserProgress();
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const periods = ['Week', 'Month', 'Year'];

  if (loading) {
    return <LoadingSpinner message="Loading your progress..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (!progressData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Activity size={64} color="#94A3B8" />
          <Text style={styles.emptyStateTitle}>No Progress Data</Text>
          <Text style={styles.emptyStateText}>
            Start working out to see your progress here!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const weeklyData: ProgressData[] = progressData.weeklyWorkouts.map((value, index) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const dayIndex = (today - 6 + index + 7) % 7;
    
    return {
      label: days[dayIndex],
      value: Math.min(value, 60), // Cap at 60 minutes for display
      maxValue: 60,
      color: '#2563EB'
    };
  });

  const renderBarChart = () => {
    const chartWidth = width - 80;
    const barWidth = (chartWidth - (weeklyData.length - 1) * 8) / weeklyData.length;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {weeklyData.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max((item.value / item.maxValue) * 100, 5)}%`,
                      backgroundColor: item.color,
                      width: barWidth,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTrendText = () => {
    const thisWeekWorkouts = weeklyData.reduce((sum, day) => sum + (day.value > 0 ? 1 : 0), 0);
    const lastWeekWorkouts = Math.max(1, thisWeekWorkouts - 1); // Simplified calculation
    const change = ((thisWeekWorkouts - lastWeekWorkouts) / lastWeekWorkouts * 100);
    
    if (change > 0) {
      return `+${Math.round(change)}% this week`;
    } else if (change < 0) {
      return `${Math.round(change)}% this week`;
    }
    return 'No change this week';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <TouchableOpacity style={styles.calendarButton} onPress={refetch}>
            <RefreshCw size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsOverview}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>{progressData.totalWorkouts.toLocaleString()}</Text>
            <Text style={styles.mainStatLabel}>Total Workouts</Text>
            <View style={styles.trendContainer}>
              <TrendingUp size={16} color="#059669" />
              <Text style={styles.trendText}>{getTrendText()}</Text>
            </View>
          </View>
          
          <View style={styles.subStats}>
            <View style={styles.subStat}>
              <Text style={styles.subStatValue}>{progressData.thisMonthWorkouts}</Text>
              <Text style={styles.subStatLabel}>This Month</Text>
            </View>
            <View style={styles.subStat}>
              <Text style={styles.subStatValue}>{formatTime(progressData.totalTimeMinutes)}</Text>
              <Text style={styles.subStatLabel}>Total Time</Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Workout Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Activity</Text>
            <BarChart3 size={20} color="#64748B" />
          </View>
          {renderBarChart()}
        </View>

        {/* Goals Section */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <View style={styles.goalsList}>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Target size={20} color="#2563EB" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Weekly Workouts</Text>
                  <Text style={styles.goalProgress}>
                    {progressData.thisMonthWorkouts}/12 this month
                  </Text>
                </View>
                <Text style={styles.goalPercentage}>
                  {Math.round(progressData.weeklyGoalProgress)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill, 
                  { width: `${Math.min(progressData.weeklyGoalProgress, 100)}%` }
                ]} />
              </View>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Activity size={20} color="#059669" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Calories Burned</Text>
                  <Text style={styles.goalProgress}>
                    {progressData.totalCaloriesBurned.toLocaleString()}/10,000 cal
                  </Text>
                </View>
                <Text style={styles.goalPercentage}>
                  {Math.round(progressData.calorieGoalProgress)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(progressData.calorieGoalProgress, 100)}%`, 
                    backgroundColor: '#059669' 
                  }
                ]} />
              </View>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Award size={20} color="#EA580C" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Workout Streak</Text>
                  <Text style={styles.goalProgress}>
                    {progressData.currentStreak} days current
                  </Text>
                </View>
                <Text style={styles.goalPercentage}>
                  {Math.round(progressData.streakGoalProgress)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(progressData.streakGoalProgress, 100)}%`, 
                    backgroundColor: '#EA580C' 
                  }
                ]} />
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            {progressData.recentAchievements.length > 0 ? (
              progressData.recentAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                  </View>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyAchievements}>
                <Award size={32} color="#94A3B8" />
                <Text style={styles.emptyAchievementsText}>
                  Complete more workouts to unlock achievements!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Personal Records */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          <View style={styles.recordsList}>
            {progressData.personalRecords.length > 0 ? (
              progressData.personalRecords.map((record, index) => (
                <View key={`${record.exercise}-${record.type}-${index}`} style={styles.recordItem}>
                  <Text style={styles.recordExercise}>{record.exercise}</Text>
                  <Text style={styles.recordValue}>{record.value}</Text>
                  <Text style={styles.recordDate}>{record.date}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyRecords}>
                <Target size={32} color="#94A3B8" />
                <Text style={styles.emptyRecordsText}>
                  Complete exercises to track your personal records!
                </Text>
              </View>
            )}
          </View>
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
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsOverview: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mainStat: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainStatValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  subStats: {
    flexDirection: 'row',
    gap: 16,
  },
  subStat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#2563EB',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activePeriodText: {
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  chartContainer: {
    height: 180,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barBackground: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  goalsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  goalProgress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  goalPercentage: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  recordsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  recordsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recordExercise: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  recordValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginRight: 16,
  },
  recordDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
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
  emptyAchievements: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyAchievementsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  emptyRecords: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyRecordsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
});