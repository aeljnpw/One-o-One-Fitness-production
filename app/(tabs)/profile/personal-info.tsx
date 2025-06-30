import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, User, Mail, Phone, Calendar, MapPin, Ruler, Weight } from 'lucide-react-native';
import { router } from 'expo-router';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  address: string;
  city: string;
  country: string;
  emergencyContact: string;
  emergencyPhone: string;
}

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function PersonalInfoScreen() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    height: '175',
    weight: '70',
    address: '123 Fitness Street',
    city: 'San Francisco',
    country: 'United States',
    emergencyContact: 'Sarah Johnson',
    emergencyPhone: '+1 (555) 987-6543',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setIsEditing(false);
    
    Alert.alert('Success', 'Personal information updated successfully!');
  };

  const updateField = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    icon,
    keyboardType = 'default',
    multiline = false 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: React.ReactNode;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
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
        <Text style={styles.title}>Personal Information</Text>
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
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="First Name"
                  value={personalInfo.firstName}
                  onChangeText={(text) => updateField('firstName', text)}
                  placeholder="Enter first name"
                  icon={<User size={20} color="#64748B" />}
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Last Name"
                  value={personalInfo.lastName}
                  onChangeText={(text) => updateField('lastName', text)}
                  placeholder="Enter last name"
                  icon={<User size={20} color="#64748B" />}
                />
              </View>
            </View>

            <InputField
              label="Email Address"
              value={personalInfo.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="Enter email address"
              icon={<Mail size={20} color="#64748B" />}
              keyboardType="email-address"
            />

            <InputField
              label="Phone Number"
              value={personalInfo.phone}
              onChangeText={(text) => updateField('phone', text)}
              placeholder="Enter phone number"
              icon={<Phone size={20} color="#64748B" />}
              keyboardType="phone-pad"
            />

            <InputField
              label="Date of Birth"
              value={personalInfo.dateOfBirth}
              onChangeText={(text) => updateField('dateOfBirth', text)}
              placeholder="YYYY-MM-DD"
              icon={<Calendar size={20} color="#64748B" />}
            />

            <SelectField
              label="Gender"
              value={personalInfo.gender}
              options={genderOptions}
              onSelect={(value) => updateField('gender', value)}
              icon={<User size={20} color="#64748B" />}
            />
          </View>
        </View>

        {/* Physical Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Information</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Height (cm)"
                  value={personalInfo.height}
                  onChangeText={(text) => updateField('height', text)}
                  placeholder="Enter height"
                  icon={<Ruler size={20} color="#64748B" />}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Weight (kg)"
                  value={personalInfo.weight}
                  onChangeText={(text) => updateField('weight', text)}
                  placeholder="Enter weight"
                  icon={<Weight size={20} color="#64748B" />}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          <View style={styles.sectionContent}>
            <InputField
              label="Street Address"
              value={personalInfo.address}
              onChangeText={(text) => updateField('address', text)}
              placeholder="Enter street address"
              icon={<MapPin size={20} color="#64748B" />}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="City"
                  value={personalInfo.city}
                  onChangeText={(text) => updateField('city', text)}
                  placeholder="Enter city"
                  icon={<MapPin size={20} color="#64748B" />}
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Country"
                  value={personalInfo.country}
                  onChangeText={(text) => updateField('country', text)}
                  placeholder="Enter country"
                  icon={<MapPin size={20} color="#64748B" />}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.sectionContent}>
            <InputField
              label="Contact Name"
              value={personalInfo.emergencyContact}
              onChangeText={(text) => updateField('emergencyContact', text)}
              placeholder="Enter emergency contact name"
              icon={<User size={20} color="#64748B" />}
            />

            <InputField
              label="Contact Phone"
              value={personalInfo.emergencyPhone}
              onChangeText={(text) => updateField('emergencyPhone', text)}
              placeholder="Enter emergency contact phone"
              icon={<Phone size={20} color="#64748B" />}
              keyboardType="phone-pad"
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