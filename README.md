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
  - `/pages/auth/` – Authentication pages
    - `signup.js` – Agent registration form
    - `login.js` – User login form
- `/components` – Reusable React components
  - `ListingCard.js` – Individual property card display
  - `SearchBar.js` – Location search functionality
  - `Filters.js` – Property filtering and sorting
- `/contexts` – React contexts
  - `AuthContext.js` – Authentication state management
- `/lib` – Utility libraries
  - `supabase.js` – Database client and API functions
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

### User Profiles Table (Authentication)
Create a Supabase table named `profiles` with these columns:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (matches auth.users.id) |
| email | text | User's email address |
| role | text | User role: 'admin', 'agent', or 'tenant' |
| first_name | text | User's first name |
| last_name | text | User's last name |
| full_name | text | Full name for display |
| agency | text | Agency name (for agents) |
| phone | text | Phone number |
| created_at | timestamp | Account creation timestamp |

**Important**: Enable Row Level Security (RLS) on the profiles table and create appropriate policies for user data access.

## 🌟 Features

- **Search & Filter**: Find properties by location, type, and features
- **Pet-Friendly Focus**: Highlight properties with pet amenities
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Sorting Options**: Sort by price, date, bedrooms
- **Modern UI**: Clean, accessible design with loading states
- **Authentication**: Agent sign-up and login system with role-based access
- **User Profiles**: Secure user data management with Supabase Auth

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

## 🔮 Future Enhancements

This starter is ready for extension with:

- **Advanced Authentication**: Tenant login, password reset, email verification
- **Property Management**: Add/edit listings dashboard for agents
- **Notifications**: Email alerts for new properties
- **Messaging**: Contact between tenants and agents
- **Favorites**: Save preferred properties
- **Advanced Filters**: Price range, pet size restrictions
- **Map Integration**: Location-based search
- **Photo Uploads**: Property image management
- **Admin Dashboard**: User management and system administration

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