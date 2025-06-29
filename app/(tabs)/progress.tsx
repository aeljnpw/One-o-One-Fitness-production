import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Target, Award, ChartBar as BarChart3, Activity } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ProgressData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const weeklyData: ProgressData[] = [
  { label: 'Mon', value: 45, maxValue: 60, color: '#2563EB' },
  { label: 'Tue', value: 60, maxValue: 60, color: '#2563EB' },
  { label: 'Wed', value: 30, maxValue: 60, color: '#2563EB' },
  { label: 'Thu', value: 52, maxValue: 60, color: '#2563EB' },
  { label: 'Fri', value: 38, maxValue: 60, color: '#2563EB' },
  { label: 'Sat', value: 48, maxValue: 60, color: '#2563EB' },
  { label: 'Sun', value: 25, maxValue: 60, color: '#2563EB' },
];

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const periods = ['Week', 'Month', 'Year'];

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
                      height: `${(item.value / item.maxValue) * 100}%`,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsOverview}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>1,247</Text>
            <Text style={styles.mainStatLabel}>Total Workouts</Text>
            <View style={styles.trendContainer}>
              <TrendingUp size={16} color="#059669" />
              <Text style={styles.trendText}>+12% this month</Text>
            </View>
          </View>
          
          <View style={styles.subStats}>
            <View style={styles.subStat}>
              <Text style={styles.subStatValue}>78</Text>
              <Text style={styles.subStatLabel}>This Month</Text>
            </View>
            <View style={styles.subStat}>
              <Text style={styles.subStatValue}>156h</Text>
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
                  <Text style={styles.goalProgress}>5/7 completed</Text>
                </View>
                <Text style={styles.goalPercentage}>71%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '71%' }]} />
              </View>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Activity size={20} color="#059669" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Calories Burned</Text>
                  <Text style={styles.goalProgress}>1,890/2,500 cal</Text>
                </View>
                <Text style={styles.goalPercentage}>76%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '76%', backgroundColor: '#059669' }]} />
              </View>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Award size={20} color="#EA580C" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Workout Streak</Text>
                  <Text style={styles.goalProgress}>14 days current</Text>
                </View>
                <Text style={styles.goalPercentage}>93%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '93%', backgroundColor: '#EA580C' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Award size={24} color="#F59E0B" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Consistency Master</Text>
                <Text style={styles.achievementDescription}>
                  Completed 7 workouts in a row
                </Text>
              </View>
              <Text style={styles.achievementDate}>Today</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Target size={24} color="#8B5CF6" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Goal Crusher</Text>
                <Text style={styles.achievementDescription}>
                  Exceeded weekly goal by 20%
                </Text>
              </View>
              <Text style={styles.achievementDate}>2 days ago</Text>
            </View>
          </View>
        </View>

        {/* Personal Records */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          <View style={styles.recordsList}>
            <View style={styles.recordItem}>
              <Text style={styles.recordExercise}>Push-ups</Text>
              <Text style={styles.recordValue}>52 reps</Text>
              <Text style={styles.recordDate}>Last week</Text>
            </View>
            <View style={styles.recordItem}>
              <Text style={styles.recordExercise}>Plank Hold</Text>
              <Text style={styles.recordValue}>3:45</Text>
              <Text style={styles.recordDate}>5 days ago</Text>
            </View>
            <View style={styles.recordItem}>
              <Text style={styles.recordExercise}>Workout Duration</Text>
              <Text style={styles.recordValue}>87 min</Text>
              <Text style={styles.recordDate}>Yesterday</Text>
            </View>
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
});