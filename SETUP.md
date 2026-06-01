# Quick Setup Guide - Smart Expense Tracker

## 1-Minute Setup (Demo Mode)

Want to see the app in action immediately? Use demo mode!

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
# Click "Try Demo" button
```

That's it! You can now explore all features with mock data.

## Full Setup with Firebase (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Name: `smart-expense-tracker`
4. Click "Create Project" and wait for setup to complete
5. Click "Create Web App"
6. Copy your configuration

### Step 2: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and paste your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=<paste_your_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<paste_your_domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<paste_your_project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<paste_your_bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<paste_your_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<paste_your_app_id>
```

### Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Sign-in method**
3. Click **Google** and toggle it on
4. Add your domain to **Authorized origins**:
   - `http://localhost:3000` (for local development)
   - `https://yourdomain.com` (for production)

### Step 4: Run the App

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with your Google account!

## Backend Integration

The app currently uses mock data. To connect to your actual backend:

### Update API Service

Edit `lib/api-service.ts`:

```typescript
export const apiService = {
  getTransactions: async (userId: string) => {
    // Replace with your API call
    const response = await fetch(`/api/transactions?userId=${userId}`);
    return response.json();
  },
  
  addTransaction: async (transaction) => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    return response.json();
  },
  
  // ... update other methods
};
```

### Connect to Your Backend

Your backend should expose these endpoints:

```
POST   /api/transactions          - Create transaction
GET    /api/transactions          - Get all transactions
PATCH  /api/transactions/:id      - Update transaction
DELETE /api/transactions/:id      - Delete transaction

GET    /api/budgets              - Get budgets
PATCH  /api/budgets/:id          - Update budget

GET    /api/dashboard/summary    - Get dashboard data
```

## File Structure Overview

```
smart-expense-tracker/
├── app/
│   ├── dashboard/          # Dashboard pages
│   ├── globals.css         # Theme colors
│   └── page.tsx            # Home page
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── ui/                 # shadcn components
│   └── login-page.tsx      # Login component
├── lib/
│   ├── api-service.ts      # Mock API (replace with real)
│   └── firebase.ts         # Firebase setup
├── contexts/
│   └── auth-context.tsx    # Authentication
├── types/
│   └── expense.ts          # TypeScript definitions
└── README.md               # Full documentation
```

## Key Features

### Authentication
- Google Sign-in with Firebase
- Demo mode for testing
- Automatic session management

### Dashboard
- Real-time balance, income, expense summary
- Expense breakdown pie chart
- Recent transactions list
- Navigation to other sections

### Transactions
- Add/Edit/Delete transactions
- Search by description or amount
- Filter by type (income/expense)
- Filter by category
- Sort by date

### Budgets
- Set monthly budget limits
- Track spending against limits
- Visual progress indicators
- Over-budget alerts

### Analytics
- Monthly income vs expense charts
- Savings trend visualization
- Historical data analysis

## Customization

### Change Theme Colors

Edit `app/globals.css`:

```css
:root {
  --primary: oklch(0.57 0.196 142.495);    /* Green */
  --expense: oklch(0.55 0.211 9.23);       /* Red */
  /* ... other colors */
}
```

### Add New Categories

Edit `types/expense.ts`:

```typescript
export type Category = 'food' | 'transport' | 'your_new_category';
```

### Customize Dashboard

Edit `app/dashboard/page.tsx` to add new sections or modify layout.

## Deployment to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Click Deploy!

That's all—your app is now live!

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Verify your `.env.local` has correct credentials
- Check that Web app is created in Firebase Console
- Restart dev server after changing `.env.local`

### Demo button doesn't work
- Clear browser cache and localStorage
- Try incognito/private browsing mode
- Check browser console for errors

### Firebase sign-in doesn't work
- Ensure Google provider is enabled in Firebase Console
- Add `localhost:3000` to authorized origins
- Check that API key is valid

### Styles look wrong
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Check that Tailwind CSS is properly configured

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Test with your Google account
4. ✅ Add your mock data or connect backend
5. ✅ Customize colors and branding
6. ✅ Deploy to Vercel or your hosting

## Support

- Check [README.md](./README.md) for detailed documentation
- Review code comments for implementation details
- Check browser console for error messages
- Verify Firebase Console settings

Happy tracking! 🎉
