# TypeMaster Pro - Typing Practice Application

A modern, feature-rich typing practice application built with Next.js, React, and MongoDB.

## Features

- **Real-time Typing Tests**: Time, words, and quote-based tests
- **User Authentication**: Secure login/registration with MongoDB
- **Progress Tracking**: Comprehensive statistics and history
- **Analytics Dashboard**: Detailed insights into typing performance
- **Leaderboards**: Global and local rankings
- **Keystroke Heatmap**: Visual representation of keyboard usage
- **Finger Analysis**: Track performance by finger
- **Responsive Design**: Works on desktop and mobile
- **Sound Effects**: Audio feedback for typing
- **Multiple Themes**: Light, dark, and system themes
- **Focus Mode**: Distraction-free typing experience

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: MongoDB
- **Authentication**: JWT tokens, bcrypt password hashing
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Typing-Practice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/typing-practice
   MONGODB_DB_NAME=typing-practice
   
   # Authentication Secrets (Change these in production!)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   
   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
   
   # Optional: External APIs
   QUOTABLE_API_URL=https://api.quotable.io
   ```

4. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   - Install MongoDB Community Server
   - Start MongoDB service
   - Create database: `typing-practice`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string and update `MONGODB_URI`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Collections

The application creates the following MongoDB collections:

- **users**: User accounts and preferences
- **sessions**: User session management
- **typing-tests**: Individual test results
- **keystrokes**: Detailed keystroke data
- **finger-usage**: Finger performance statistics
- **daily-stats**: Daily aggregated statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Typing Data
- `POST /api/typing/save-test` - Save test results
- `GET /api/typing/history` - Get user history

### Leaderboards
- `GET /api/leaderboard` - Get leaderboard data

## Usage

### Getting Started
1. Register a new account or sign in
2. Choose your preferred test mode (Time, Words, or Quote)
3. Start typing and see your real-time performance
4. View your results and statistics in the Dashboard
5. Check the Analytics tab for detailed insights

### Test Modes
- **Time Mode**: Type for a fixed duration (30s, 60s, 120s)
- **Words Mode**: Type a specific number of words
- **Quote Mode**: Type famous quotes from the API

### Features
- **Focus Mode**: Hide distractions for better concentration
- **Sound Effects**: Enable/disable typing sounds
- **Theme Switching**: Choose light, dark, or system theme
- **Keyboard Layout**: Support for different keyboard layouts
- **Statistics**: Track WPM, accuracy, and progress over time

## Development

### Project Structure
```
Typing-Practice/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── analytics.tsx     # Analytics dashboard
│   ├── auth-modal.tsx    # Authentication modal
│   ├── dashboard.tsx     # User dashboard
│   ├── leaderboard.tsx   # Leaderboard component
│   ├── navigation.tsx    # Navigation bar
│   ├── settings.tsx      # Settings modal
│   └── virtual-keyboard.tsx # Virtual keyboard
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication utilities
│   ├── mongodb.ts       # Database connection
│   ├── models.ts        # TypeScript interfaces
│   ├── texts.ts         # Text generation
│   └── typing-data.ts   # Data management
└── public/              # Static assets
```

### Adding New Features
1. Create new API routes in `app/api/`
2. Add TypeScript interfaces in `lib/models.ts`
3. Create utility functions in `lib/`
4. Build React components in `components/`
5. Add custom hooks in `hooks/`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Set up MongoDB Atlas for database
- Configure environment variables
- Build and deploy using platform-specific instructions

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGODB_DB_NAME` | Database name | No (default: typing-practice) |
| `JWT_SECRET` | JWT signing secret | Yes |
| `SESSION_SECRET` | Session encryption secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes |
| `QUOTABLE_API_URL` | External quotes API | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
