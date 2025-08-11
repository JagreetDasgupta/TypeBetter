# TypeBetter - Advanced Typing Practice Platform

A comprehensive, modern typing practice application built with Next.js 15, React 19, TypeScript, and MongoDB. Features real-time analytics, user authentication, leaderboards, and anti-cheat protection.

## 🚀 Features

### Core Functionality
- **Multiple Test Modes**: Time-based (30s, 60s, 120s), Word count (25, 50, 100), Quote-based tests
- **Real-time Analytics**: Live WPM, accuracy, error tracking, keystroke analysis
- **Anti-cheat Protection**: Fast keystroke detection, tab switching monitoring, mouse movement detection
- **Focus Mode**: Distraction-free typing experience with minimal UI
- **Responsive Design**: Optimized for desktop and mobile devices

### User System
- **Authentication**: Secure JWT-based login/registration with bcrypt password hashing
- **User Profiles**: Comprehensive statistics, preferences, and progress tracking
- **Session Management**: Persistent sessions with automatic cleanup
- **Data Persistence**: Complete typing history and performance analytics

### Advanced Features
- **Dynamic Leaderboards**: Global and mode-specific rankings with timeframe filtering
- **Virtual Keyboard**: Visual feedback with multiple layout support (QWERTY, AZERTY, Dvorak)
- **Sound Effects**: Audio feedback for typing with customizable settings
- **Theme System**: Light, dark, and system theme support
- **Layout Modes**: Compact and expanded UI layouts with smooth animations

## 🏗️ Project Structure

```
TypeBetter/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel
│   │   └── page.tsx             # Database management interface
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin endpoints
│   │   │   └── populate-dummy/  # Dummy data population
│   │   │       └── route.ts
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login/           # User login
│   │   │   │   └── route.ts
│   │   │   ├── logout/          # User logout
│   │   │   │   └── route.ts
│   │   │   ├── me/              # Current user info
│   │   │   │   └── route.ts
│   │   │   └── register/        # User registration
│   │   │       └── route.ts
│   │   ├── leaderboard/         # Leaderboard data
│   │   │   └── route.ts
│   │   ├── test-db/             # Database connection test
│   │   │   └── route.ts
│   │   └── typing/              # Typing test endpoints
│   │       ├── history/         # User typing history
│   │       │   └── route.ts
│   │       └── save-test/       # Save test results
│   │           └── route.ts
│   ├── globals.css              # Global styles and animations
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Main typing interface
├── components/                   # React components
│   ├── ui/                      # Shadcn/ui component library
│   │   ├── accordion.tsx        # Collapsible content
│   │   ├── alert-dialog.tsx     # Modal dialogs
│   │   ├── alert.tsx            # Alert notifications
│   │   ├── aspect-ratio.tsx     # Responsive aspect ratios
│   │   ├── avatar.tsx           # User avatars
│   │   ├── badge.tsx            # Status badges
│   │   ├── breadcrumb.tsx       # Navigation breadcrumbs
│   │   ├── button.tsx           # Interactive buttons
│   │   ├── calendar.tsx         # Date picker
│   │   ├── card.tsx             # Content containers
│   │   ├── carousel.tsx         # Image/content carousel
│   │   ├── chart.tsx            # Data visualization
│   │   ├── checkbox.tsx         # Form checkboxes
│   │   ├── collapsible.tsx      # Expandable sections
│   │   ├── command.tsx          # Command palette
│   │   ├── context-menu.tsx     # Right-click menus
│   │   ├── dialog.tsx           # Modal windows
│   │   ├── drawer.tsx           # Slide-out panels
│   │   ├── dropdown-menu.tsx    # Dropdown selections
│   │   ├── form.tsx             # Form components
│   │   ├── hover-card.tsx       # Hover tooltips
│   │   ├── input-otp.tsx        # OTP input fields
│   │   ├── input.tsx            # Text input fields
│   │   ├── label.tsx            # Form labels
│   │   ├── menubar.tsx          # Navigation menus
│   │   ├── navigation-menu.tsx  # Complex navigation
│   │   ├── pagination.tsx       # Page navigation
│   │   ├── popover.tsx          # Floating content
│   │   ├── progress.tsx         # Progress indicators
│   │   ├── radio-group.tsx      # Radio button groups
│   │   ├── resizable.tsx        # Resizable panels
│   │   ├── scroll-area.tsx      # Custom scrollbars
│   │   ├── select.tsx           # Dropdown selects
│   │   ├── separator.tsx        # Visual dividers
│   │   ├── sheet.tsx            # Side panels
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   ├── skeleton.tsx         # Loading placeholders
│   │   ├── slider.tsx           # Range sliders
│   │   ├── sonner.tsx           # Toast notifications
│   │   ├── switch.tsx           # Toggle switches
│   │   ├── table.tsx            # Data tables
│   │   ├── tabs.tsx             # Tabbed interfaces
│   │   ├── textarea.tsx         # Multi-line text input
│   │   ├── toast.tsx            # Notification system
│   │   ├── toaster.tsx          # Toast container
│   │   ├── toggle-group.tsx     # Toggle button groups
│   │   ├── toggle.tsx           # Toggle buttons
│   │   ├── tooltip.tsx          # Hover tooltips
│   │   ├── use-mobile.tsx       # Mobile detection hook
│   │   └── use-toast.ts         # Toast notification hook
│   ├── analytics.tsx            # Performance analytics dashboard
│   ├── auth-modal.tsx           # Login/registration modal
│   ├── dashboard.tsx            # User dashboard with statistics
│   ├── leaderboard.tsx          # Global leaderboard display
│   ├── navigation.tsx           # Main navigation bar
│   ├── results-modal.tsx        # Test results display
│   ├── settings.tsx             # User preferences modal
│   ├── theme-provider.tsx       # Theme context provider
│   ├── typing-tracker.tsx       # Keystroke tracking logic
│   └── virtual-keyboard.tsx     # On-screen keyboard display
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts             # Authentication state management
│   ├── use-history.ts          # Typing history management
│   ├── use-key-sound.ts        # Keyboard sound effects
│   ├── use-local-storage.ts    # Local storage utilities
│   ├── use-mobile.tsx          # Mobile device detection
│   ├── use-settings.ts         # User settings management
│   └── use-toast.ts            # Toast notification system
├── lib/                        # Utility libraries
│   ├── auth.ts                 # Authentication utilities
│   ├── models.ts               # TypeScript interfaces
│   ├── mongodb.ts              # Database connection
│   ├── texts.ts                # Text generation utilities
│   ├── typing-data.ts          # Data management functions
│   └── utils.ts                # General utility functions
├── public/                     # Static assets
│   ├── placeholder-logo.png    # Application logo
│   ├── placeholder-logo.svg    # Vector logo
│   ├── placeholder-user.jpg    # Default user avatar
│   ├── placeholder.jpg         # Generic placeholder
│   └── placeholder.svg         # Vector placeholder
├── scripts/                    # Utility scripts
│   ├── populate-dummy-data.js  # Database seeding script
│   └── test-db.js             # Database connection test
├── styles/                     # Additional stylesheets
│   └── globals.css            # Global CSS styles
├── env.example                # Environment variables template
├── package-lock.json          # NPM dependency lock
├── package-scripts.json       # Custom script definitions
└── package.json              # Project configuration
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Components**: Shadcn/ui component library
- **Icons**: Lucide React icon set
- **Charts**: Recharts for data visualization
- **Themes**: Next-themes for theme management

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: MongoDB with native driver
- **Authentication**: JWT tokens with bcrypt hashing
- **Session Management**: Custom session handling
- **Data Validation**: Zod schema validation

### Development Tools
- **Language**: TypeScript for type safety
- **Package Manager**: NPM with lock file
- **Code Quality**: ESLint configuration
- **Build System**: Next.js built-in bundling

## 📊 Database Schema

### Collections Overview
```javascript
// Users Collection
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  preferences: {
    theme: 'light' | 'dark' | 'system',
    soundEnabled: Boolean,
    keyboardLayout: 'qwerty' | 'azerty' | 'dvorak',
    defaultTestMode: 'time' | 'words' | 'quote',
    defaultTestDuration: Number,
    defaultWordCount: Number
  },
  stats: {
    totalTests: Number,
    totalTimeSpent: Number,
    averageWPM: Number,
    bestWPM: Number,
    averageAccuracy: Number,
    bestAccuracy: Number,
    totalWordsTyped: Number,
    totalCharactersTyped: Number,
    currentStreak: Number,
    longestStreak: Number
  }
}

// Typing Tests Collection
{
  _id: ObjectId,
  userId: ObjectId,
  testMode: 'time' | 'words' | 'quote',
  duration: Number,
  wordCount: Number,
  wpm: Number,
  accuracy: Number,
  adjustedWPM: Number,
  errors: Number,
  charactersTyped: Number,
  charactersCorrect: Number,
  text: String,
  completedAt: Date,
  createdAt: Date
}

// User Sessions Collection
{
  _id: ObjectId,
  userId: ObjectId,
  sessionToken: String,
  expiresAt: Date,
  createdAt: Date,
  lastActivityAt: Date,
  userAgent: String,
  ipAddress: String
}

// Keystroke Data Collection
{
  _id: ObjectId,
  userId: ObjectId,
  testId: ObjectId,
  key: String,
  timestamp: Date,
  isCorrect: Boolean,
  delay: Number,
  finger: String
}

// Finger Usage Statistics
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  finger: String,
  usage: Number,
  accuracy: Number,
  speed: Number,
  errors: Number
}

// Daily Statistics
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  testsCompleted: Number,
  totalTimeSpent: Number,
  averageWPM: Number,
  bestWPM: Number,
  averageAccuracy: Number,
  totalWordsTyped: Number,
  totalCharactersTyped: Number,
  errors: Number
}

// Leaderboard Entries
{
  _id: ObjectId,
  userId: ObjectId,
  username: String,
  wpm: Number,
  accuracy: Number,
  testMode: 'time' | 'words' | 'quote',
  duration: Number,
  createdAt: Date,
  isVerified: Boolean
}
```

## 🔧 API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
- Register new user account
- Body: { email, username, password }
- Returns: { success, user, message }

POST /api/auth/login
- User authentication
- Body: { email, password }
- Returns: { success, user, token }

POST /api/auth/logout
- End user session
- Headers: Authorization token
- Returns: { success, message }

GET /api/auth/me
- Get current user info
- Headers: Authorization token
- Returns: { user, preferences, stats }
```

### Typing Test Endpoints
```
POST /api/typing/save-test
- Save completed test results
- Body: { testMode, duration, wpm, accuracy, errors, text }
- Returns: { success, testId, updatedStats }

GET /api/typing/history
- Get user typing history
- Query: ?limit=50&skip=0
- Returns: { tests, totalCount, stats }
```

### Leaderboard Endpoints
```
GET /api/leaderboard
- Get leaderboard data
- Query: ?mode=time&sortBy=wpm&timeframe=all&limit=100
- Returns: { leaderboard, meta }
```

### Admin Endpoints
```
POST /api/admin/populate-dummy
- Populate database with dummy data
- Returns: { success, stats }

GET /api/test-db
- Test database connection
- Returns: { success, database, users, tests }
```

## 🎨 UI Components & Features

### Core Components
- **TypingInterface**: Main typing test area with real-time feedback
- **VirtualKeyboard**: Visual keyboard with finger positioning
- **StatsDisplay**: Live WPM, accuracy, and error tracking
- **ResultsModal**: Comprehensive test results with analytics
- **Leaderboard**: Dynamic rankings with filtering options

### User Interface Features
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Theme System**: Light/dark mode with system preference detection
- **Animations**: Smooth transitions and micro-interactions
- **Focus Mode**: Distraction-free typing environment
- **Layout Modes**: Compact and expanded UI options

### Accessibility Features
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Theme options for visual accessibility
- **Font Scaling**: Responsive typography system

## 🔒 Security Features

### Authentication Security
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic session cleanup
- **Input Validation**: Server-side validation for all inputs

### Anti-Cheat Protection
- **Keystroke Analysis**: Detection of unnaturally fast typing
- **Tab Switching**: Monitoring for focus changes during tests
- **Mouse Movement**: Detection of copy-paste attempts
- **Time Validation**: Server-side timing verification

### Data Protection
- **Environment Variables**: Secure configuration management
- **Database Security**: Connection string encryption
- **CORS Protection**: Restricted cross-origin requests
- **Rate Limiting**: API endpoint protection

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- Git for version control

### Environment Setup
1. **Clone Repository**
   ```bash
   git clone https://github.com/JagreetDasgupta/TypeBetter.git
   cd TypeBetter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Configure `.env.local`:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typebetter
   MONGODB_DB_NAME=typebetter
   
   # Authentication Secrets
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   
   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
   
   # External APIs
   QUOTABLE_API_URL=https://api.quotable.io
   ```

4. **Database Setup**
   - Create MongoDB Atlas cluster
   - Whitelist your IP address
   - Create database user with read/write permissions
   - Update connection string in `.env.local`

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Populate Sample Data**
   - Visit `http://localhost:3000/admin`
   - Click "Populate Dummy Leaderboard Data"

## 🌐 Deployment

### Render Deployment
1. **Prepare Repository**
   - Ensure all code is committed to GitHub
   - Verify environment variables are set

2. **Create Render Service**
   - Connect GitHub repository
   - Select "Web Service"
   - Configure build settings:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Node Version**: 18+

3. **Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typebetter
   MONGODB_DB_NAME=typebetter
   JWT_SECRET=production-jwt-secret-key
   SESSION_SECRET=production-session-secret-key
   NEXTAUTH_URL=https://your-app-name.onrender.com
   NEXTAUTH_SECRET=production-nextauth-secret
   ```

4. **Deploy & Test**
   - Render automatically builds and deploys
   - Visit deployed URL to test functionality
   - Populate data via `/admin` endpoint

### Vercel Deployment
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment**
   - Add environment variables in Vercel dashboard
   - Ensure MongoDB connection is accessible

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Static asset caching strategies

### Database Optimization
- **Indexing**: Strategic database indexes for queries
- **Aggregation**: Efficient data aggregation pipelines
- **Connection Pooling**: MongoDB connection management
- **Query Optimization**: Optimized database queries

### Monitoring & Analytics
- **Performance Metrics**: Core Web Vitals tracking
- **Error Monitoring**: Client and server error tracking
- **User Analytics**: Typing performance analytics
- **Database Monitoring**: Query performance tracking

## 🧪 Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing for custom React hooks
- Utility function testing
- API endpoint testing

### Integration Testing
- Database integration tests
- Authentication flow testing
- API endpoint integration
- User workflow testing

### Performance Testing
- Load testing for concurrent users
- Database performance testing
- API response time testing
- Frontend performance auditing

## 🔄 Development Workflow

### Code Organization
- **Component Structure**: Atomic design principles
- **Hook Patterns**: Custom hooks for state management
- **API Design**: RESTful API conventions
- **Type Safety**: Comprehensive TypeScript coverage

### Version Control
- **Git Flow**: Feature branch workflow
- **Commit Messages**: Conventional commit format
- **Code Reviews**: Pull request reviews
- **Release Management**: Semantic versioning

### Quality Assurance
- **Code Linting**: ESLint configuration
- **Type Checking**: TypeScript strict mode
- **Code Formatting**: Prettier integration
- **Pre-commit Hooks**: Automated quality checks

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards
- Follow TypeScript best practices
- Use semantic HTML and ARIA labels
- Write comprehensive tests
- Document complex functionality
- Follow existing code patterns

### Issue Reporting
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include environment information
- Suggest potential solutions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the excellent React framework
- **Vercel**: For deployment platform and tools
- **MongoDB**: For the flexible database solution
- **Shadcn/ui**: For the beautiful component library
- **Tailwind CSS**: For the utility-first CSS framework
- **React Team**: For the powerful UI library

## 📞 Support

For support, questions, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/JagreetDasgupta/TypeBetter/issues)
- **Email**: Contact the development team
- **Documentation**: Refer to this comprehensive README

---

**TypeBetter** - Elevate your typing skills with advanced practice tools and real-time analytics.