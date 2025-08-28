# Polling App

A modern Next.js application for creating and voting on polls, built with TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

- **User Authentication**: Login and registration system
- **Poll Creation**: Create polls with multiple options
- **Voting System**: Vote on active polls
- **Real-time Results**: View poll results with progress bars
- **Dashboard**: User dashboard with statistics and recent polls
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

## Project Structure

```
alx_polly/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (dashboard)/             # Dashboard route group
│   │   └── dashboard/           # User dashboard
│   ├── polls/                   # Polls pages
│   │   ├── create/              # Create poll page
│   │   ├── [id]/                # Individual poll page
│   │   └── page.tsx             # Polls listing page
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   └── polls/               # Poll endpoints
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx       # Login form
│   │   └── register-form.tsx    # Registration form
│   ├── dashboard/               # Dashboard components
│   │   ├── create-poll-button.tsx
│   │   ├── dashboard-stats.tsx
│   │   └── recent-polls.tsx
│   ├── layout/                  # Layout components
│   │   └── dashboard-header.tsx
│   ├── polls/                   # Poll components
│   │   ├── create-poll-form.tsx
│   │   ├── poll-results.tsx
│   │   ├── poll-view.tsx
│   │   ├── polls-filter.tsx
│   │   └── polls-list.tsx
│   └── ui/                      # Shadcn UI components
├── lib/                         # Utility libraries
│   ├── auth/                    # Authentication utilities
│   │   └── auth-utils.ts
│   ├── db/                      # Database services
│   │   └── poll-service.ts
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   └── utils.ts                 # General utilities
└── public/                      # Static assets
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Key Features Implementation

### Authentication
- Login and registration forms with validation
- Form handling with React Hook Form and Zod
- Placeholder authentication service (ready for backend integration)

### Poll Management
- Create polls with multiple options (2-10 options)
- Dynamic form with add/remove options
- Poll listing with search and filtering
- Individual poll pages with voting interface

### Dashboard
- User statistics overview
- Recent polls display
- Quick actions for creating new polls

### API Routes
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/polls` - Get all polls / Create new poll
- `/api/polls/[id]` - Get specific poll / Submit vote

## Component Architecture

The app uses a modular component architecture:

- **Page Components**: Handle routing and layout
- **Feature Components**: Implement specific functionality (auth, polls, dashboard)
- **UI Components**: Reusable Shadcn UI components
- **Service Classes**: Handle business logic and data operations

## Styling

The app uses Tailwind CSS with:
- Custom color scheme
- Responsive design patterns
- Dark mode support
- Consistent spacing and typography

## Next Steps

To complete the application, you'll need to:

1. **Implement Backend Integration**:
   - Replace placeholder services with actual database operations
   - Add proper authentication (NextAuth.js, Auth0, or custom solution)
   - Implement session management

2. **Add Database**:
   - Set up PostgreSQL, MongoDB, or your preferred database
   - Create database schemas for users, polls, and votes
   - Implement data persistence

3. **Enhance Features**:
   - Add poll categories and tags
   - Implement poll sharing and social features
   - Add real-time updates with WebSockets
   - Create admin dashboard for poll management

4. **Security & Performance**:
   - Add rate limiting
   - Implement proper error handling
   - Add loading states and optimistic updates
   - Optimize for performance

## Contributing

This is a scaffolded project ready for development. Feel free to modify and extend the functionality according to your needs.

## License

This project is open source and available under the MIT License.
