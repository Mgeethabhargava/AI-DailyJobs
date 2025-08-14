# Job Aggregator Flutter App

A modern Flutter mobile application for the Job Aggregator Platform, featuring real-time job fetching, advanced filtering, and offline support.

## Features

### Core Functionality
- **Real-time Job Viewing**: Browse jobs fetched from multiple platforms (Indeed, LinkedIn, Glassdoor)
- **Advanced Filtering**: Filter by keywords, location, salary, remote work, platform, and posting date
- **Job Details**: View comprehensive job information including requirements, company details, and application links
- **Offline Support**: Cache jobs locally for offline viewing
- **Push Notifications**: Get notified about new jobs matching your criteria

### User Experience
- **Modern UI/UX**: Clean, professional interface with dark/light theme support
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Pull-to-Refresh**: Easy job updates with pull gesture
- **Infinite Scroll**: Seamless loading of more jobs
- **Search Functionality**: Quick job search with instant results

### Technical Features
- **State Management**: BLoC pattern for predictable state management
- **Caching**: Hive database for efficient local storage
- **Network Handling**: Dio for robust HTTP requests with retry logic
- **Background Sync**: Automatic job updates in the background
- **Error Handling**: Comprehensive error states and recovery

## Architecture

The app follows Clean Architecture principles:

```
lib/
├── core/                  # Core functionality
│   ├── app.dart          # Main app configuration
│   ├── theme/            # App theming
│   └── di/               # Dependency injection
├── features/             # Feature modules
│   ├── jobs/            # Jobs feature
│   │   ├── data/        # Data layer
│   │   ├── domain/      # Domain layer
│   │   └── presentation/ # Presentation layer
│   └── settings/        # Settings feature
└── shared/              # Shared components
```

## API Integration

The app integrates with the Job Aggregator API:

- **Base URL**: `http://localhost:3001/api`
- **Endpoints**:
  - `GET /jobs` - Fetch jobs with filtering
  - `GET /jobs/{id}` - Get job details
  - `GET /jobs/stats/summary` - Get job statistics
  - `POST /workflows/trigger-job-fetch` - Trigger job fetching

## Setup Instructions

### Prerequisites
- Flutter SDK (>=3.0.0)
- Dart SDK
- Android Studio / Xcode for device testing
- Firebase project for push notifications

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd flutter_app
   ```

2. **Install dependencies**:
   ```bash
   flutter pub get
   ```

3. **Configure Firebase**:
   - Create a Firebase project
   - Add your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Enable Firebase Cloud Messaging

4. **Run code generation**:
   ```bash
   flutter packages pub run build_runner build
   ```

5. **Run the app**:
   ```bash
   flutter run
   ```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:3001/api
ENABLE_PUSH_NOTIFICATIONS=true
CACHE_DURATION_HOURS=24
```

### Network Configuration
Update the API base URL in `lib/core/constants/api_constants.dart`:

```dart
class ApiConstants {
  static const String baseUrl = 'YOUR_API_URL';
}
```

## Key Components

### Jobs BLoC
Manages job-related state including loading, filtering, and caching:
- `LoadJobs` - Load initial jobs
- `LoadMoreJobs` - Pagination
- `FilterJobs` - Apply filters
- `TriggerJobFetch` - Trigger API job fetch

### Job Models
- **Job Entity**: Core job data structure
- **Job Model**: API response mapping
- **Hive Adapters**: Local storage serialization

### UI Components
- **JobCard**: Displays job summary with company, location, salary
- **FilterBottomSheet**: Advanced filtering interface
- **StatsCard**: Job statistics display
- **JobDetailPage**: Full job information and application

## Performance Optimizations

- **Lazy Loading**: Jobs loaded on-demand
- **Image Caching**: Company logos cached efficiently
- **Background Sync**: Jobs updated without blocking UI
- **Memory Management**: Proper disposal of resources
- **Network Optimization**: Request batching and caching

## Testing

Run tests with:
```bash
flutter test
```

Test coverage includes:
- Unit tests for BLoCs and repositories
- Widget tests for UI components
- Integration tests for complete user flows

## Deployment

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Update documentation
4. Follow Flutter best practices

## Platform Support

- **Android**: API level 21+ (Android 5.0+)
- **iOS**: iOS 11.0+
- **Responsive**: Tablet and phone layouts

## Dependencies

Key packages used:
- `flutter_bloc`: State management
- `dio`: HTTP client
- `hive`: Local database
- `firebase_messaging`: Push notifications
- `go_router`: Navigation
- `cached_network_image`: Image caching

This Flutter app provides a complete mobile solution for the Job Aggregator Platform with production-ready features and architecture.