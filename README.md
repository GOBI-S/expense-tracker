# Smart Expense Tracker

A modern, feature-rich personal finance management application built with the latest web technologies. Track your income and expenses, set budgets, analyze spending patterns, and take control of your financial life.

## Features

### Core Functionality
- **Google Authentication**: Secure login with Firebase Authentication
- **Dashboard**: Real-time overview of balance, income, expenses, and spending trends
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Category-based Tracking**: Organize transactions into 7 categories (Food, Transport, Shopping, Bills, Entertainment, Salary, Other)
- **Budget Management**: Set monthly budgets per category and monitor spending limits with alerts
- **Analytics**: Visualize spending patterns with interactive charts and trend analysis
- **Search & Filter**: Find transactions quickly with search, type filters, and category filters

### User Experience
- **Dark Mode First Design**: Modern dark theme optimized for readability and reduced eye strain
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data Sync**: Instant updates across all pages
- **Interactive Charts**: Beautiful pie charts, bar charts, and line graphs powered by Recharts
- **Smooth Navigation**: Fast, intuitive navigation with keyboard support

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with dark mode support
- **Recharts** - Interactive data visualization
- **shadcn/ui** - Accessible UI component library
- **Lucide React** - Beautiful icons
- **Firebase** - Authentication and real-time data

### Backend Integration
- **Node.js/Express** - Backend API (user-provided)
- **MongoDB** - Database (user-provided)
- **Firebase Authentication** - OAuth and authentication

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- Firebase account (for production use)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smart-expense-tracker
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Configure Firebase** (Optional for demo)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these values from your [Firebase Console](https://console.firebase.google.com):
- Go to Project Settings
- Select your Web app
- Copy the configuration

4. **Run the development server**
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Mode
Click "Try Demo" on the login page to explore the app without Firebase credentials. This loads mock data and allows you to test all features.

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Home/login page
│   ├── globals.css             # Global styles and design tokens
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout
│       ├── page.tsx            # Dashboard home
│       ├── transactions/
│       │   ├── page.tsx        # Transactions list with filters
│       │   ├── add/
│       │   │   └── page.tsx    # Add transaction form
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx # Edit transaction form
│       ├── budgets/
│       │   └── page.tsx        # Budget tracking page
│       └── analytics/
│           └── page.tsx        # Analytics and insights
│
├── components/
│   ├── login-page.tsx          # Login component
│   ├── navigation.tsx          # Top navigation bar
│   ├── dashboard-page.tsx      # Dashboard component
│   └── dashboard/
│       ├── summary-cards.tsx   # Summary cards component
│       ├── expense-chart.tsx   # Pie chart for expenses
│       └── recent-transactions.tsx # Recent transactions list
│
├── contexts/
│   └── auth-context.tsx        # Authentication context with demo support
│
├── lib/
│   ├── firebase.ts             # Firebase initialization
│   ├── api-service.ts          # Mock API service
│   └── utils.ts                # Utility functions
│
├── types/
│   └── expense.ts              # TypeScript interfaces
│
└── public/
    └── icons/                  # App icons
```

## Core Components

### SummaryCards
Displays total balance, income, and expense with color-coded indicators.

### ExpenseChart
Interactive pie chart showing expense breakdown by category using Recharts.

### RecentTransactions
List of most recent transactions with category icons and amounts.

### TransactionFilter
Advanced filtering with search, type (income/expense), and category selection.

### BudgetCard
Displays budget progress with visual indicators for over-budget status.

## API Integration

The app is built with a mock API service that can be easily replaced with real backend APIs. The `apiService` in `lib/api-service.ts` provides:

- `getTransactions()` - Fetch filtered transactions
- `addTransaction()` - Create new transaction
- `updateTransaction()` - Modify existing transaction
- `deleteTransaction()` - Remove transaction
- `getBudgets()` - Fetch budget data
- `updateBudget()` - Modify budget limits
- `getDashboardSummary()` - Get dashboard overview

To connect to your backend:
1. Update the API endpoints in `lib/api-service.ts`
2. Replace mock data with real API calls
3. Implement proper error handling and loading states

## Firebase Setup

### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Follow the setup wizard
4. Create a Web app
5. Copy the configuration to `.env.local`

### Enable Google Authentication
1. Go to Authentication in Firebase Console
2. Click "Sign-in method"
3. Enable "Google"
4. Add your domain to authorized origins

## Styling & Theming

The app uses a custom dark theme with:
- Primary: Green (Wellness/Growth)
- Secondary: Dark Gray (Neutral)
- Accent: Red (Expenses/Alerts)
- Background: Almost black (#1a1a1a)
- Text: Off-white (#f5f5f5)

### Design Tokens
Located in `app/globals.css`:
- `--primary` - Main action color (green)
- `--income` - Income indicator (green)
- `--expense` - Expense indicator (red)
- `--background` - Page background
- `--foreground` - Text color
- `--card` - Card background
- `--border` - Border color

To customize colors, edit the CSS variables in `globals.css`.

## Authentication Flow

1. **Login Page**: User can sign in with Google or try demo
2. **Demo Mode**: Uses localStorage to store mock user data
3. **Protected Routes**: AuthContext prevents unauthorized access
4. **Logout**: Clears user data and returns to login

### Demo User
```
Email: demo@example.com
Name: Demo User
UID: demo-user-123
```

## Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Route-based code splitting with Next.js
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: SWR-ready architecture for efficient data fetching
- **Dark Mode**: Optimized CSS for reduced eye strain

## Development Guide

### Adding a New Feature

1. **Create the component** in `components/` or `app/[page]/`
2. **Define types** in `types/expense.ts`
3. **Add API methods** to `lib/api-service.ts`
4. **Update auth context** if needed
5. **Test** with mock data first

### Styling Guidelines

- Use Tailwind utility classes
- Follow the established color palette
- Use `text-balance` for better line breaks
- Use `leading-relaxed` (1.6) for body text
- Maintain consistent spacing with gap classes

### Testing

The app includes mock data in `lib/api-service.ts`. To test:
1. Use "Try Demo" to access without Firebase
2. Test all CRUD operations
3. Verify filters and search work
4. Check responsive design on mobile

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Set environment variables in project settings
- Deploy

3. **Set Environment Variables**
Add in Vercel project settings:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Custom Domain
1. Go to project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast dark theme
- Screen reader friendly

## Future Enhancements

- [ ] Export transactions as CSV/PDF
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Bill reminders and notifications
- [ ] Income/expense forecasting
- [ ] Savings goals
- [ ] Multi-account support
- [ ] Mobile app (React Native)
- [ ] Cloud sync with offline support
- [ ] Advanced reporting

## Troubleshooting

### Firebase Error: Invalid API Key
- Verify `.env.local` is created correctly
- Check API key matches your Firebase project
- Ensure Web app is created in Firebase Console

### Demo Mode Not Working
- Clear browser localStorage
- Clear browser cache
- Try in incognito/private mode

### Charts Not Displaying
- Check if expense data exists
- Verify Recharts is installed: `pnpm list recharts`
- Check browser console for errors

### Styles Not Applied
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Check Tailwind CSS config

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check Firebase Console for auth errors
4. Review browser console for errors

## License

MIT License - feel free to use this project for personal or commercial use.

## Credits

Built with:
- Next.js and React
- Tailwind CSS and shadcn/ui
- Firebase Authentication
- Recharts for data visualization
