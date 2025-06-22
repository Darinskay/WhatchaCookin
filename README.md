# WhatchaCookin 🍳

A modern iOS mobile application built with Ionic Vue for discovering and sharing amazing recipes.

## Features

### 🎯 Current Features
- **Recipe Search**: Search through recipes with an intuitive search bar
- **Popular Tags**: Quick access to popular recipe categories (Italian, Vegetarian, Quick, Healthy, Dessert)
- **Quick Actions**: Add new recipes, view favorites, and discover random recipes
- **Recipe Categories**: Browse recipes by categories (Main Dishes, Pizza & Pasta, Beverages, Vegetarian)
- **User Preferences**: Toggle notifications, dark mode, and difficulty level settings
- **Interactive Elements**: Alerts, loading indicators, and toast notifications
- **Modern UI**: Beautiful cards, buttons, chips, and other Ionic components

### 🎨 Design Features
- Custom cooking-themed color palette
- Responsive design optimized for iOS
- Modern card-based layout
- Smooth animations and transitions
- Dark mode support

## Tech Stack

- **Framework**: Ionic 7 with Vue 3
- **Mobile Platform**: iOS (via Capacitor)
- **Language**: TypeScript
- **Styling**: Custom CSS with Ionic theming
- **Icons**: Ionicons

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- Ionic CLI (`npm install -g @ionic/cli`)
- Xcode (for iOS development)
- iOS Simulator or physical iOS device

## Installation & Setup

1. **Clone the repository**
   ```bash
   cd WhatchaCookin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in browser (development)**
   ```bash
   ionic serve
   ```

4. **Build the project**
   ```bash
   ionic build
   ```

5. **Sync with iOS**
   ```bash
   ionic capacitor sync ios
   ```

6. **Open in Xcode**
   ```bash
   ionic capacitor open ios
   ```

## Development Commands

| Command | Description |
|---------|-------------|
| `ionic serve` | Run the app in browser with live reload |
| `ionic build` | Build the app for production |
| `ionic capacitor run ios` | Run on iOS device/simulator |
| `ionic capacitor sync ios` | Sync web assets with iOS project |
| `ionic capacitor open ios` | Open iOS project in Xcode |

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── router/             # Vue Router configuration
├── theme/              # Custom CSS variables and theming
├── views/              # Page components
│   ├── Tab1Page.vue    # Main WhatchaCookin page
│   ├── Tab2Page.vue    # Tab 2 page
│   ├── Tab3Page.vue    # Tab 3 page
│   └── TabsPage.vue    # Tab navigation
├── App.vue             # Root component
└── main.ts             # App entry point
```

## Key Components Used

### Ionic Components
- `ion-card` - Content cards with headers and actions
- `ion-button` - Various button styles (solid, outline, clear)
- `ion-searchbar` - Recipe search functionality
- `ion-chip` - Popular tags display
- `ion-list` & `ion-item` - Category listings
- `ion-toggle` & `ion-checkbox` - Settings controls
- `ion-select` - Dropdown selections
- `ion-alert`, `ion-loading`, `ion-toast` - User feedback

### Vue 3 Features
- Composition API with `<script setup>`
- Reactive references with `ref()`
- Event handling with `@click` and `@ionInput`

## Customization

### Theme Colors
The app uses a custom cooking-themed color palette defined in `src/theme/variables.css`:
- **Primary**: Cooking Orange (#ff6b35)
- **Secondary**: Warm Brown (#8b4513)
- **Tertiary**: Fresh Green (#32cd32)
- **Success**: Fresh Mint (#2dd36f)

### Adding New Features
1. Create new Vue components in `src/components/`
2. Add new pages in `src/views/`
3. Update routing in `src/router/`
4. Extend the theme in `src/theme/variables.css`

## iOS Deployment

1. **Build the project**
   ```bash
   ionic build
   ionic capacitor sync ios
   ```

2. **Open in Xcode**
   ```bash
   ionic capacitor open ios
   ```

3. **Configure signing & capabilities in Xcode**
   - Set your development team
   - Configure bundle identifier
   - Set deployment target (iOS 13.0+)

4. **Run on device or simulator**
   - Select target device
   - Click the play button in Xcode

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Ionic Framework](https://ionicframework.com/)
- Icons from [Ionicons](https://ionic.io/ionicons)
- Vue.js framework for reactive UI components 