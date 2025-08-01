import 'dotenv/config';

export default {
  name: 'One-o-One-Fitness',
  slug: 'one-o-one-fitness',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'one-o-one-fitness',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.oneoonefitness.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.oneoonefitness.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
    eas: {
      projectId: 'your-project-id'
    }
  }
}; 