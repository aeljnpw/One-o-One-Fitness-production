# One-o-One Fitness

A React Native/Expo fitness application with real-time data synchronization using Supabase.

## Features

- Equipment management
- Workout templates
- Exercise library
- Workout session tracking
- Real-time data synchronization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd One-o-One-Fitness-production
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the development server:
```bash
npm start
```

## Environment Variables

The following environment variables are required:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

You can find these values in your Supabase project dashboard under Settings > API.

## Database Schema

The application uses a Supabase database with the following main tables:

- `equipment`: Fitness equipment catalog
- `exercises`: Exercise library
- `workout_templates`: Predefined workout templates
- `workout_sessions`: User workout sessions
- `exercise_sets`: Exercise sets within workout sessions

For the complete schema, refer to the database migration files.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Your chosen license]
