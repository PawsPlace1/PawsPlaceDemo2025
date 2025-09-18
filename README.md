# PawsPlace - Pet-Friendly London Rentals

Welcome to PawsPlace! 🐾  
We started this project as pet owners who struggled to find pet-friendly places to rent in London. Our goal: bring together pet owners and pet-friendly landlords to make the process easier and less stressful for everyone.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials.

3. **Run locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

This is a **Next.js** application with the following structure:

- `/pages` – Next.js pages (routes)
  - `/pages/index.js` – Homepage with listings, search, and filters
  - `/pages/_app.js` – Global app configuration with authentication context
  - `/pages/agent/` – Agent authentication pages
    - `signup.js` – Agent registration form
    - `login.js` – Agent login form
  - `/pages/api/auth/` – Authentication API routes
    - `signup.js` – Sign-up API endpoint
    - `signin.js` – Sign-in API endpoint
- `/components` – Reusable React components
  - `ListingCard.js` – Individual property card display
  - `SearchBar.js` – Location search functionality
  - `Filters.js` – Property filtering and sorting
- `/contexts` – React context providers
  - `AuthContext.js` – Authentication state management
- `/lib` – Utility libraries
  - `supabase.js` – Database client and authentication functions
- `/styles` – CSS styling
  - `globals.css` – Global styles and responsive design
- `/public` – Static assets
  - `logo.png` – PawsPlace logo

## 🗄️ Database Setup

### Listings Table
Create a Supabase table named `listings` with these columns:

| Column | Type | Description |
|--------|------|-------------|
| Title | text | Property title |
| Rent | integer | Monthly rent in pounds |
| Listed | timestamp | When property was listed |
| Bedrooms | integer | Number of bedrooms |
| Baths | integer | Number of bathrooms |
| Location | text | Area/postcode |
| Description | text | Property description |
| Furnished | boolean | Furnished status |
| Garden | boolean | Has garden/outdoor space |
| SquareFootage | integer | Property size in sq ft |
| PetParkingCosts | integer | Extra pet parking costs |
| StairFreeAccess | boolean | Stair-free access available |
| HouseShare | boolean | Is a house share |

### User Profiles Table (for Authentication)
Create a Supabase table named `profiles` with these columns:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | User ID (references auth.users.id) |
| email | text | User email address |
| name | text | User full name |
| role | text | User role: 'admin', 'agent', or 'tenant' |
| company | text | Company/agency name (optional) |
| phone | text | Contact phone number (optional) |
| created_at | timestamp | When profile was created |
| updated_at | timestamp | When profile was last updated |

**Important**: Enable Row Level Security (RLS) on the profiles table and set up appropriate policies for data access.

## 🌟 Features

- **Search & Filter**: Find properties by location, type, and features
- **Pet-Friendly Focus**: Highlight properties with pet amenities
- **Agent Authentication**: Sign-up and login system for real estate agents
- **User Roles**: Support for admin, agent, and tenant roles
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Sorting Options**: Sort by price, date, bedrooms
- **Modern UI**: Clean, accessible design with loading states

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

### Manual Build

```bash
npm run build
npm start
```

## 🔐 Authentication

PawsPlace now includes a complete authentication system with user roles:

### Features
- **Agent Sign-up**: `/agent/signup` - Register as a real estate agent
- **Agent Login**: `/agent/login` - Access agent account
- **Role-based Access**: Support for 'admin', 'agent', and 'tenant' roles
- **Persistent Sessions**: Uses localStorage for development mode
- **Profile Management**: Stores user data including company and contact info

### Development Mode
When Supabase is not configured, the app uses mock authentication for development:
- Any email/password combination will work for login
- User profiles are stored in browser localStorage
- All authentication flows work without backend setup

### Production Setup
For production deployment with Supabase:
1. Set up Supabase authentication in your project
2. Create the `profiles` table (see Database Setup section)
3. Configure environment variables with your Supabase credentials
4. Enable email authentication in Supabase dashboard

### Usage
- Visit `/agent/signup` to create a new agent account
- Visit `/agent/login` to sign in to an existing account
- Authenticated users see their name and role in the header
- Click "Logout" to sign out and clear session data

## 🔮 Future Enhancements

This starter is ready for extension with:

- **Tenant Authentication**: Extend authentication to support tenant registration and login
- **Property Management**: Add/edit listings dashboard
- **Notifications**: Email alerts for new properties
- **Messaging**: Contact between tenants and agents
- **Favorites**: Save preferred properties
- **Advanced Filters**: Price range, pet size restrictions
- **Map Integration**: Location-based search
- **Photo Uploads**: Property image management

## 🛠️ Development

- **Linting**: `npm run lint`
- **Type Checking**: Ready for TypeScript conversion
- **Component Testing**: Jest/React Testing Library ready
- **API Routes**: Add `/pages/api` for backend functionality

## 📝 Code Style

- Clean, commented code for beginner maintainers
- Consistent naming conventions
- Responsive CSS with modern techniques
- Accessible UI components
- Error handling and loading states

---

Made with ❤️ by pet lovers, for pet lovers.