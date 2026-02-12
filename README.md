# ProFootball - Live Match Center

A real-time football match center built with Next.js 14, featuring live match updates, statistics, and chat functionality.

## Features

- **Match Dashboard**: View all matches with real-time score updates
- **Live Indicators**: Visual distinction for live, upcoming, and finished matches
- **Match Detail View**: Comprehensive match information including:
  - Real-time score updates
  - Match timeline with events (goals, cards, substitutions)
  - Live match statistics
  - Interactive chat room
- **Real-time Chat**: Match-specific chat rooms with:
  - User identity management
  - Typing indicators
  - Message history
  - 500 character limit per message
- **Connection Handling**:
  - Automatic reconnection on connection loss
  - Visual connection status indicator
  - Proper cleanup on navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **UI Components**: shadcn/ui

## Project Structure

```
profootball/
├── app/                      # Next.js app router pages
│   ├── match/[id]/          # Match detail page
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (dashboard)
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── providers/           # Context providers
│   ├── MatchCard.tsx        # Match card component
│   ├── MatchStats.tsx       # Statistics display
│   ├── MatchTimeline.tsx    # Event timeline
│   ├── MatchChat.tsx        # Chat component
│   └── ConnectionStatus.tsx # Connection indicator
├── context/                 # React contexts
│   └── SocketContext.tsx    # Socket.IO context
├── hooks/                   # Custom React hooks
│   └── useMatches.ts        # Match data hooks
├── api/                     # API interaction layer
│   └── matches.ts           # Match API functions
├── store/                   # Zustand stores
│   └── userStore.ts         # User state management
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
└── lib/                     # Utilities
    ├── axios.ts             # Axios instance
    └── utils.ts             # Helper functions
```

## Architecture Decisions

### Separation of Concerns

1. **API Layer**: All API calls are centralized in the `api/` folder
2. **Hooks Layer**: React Query hooks in `hooks/` folder consume API functions
3. **State Management**:
   - Server state: TanStack Query
   - Real-time state: Socket.IO + React state
   - Persistent user state: Zustand with localStorage persistence
4. **Component Structure**: Clear separation between UI components and business logic

### Real-time Architecture

- **Socket.IO Context**: Centralized socket management with automatic reconnection
- **Event Subscriptions**: Match-specific subscriptions with proper cleanup
- **State Synchronization**: Combines initial API data with real-time socket updates
- **Connection Resilience**:
  - Automatic reconnection with exponential backoff
  - Visual connection status
  - Event resubscription on reconnect

### Performance Optimizations

- **React Query Caching**: Reduces unnecessary API calls
- **Optimistic Updates**: Socket events update UI immediately
- **Selective Rendering**: Components only re-render when their data changes
- **Proper Cleanup**: Socket listeners and subscriptions cleaned up on unmount

### Trade-offs

1. **Local User Management vs Backend Auth**
   - Chose localStorage-based user management for simplicity
   - Trade-off: No persistent user history across devices
   - Benefit: Faster implementation, no auth complexity

2. **Polling + WebSocket vs Pure WebSocket**
   - Used React Query polling as fallback for HTTP endpoints
   - Trade-off: Some redundant requests
   - Benefit: Resilience if WebSocket connection fails

3. **Client-side Routing vs Server Components**
   - Used client components for real-time features
   - Trade-off: Less SEO optimization
   - Benefit: Better real-time UX, simpler state management

4. **In-memory Chat History vs Persistent Storage**
   - Chat messages stored in component state
   - Trade-off: Messages lost on page refresh
   - Benefit: Simpler implementation, no backend changes needed

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Build

```bash
npm run build
npm start
```

## API Integration

The application integrates with the backend API at:

- Base URL: `https://profootball.srv883830.hstgr.cloud`
- REST Endpoints: `/api/matches`, `/api/matches/live`, `/api/matches/:id`
- WebSocket: Socket.IO connection to the same base URL

## Environment Variables

No environment variables required - all configuration is in the codebase.

## Future Enhancements

- User authentication and persistent profiles
- Chat message persistence
- Push notifications for goals
- Match predictions and analytics
- Social features (user profiles, followers)
- Mobile app version
- Video highlights integration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
