import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, User, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit3, Trophy, Clock, Target } from 'lucide-react-native';
import { getSupabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuItems}>
        {children}
      </View>
    </View>
  );

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          {icon}
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {rightComponent}
        {showChevron && <ChevronRight size={20} color="#94A3B8" />}
      </View>
    </TouchableOpacity>
  );

  const handleSignOut = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatar}>
                <Edit3 size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userEmail}>alex.johnson@email.com</Text>
              <Text style={styles.joinDate}>Member since January 2024</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Trophy size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Clock size={24} color="#2563EB" />
            </View>
            <Text style={styles.statValue}>156h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Target size={24} color="#059669" />
            </View>
            <Text style={styles.statValue}>89%</Text>
            <Text style={styles.statLabel}>Goal Rate</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <MenuSection title="Account">
          <MenuItem
            icon={<User size={20} color="#64748B" />}
            title="Personal Information"
            subtitle="Update your personal details"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Bell size={20} color="#64748B" />}
            title="Notifications"
            subtitle="Manage your notification preferences"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#F1F5F9', true: '#DBEAFE' }}
                thumbColor={notificationsEnabled ? '#2563EB' : '#94A3B8'}
              />
            }
            showChevron={false}
          />
          <MenuItem
            icon={<Shield size={20} color="#64748B" />}
            title="Privacy & Security"
            subtitle="Control your privacy settings"
            onPress={() => {}}
          />
        </MenuSection>

        <MenuSection title="Preferences">
          <MenuItem
            icon={<Target size={20} color="#64748B" />}
            title="Fitness Goals"
            subtitle="Update your fitness objectives"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Bell size={20} color="#64748B" />}
            title="Workout Reminders"
            subtitle="Set when to receive workout reminders"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Shield size={20} color="#64748B" />}
            title="Private Profile"
            subtitle="Make your profile private"
            rightComponent={
              <Switch
                value={privateProfile}
                onValueChange={setPrivateProfile}
                trackColor={{ false: '#F1F5F9', true: '#DBEAFE' }}
                thumbColor={privateProfile ? '#2563EB' : '#94A3B8'}
              />
            }
            showChevron={false}
          />
        </MenuSection>

        <MenuSection title="Support">
          <MenuItem
            icon={<HelpCircle size={20} color="#64748B" />}
            title="Help & Support"
            subtitle="Get help with the app"
            onPress={() => {}}
          />
          <MenuItem
            icon={<User size={20} color="#64748B" />}
            title="Contact Us"
            subtitle="Reach out to our support team"
            onPress={() => {}}
          />
        </MenuSection>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>FitTracker v1.0.0</Text>
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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  editProfileButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editProfileText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItems: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});