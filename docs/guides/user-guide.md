# User guide

## Key features

- Interactive Greek language exercises with instant feedback
- Multilingual interface (English, Russian, Greek)
- Custom exercise creation and management
- Hint system with localized translations
- Responsive design for desktop and mobile
- Dark/light theme support

---

## Page documentation

### 1. Homepage (`/`)

#### Page Metadata

- **URL/Route**: `/` (root)
- **Title**: "Learn Greek" (localized)
- **Purpose**: Entry point and navigation hub for the application
- **Role in User Flow**: Primary landing page directing users to main features

#### UI Components

- **Header Navigation**:
    - Brand logo (ΜΕ) linking to homepage
    - Main navigation: Home, Library, Builder
    - Theme toggle button (☀️ 🌙)
    - Language selector dropdown (🇺🇸/🇷🇺/🇬🇷)
- **Mobile Navigation**:
    - Hamburger menu button for mobile devices
    - Collapsible side menu with all navigation options
- **Main Content**:
    - Hero section with application title and description
    - Two primary action cards:
        - Exercise Library card (📚) - Browse and execute exercises
        - Exercise Builder card (🔧) - Create custom exercises
- **Footer**:
    - Copyright notice (localized)
    - "Made with love" message in Greek
    - GitHub repository link

#### Functionality

- **Language Switching**: Instant UI language change with API translation loading
- **Theme Toggle**: Persistent light/dark mode switching
- **Responsive Design**: Mobile-first approach with a hamburger menu
- **Card Navigation**: Direct routing to main application sections

#### States

- **Default State**: Light theme, English language
- **Loading State**: Translation loading indicators
- **Mobile State**: Collapsed navigation with a hamburger menu
- **Menu Open State**: Expanded mobile menu overlay

#### Data

- **Local Storage**: Theme preference, language preference
- **API Calls**: `/api/translations` for localized content
- **Navigation**: Hash-based routing (`#/exercises`, `#/builder`)

#### Test Scenarios

- Language switching functionality across all supported languages
- Theme persistence across page reloads
- Mobile responsive behavior and menu functionality
- Navigation card functionality and routing

---

### 2. Exercise Library (`/exercises`)

#### Page Metadata

- **URL/Route**: `/exercises`
- **Title**: "Exercise Library" (localized)
- **Purpose**: Browse, filter, and access available Greek exercises
- **Role in User Flow**: Main exercise discovery and launch point

#### UI Components

- **Header**: Standard navigation header with active "Library" state
- **Settings Panel** (Collapsible):
    - Hints Language selector (🇷🇺/🇺🇸 buttons)
    - Description text for language selection
- **Filters Panel** (Collapsible):
    - **Difficulty Filter**: All, A1 (button toggles)
    - **Language Filter**: All, Greek flag with "Ελληνικά"
    - **Tags Filter**: Multiple tag buttons (#countries, #irregular-verbs, #nationalities, #test, #verbs, #word-form)
- **Results Counter**: "Available exercises: X" (dynamic)
- **Exercise Grid**: Card-based layout showing:
    - Exercise title and description
    - Difficulty badge (A1)
    - Tags display
    - Statistics (📝 cases, 📚 blocks, ⏱️ time estimate)
    - Action buttons: "Start Exercise", "Learn" (with icon)

#### Functionality

- **Dynamic Filtering**: Real-time exercise filtering by tags, difficulty, language
- **Settings Management**: Hints language preference with visual feedback
- **Exercise Launch**: Two modes - "Start Exercise" and "Learn" mode
- **Responsive Layout**: Grid adjusts for mobile/desktop viewing
- **Filter State Management**: Active filters show visual indicators

#### Integrations

- **API Endpoints**:
    - `GET /api/exercises` - Fetch available exercises
    - `GET /api/translations` - Localized content
- **Exercise Data Structure**: Complex exercise objects with metadata, blocks, and cases

#### States

- **Loading State**: Exercise list loading
- **Filtered State**: Reduced exercise count with active filters
- **Empty State**: No exercises match current filters
- **Settings Expanded/Collapsed**: Panel visibility states

#### Data

- **Exercise Metadata**: ID, type, language, title, description, difficulty, tags, time estimates
- **Filter State**: Selected difficulty, language, tags
- **Settings**: Hints language preference
- **Local Storage**: User preferences persistence

#### Test Scenarios

- **Filter Functionality**: Each filter type reduces results correctly
- **Settings Persistence**: Hints language selection saves and persists
- **Exercise Launch**: Both "Start" and "Learn" buttons navigate correctly
- **Responsive Behavior**: Layout adapts to different screen sizes
- **Data Loading**: Graceful handling of API delays and errors

---

### 3. Exercise Page (`/exercise/:id`)

#### Page Metadata

- **URL/Route**: `/exercise/:id` (dynamic exercise ID)
- **Title**: Exercise title (e.g., "Verb 'to be' practice")
- **Purpose**: Interactive exercise execution with real-time feedback
- **Role in User Flow**: Core learning experience

#### UI Components

- **Exercise Header**:
    - Back navigation link to library
    - Auto-advance toggle button with status indicator
    - Exercise title and current block name (Greek)
    - Progress indicator: "X of Y" with visual progress bar
- **Exercise Content**:
    - Block context (e.g., "είμαι (Ενεστώτας)")
    - Block hint button with localized tooltip
    - Question prompt (e.g., "εγώ ___")
    - Question hint button with answer hint
    - Answer input field (Greek placeholder)
    - Submit button with keyboard shortcut indicator ("Enter to submit")

#### Functionality

- **Exercise Flow**:
    - Sequential question presentation
    - Real-time input validation
    - Auto-advance after correct answers
    - Progress tracking across questions
- **Hint System**:
    - Context hints for exercise blocks
    - Question-specific hints in user's preferred language
    - Visual hint activation states
- **Input Handling**:
    - Greek text input support
    - Enter key submission
    - Input field state management (enabled/disabled)
- **Feedback System**:
    - Immediate response to submissions
    - Visual feedback for correct/incorrect answers
    - Auto-progression to next question

#### Integrations

- **API Endpoints**:
    - `GET /api/exercises/:id` - Fetch specific exercise data
    - `GET /api/translations` - Localized hints and content
- **Exercise Engine**: Complex state machine handling exercise progression

#### States

- **Exercise Loading**: Initial exercise data loading
- **Question Active**: User can input answers
- **Answer Submitted**: Input disabled, processing answer
- **Feedback Display**: Showing correct/incorrect feedback
- **Auto-Advance**: Transitioning to next question
- **Exercise Complete**: End of exercise state

#### Data

- **Exercise Structure**: Blocks containing cases with prompts, hints, and answers
- **Progress State**: Current block, current case, completion percentage
- **User Input**: Current answer, input validation state
- **Settings**: Auto-advance preferences, hint language

#### Test Scenarios

- **Exercise Completion Flow**: Full exercise from start to finish
- **Hint System**: Both block and question hints function correctly
- **Input Validation**: Correct answers advance, incorrect answers handled
- **Auto-Advance**: Timing and state transitions work properly
- **Navigation**: Back button returns to library correctly
- **Progress Tracking**: Accurate progress indication throughout

---

### 4. Learn Page (`/learn/:id`)

#### Page Metadata

- **URL/Route**: `/learn/:id` (dynamic exercise ID)
- **Title**: Exercise title + "| Learn Exercise" (e.g., "Εξάσκηση ρήματος είμαι | Learn Exercise")
- **Purpose**: Study mode for exercises - comprehensive overview before practice
- **Role in User Flow**: Educational preview and reference material for exercises

#### UI Components

- **Header Section**:
    - Back to library navigation button
    - "Learn Exercise" breadcrumb label
    - Exercise title in Greek (e.g., "Εξάσκηση ρήματος είμαι")
    - Exercise description in Greek
    - Statistics grid: Difficulty, Minutes, Blocks, Cases
- **Action Section**:
    - View toggle buttons: "Table View" / "JSON View"
    - Primary "Start Exercise" button with play icon
    - Exercise tags list (#irregular-verbs, #verbs, #word-form)
- **Settings Information Panel**:
    - Current Settings heading
    - Settings description text
    - Three-column grid showing:
        - Interface language (with flag icon)
        - Your language/Hints language (with flag icon)
        - Current theme (Light/Dark)
- **Content Display** (Two modes):
    - **Table View Mode**:
        - Exercise card summary with metadata
        - "Exercise Structure" section
        - Expandable blocks with detailed tables
        - Each table shows: #, Prompt, Answer, Hint columns
        - Localized hints in preferred language
    - **JSON View Mode**:
        - "Copy JSON" button with copy icon
        - Syntax-highlighted JSON code display
        - Line numbers for easy reference
        - Complete exercise definition structure

#### Functionality

- **Study Mode Features**:
    - Complete exercise structure overview
    - All questions and answers visible for study
    - Localized hints for comprehension
    - Exercise metadata and settings display
- **View Toggle**:
    - Switch between human-readable table and raw JSON
    - Table view optimized for learning/reference
    - JSON view useful for technical analysis or custom exercise creation
- **Copy Functionality**:
    - Copy complete exercise JSON to clipboard
    - Useful for creating similar exercises or backup
- **Settings Display**:
    - Real-time display of current user preferences
    - Visual confirmation of language and theme settings
- **Direct Exercise Launch**:
    - "Start Exercise" button launches practice mode
    - Seamless transition from study to practice

#### Integrations

- **API Endpoints**:
    - `GET /api/exercises/:id` - Fetch complete exercise data
    - `GET /api/translations` - Localized content for interface and hints
- **Clipboard API**: Copy JSON functionality
- **Exercise Engine Integration**: Same data structure as practice mode

#### States

- **Loading State**: Exercise data and translations loading
- **Table View State**: Human-readable structured display
- **JSON View State**: Technical raw data display
- **Copy Success**: Visual feedback after JSON copy
- **Ready to Practice**: All data loaded, exercise ready to start

#### Data

- **Complete Exercise Structure**: All blocks, cases, prompts, answers, hints
- **Localized Content**: Hints in user's preferred language
- **Exercise Metadata**: Title, description, difficulty, tags, timing
- **User Settings**: Interface language, hints language, theme preference
- **JSON Export**: Complete exercise definition for copying

#### Test Scenarios

- **View Mode Toggle**: Switch between Table and JSON views functions correctly
- **Copy Functionality**: JSON copy to clipboard works and provides feedback
- **Settings Display**: Current user preferences displayed accurately
- **Exercise Launch**: "Start Exercise" button navigates to practice mode correctly
- **Content Localization**: Hints display in user's selected language
- **Responsive Layout**: Tables and JSON view adapt to different screen sizes
- **Data Completeness**: All exercise blocks and cases displayed correctly

---

### 5. Exercise Builder (`/builder`)

#### Page Metadata

- **URL/Route**: `/builder`
- **Title**: "Exercise Builder" (localized)
- **Purpose**: Create and manage custom exercises
- **Role in User Flow**: Content creation tool for advanced users

#### UI Components

- **Header Section**:
    - Tool icon and page title
    - Description and instructions
    - Navigation links: "Back to Home", "Open library"
- **Exercise Setup Panel**:
    - Exercise type dropdown (currently "Word form exercise")
    - Instructions for JSON editing
- **JSON Editor Section**:
    - "Exercise JSON" heading
    - Action buttons: "Format JSON", "Reset template"
    - Large text area with JSON content
    - "Save to library" button
- **Validation Panel**:
    - Validation status indicator (Valid/Invalid)
    - Descriptive validation messages
- **Preview Section**:
    - "Table preview" with exercise card preview
    - "Exercise Structure" with detailed breakdown
    - Block and case tables with prompts, answers, hints
- **My Exercises Section**:
    - List of saved custom exercises
    - Empty state message when no exercises saved

#### Functionality

- **JSON Exercise Definition**:
    - Full exercise schema editing
    - Real-time validation
    - Template loading and reset
    - JSON formatting tools
- **Live Preview**:
    - Real-time preview of exercise structure
    - Table view of all exercise cases
    - Visual feedback for validation status
- **Exercise Management**:
    - Save exercises to browser storage
    - Load and edit existing exercises
    - Exercise metadata editing (title, description, tags)
- **Multi-language Support**:
    - I18n fields for titles and descriptions
    - Hint localization in multiple languages

#### Integrations

- **Local Storage**: Custom exercises persistence
- **JSON Validation**: Real-time exercise schema validation
- **Exercise Engine Integration**: Preview uses same engine as main exercises

#### States

- **Default Template**: Pre-loaded example exercise
- **Editing State**: User modifying JSON content
- **Validation Error**: Invalid JSON with error descriptions
- **Valid Exercise**: Ready to save with preview available
- **Save Success**: Exercise saved to library
- **Loading Saved Exercise**: Populating editor with existing exercise

#### Data

- **Exercise Schema**: Complete exercise structure with all required fields
- **Validation Results**: Field-level validation errors and warnings
- **Preview Data**: Processed exercise structure for display
- **Saved Exercises**: User's custom exercise collection in local storage

#### Test Scenarios

- **Exercise Creation**: Full workflow from template to saved exercise
- **JSON Validation**: Invalid JSON shows appropriate errors
- **Template Management**: Reset and format functions work correctly
- **Preview Accuracy**: Preview matches actual exercise behavior
- **Save/Load Functionality**: Custom exercises persist correctly
- **Multi-language Fields**: I18n content displays properly in different languages

---

## Technical Architecture Features

### Multi-language Support

- **UI Languages**: English, Russian, Greek
- **Translation System**: Dynamic loading via `/api/translations`
- **Localized Content**: Exercise hints, interface text, error messages
- **Fallback Strategy**: English as default fallback language

### Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices
- **Breakpoint Strategy**: Seamless transition between mobile and desktop
- **Navigation Patterns**: Hamburger menu for mobile, horizontal nav for desktop
- **Touch-Friendly**: Large tap targets and mobile-optimized interactions

### Accessibility Features

- **Semantic HTML**: Proper heading hierarchy, landmarks, and roles
- **Keyboard Navigation**: Full functionality via keyboard
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Logical tab order and focus indicators

### Performance Optimizations

- **Lazy Loading**: Route-based code splitting
- **Caching Strategy**: Translation and exercise data caching
- **Bundle Optimization**: Tree shaking and code splitting
- **Mock Service Worker**: Offline-first architecture

### State Management

- **Exercise State Machine**: Complex state transitions for exercise flow
- **Settings Persistence**: Theme and language preferences in localStorage
- **URL State**: Exercise progress reflected in URL parameters
- **Global State**: Application-wide settings and user preferences

---

## Integration Points

### API Endpoints

- `GET /api/exercises` - Fetch all available exercises
- `GET /api/exercises/:id` - Fetch specific exercise
- `GET /api/translations` - Fetch localized content

### External Services

- **GitHub Integration**: Repository linking for open source contribution
- **Browser APIs**: localStorage for persistence, CSS custom properties for theming

### Data Flow

1. **Application Load**: Theme and language preference restoration
2. **Page Navigation**: Route-based component loading and data fetching
3. **Exercise Execution**: State machine progression with real-time feedback
4. **Content Creation**: JSON validation and local storage persistence

---

## User Journey Flows

### Primary Learning Flow

1. **Entry**: User arrives at homepage
2. **Discovery**: Navigate to Exercise Library
3. **Selection**: Browse and filter exercises, configure settings
4. **Execution**: Complete exercise with hints and feedback
5. **Progression**: Auto-advance through questions, track progress
6. **Completion**: Return to library for next exercise

### Content Creation Flow

1. **Access**: Navigate to Exercise Builder
2. **Setup**: Select exercise type and load template
3. **Creation**: Edit JSON structure with live validation
4. **Preview**: Review exercise structure and preview
5. **Save**: Persist to local storage and add to library

### Personalization Flow

1. **Theme Selection**: Choose light/dark mode preference
2. **Language Setup**: Select UI and hints languages
3. **Settings Persistence**: Automatic saving across sessions
4. **Consistent Experience**: Settings applied across all pages

This documentation provides a comprehensive overview of the Learn Greek application's functionality, architecture, and
user experience patterns. The application demonstrates modern web development practices with a focus on accessibility,
internationalization, and responsive design while delivering an effective language learning experience.
