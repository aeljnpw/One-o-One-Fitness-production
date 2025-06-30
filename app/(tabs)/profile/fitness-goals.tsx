import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Target, TrendingUp, Calendar, Zap, Heart, Trophy, Clock, Flame } from 'lucide-react-native';
import { router } from 'expo-router';

interface FitnessGoals {
  primaryGoal: string;
  targetWeight: string;
  weeklyWorkouts: string;
  dailyCalories: string;
  dailySteps: string;
  waterIntake: string;
  sleepHours: string;
  workoutDuration: string;
  fitnessLevel: string;
  preferredActivities: string[];
  targetDate: string;
  motivation: string;
}

const primaryGoalOptions = [
  'Lose Weight',
  'Gain Muscle',
  'Improve Endurance',
  'General Fitness',
  'Strength Training',
  'Flexibility',
];

const fitnessLevelOptions = ['Beginner', 'Intermediate', 'Advanced'];

const activityOptions = [
  'Cardio',
  'Weight Training',
  'Yoga',
  'Running',
  'Swimming',
  'Cycling',
  'HIIT',
  'Pilates',
  'Boxing',
  'Dance',
];

export default function FitnessGoalsScreen() {
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoals>({
    primaryGoal: 'General Fitness',
    targetWeight: '68',
    weeklyWorkouts: '4',
    dailyCalories: '2000',
    dailySteps: '10000',
    waterIntake: '8',
    sleepHours: '8',
    workoutDuration: '45',
    fitnessLevel: 'Intermediate',
    preferredActivities: ['Cardio', 'Weight Training', 'Yoga'],
    targetDate: '2024-12-31',
    motivation: 'I want to improve my overall health and feel more confident in my body.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setIsEditing(false);
    
    Alert.alert('Success', 'Fitness goals updated successfully!');
  };

  const updateField = (field: keyof FitnessGoals, value: string | string[]) => {
    setFitnessGoals(prev => ({ ...prev, [field]: value }));
  };

  const toggleActivity = (activity: string) => {
    if (!isEditing) return;
    
    const currentActivities = fitnessGoals.preferredActivities;
    const updatedActivities = currentActivities.includes(activity)
      ? currentActivities.filter(a => a !== activity)
      : [...currentActivities, activity];
    
    updateField('preferredActivities', updatedActivities);
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    icon,
    keyboardType = 'default',
    unit,
    multiline = false 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: React.ReactNode;
    keyboardType?: 'default' | 'numeric';
    unit?: string;
    multiline?: boolean;
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}>
          {icon}
        </View>
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          editable={isEditing}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
        {unit && (
          <View style={styles.unitContainer}>
            <Text style={styles.unitText}>{unit}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const SelectField = ({ 
    label, 
    value, 
    options, 
    onSelect, 
    icon 
  }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    icon: React.ReactNode;
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.selectContainer}>
        <View style={styles.inputIcon}>
          {icon}
        </View>
        <View style={styles.selectOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.selectOption,
                value === option && styles.selectedOption,
                !isEditing && styles.disabledOption
              ]}
              onPress={() => isEditing && onSelect(option)}
              disabled={!isEditing}
            >
              <Text style={[
                styles.selectOptionText,
                value === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const MultiSelectField = ({ 
    label, 
    selectedValues, 
    options, 
    onToggle, 
    icon 
  }: {
    label: string;
    selectedValues: string[];
    options: string[];
    onToggle: (value: string) => void;
    icon: React.ReactNode;
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.selectContainer}>
        <View style={styles.inputIcon}>
          {icon}
        </View>
        <View style={styles.multiSelectOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectOption,
                selectedValues.includes(option) && styles.selectedMultiOption,
                !isEditing && styles.disabledOption
              ]}
              onPress={() => onToggle(option)}
              disabled={!isEditing}
            >
              <Text style={[
                styles.multiSelectOptionText,
                selectedValues.includes(option) && styles.selectedMultiOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
        <Text style={styles.title}>Fitness Goals</Text>
        <TouchableOpacity 
          style={[styles.actionButton, isEditing && styles.saveButton]}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
        >
          {isEditing ? (
            <>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </>
          ) : (
            <Text style={styles.editButtonText}>Edit</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Primary Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Goals</Text>
          <View style={styles.sectionContent}>
            <SelectField
              label="Main Fitness Goal"
              value={fitnessGoals.primaryGoal}
              options={primaryGoalOptions}
              onSelect={(value) => updateField('primaryGoal', value)}
              icon={<Target size={20} color="#64748B" />}
            />

            <SelectField
              label="Current Fitness Level"
              value={fitnessGoals.fitnessLevel}
              options={fitnessLevelOptions}
              onSelect={(value) => updateField('fitnessLevel', value)}
              icon={<TrendingUp size={20} color="#64748B" />}
            />

            <InputField
              label="Target Date"
              value={fitnessGoals.targetDate}
              onChangeText={(text) => updateField('targetDate', text)}
              placeholder="YYYY-MM-DD"
              icon={<Calendar size={20} color="#64748B" />}
            />
          </View>
        </View>

        {/* Physical Targets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Targets</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Target Weight"
                  value={fitnessGoals.targetWeight}
                  onChangeText={(text) => updateField('targetWeight', text)}
                  placeholder="Enter target weight"
                  icon={<Target size={20} color="#64748B" />}
                  keyboardType="numeric"
                  unit="kg"
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Weekly Workouts"
                  value={fitnessGoals.weeklyWorkouts}
                  onChangeText={(text) => updateField('weeklyWorkouts', text)}
                  placeholder="Number of workouts"
                  icon={<Calendar size={20} color="#64748B" />}
                  keyboardType="numeric"
                  unit="times"
                />
              </View>
            </View>

            <InputField
              label="Workout Duration"
              value={fitnessGoals.workoutDuration}
              onChangeText={(text) => updateField('workoutDuration', text)}
              placeholder="Average workout duration"
              icon={<Clock size={20} color="#64748B" />}
              keyboardType="numeric"
              unit="minutes"
            />
          </View>
        </View>

        {/* Daily Targets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Targets</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Daily Calories"
                  value={fitnessGoals.dailyCalories}
                  onChangeText={(text) => updateField('dailyCalories', text)}
                  placeholder="Calorie goal"
                  icon={<Flame size={20} color="#64748B" />}
                  keyboardType="numeric"
                  unit="cal"
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Daily Steps"
                  value={fitnessGoals.dailySteps}
                  onChangeText={(text) => updateField('dailySteps', text)}
                  placeholder="Step goal"
                  icon={<Zap size={20} color="#64748B" />}
                  keyboardType="numeric"
                  unit="steps"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Water Intake"
                  value={fitnessGoals.waterIntake}
                  onChangeText={(text) => updateField('waterIntake', text)}
                  placeholder="Glasses per day"
                  icon={<Heart size={20} color="#64748B" />}
                  keyboardType="numeric"
                  unit="glasses"
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Sleep Hours"
                  value={fitnessGoals.sleepHours}
                  onChangeText={(text) => updateField('sleepHours', text)}
                  placeholder="Hours of sleep"
                  icon={<Clock size={20} color="#64748B" />}
                  keyboardType="numeric"
                  unit="hours"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Preferred Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Activities</Text>
          <View style={styles.sectionContent}>
            <MultiSelectField
              label="Activities You Enjoy"
              selectedValues={fitnessGoals.preferredActivities}
              options={activityOptions}
              onToggle={toggleActivity}
              icon={<Trophy size={20} color="#64748B" />}
            />
          </View>
        </View>

        {/* Motivation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivation</Text>
          <View style={styles.sectionContent}>
            <InputField
              label="What motivates you?"
              value={fitnessGoals.motivation}
              onChangeText={(text) => updateField('motivation', text)}
              placeholder="Describe what motivates you to reach your fitness goals..."
              icon={<Heart size={20} color="#64748B" />}
              multiline
            />
          </View>
        </View>

        {/* Cancel Button (only shown when editing) */}
        {isEditing && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel Changes</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  multilineInput: {
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  unitContainer: {
    paddingRight: 16,
  },
  unitText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectOptions: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 16,
  },
  selectOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedOption: {
    backgroundColor: '#2563EB',
  },
  disabledOption: {
    opacity: 0.6,
  },
  selectOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  multiSelectOptions: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingRight: 16,
    gap: 8,
  },
  multiSelectOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  selectedMultiOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  multiSelectOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  selectedMultiOptionText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
});