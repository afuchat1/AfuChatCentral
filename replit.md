# AfuChat - Social Commerce Platform

## Overview

AfuChat is a modern full-stack social commerce platform that combines social media features with e-commerce capabilities and AI assistance. Built as a mobile-first Progressive Web App (PWA), it provides users with a comprehensive social shopping experience including posts, stories, messaging, product marketplace, and AI-powered assistance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite for fast development and optimized builds
- **Design Pattern**: Mobile-first responsive design with desktop compatibility

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Real-time Communication**: WebSocket support for messaging

### Database Schema
- **Users**: Core user profiles with wallet functionality
- **Posts**: Social media posts with likes and comments
- **Stories**: Temporary content sharing
- **Messages**: Real-time messaging system with conversations
- **Products**: E-commerce product catalog
- **Comments**: Nested commenting system
- **Likes**: Social interactions tracking
- **Follows**: User relationship management

## Key Components

### Social Features
- **Feed System**: Infinite scroll feed with posts and sponsored content
- **Stories**: Instagram-style temporary content sharing
- **Messaging**: Real-time chat with WebSocket connections
- **Social Interactions**: Likes, comments, follows, and user discovery

### E-commerce Features
- **AfuMall**: Product marketplace with categories and search
- **Product Management**: Seller tools for product listing
- **Wallet System**: Built-in digital wallet for transactions
- **Reviews & Ratings**: Product feedback system

### AI Integration
- **AfuAI**: Conversational AI assistant
- **Product Recommendations**: AI-powered product discovery
- **Content Suggestions**: AI-assisted content creation
- **Search Enhancement**: Intelligent search capabilities

### Authentication & Security
- **Replit Auth Integration**: Seamless OAuth authentication
- **Session Management**: Secure session handling with PostgreSQL
- **Authorization Middleware**: Route protection and user verification
- **CSRF Protection**: Built-in security measures

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit OAuth → Session created → User profile synced
2. **Social Flow**: Create post → Store in database → Broadcast to followers → Real-time updates
3. **Messaging Flow**: Send message → WebSocket broadcast → Store in database → Deliver to recipient
4. **Commerce Flow**: Browse products → Add to cart → Process payment → Update inventory
5. **AI Flow**: User query → AI processing → Context-aware response → Action execution

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe SQL ORM
- **express**: Web application framework
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI & Styling
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **esbuild**: Fast bundling

## Deployment Strategy

### Development Environment
- **Platform**: Replit with automatic provisioning
- **Database**: Auto-provisioned PostgreSQL instance
- **Hot Reload**: Vite dev server with HMR
- **Environment**: NODE_ENV=development

### Production Build
- **Client Build**: Vite production build to `dist/public`
- **Server Build**: esbuild bundle to `dist/index.js`
- **Static Assets**: Served from Express static middleware
- **Database Migration**: Drizzle Kit schema synchronization

### Hosting Configuration
- **Runtime**: Node.js 20
- **Port**: 5000 (internal) → 80 (external)
- **Scaling**: Replit autoscale deployment
- **Session Storage**: PostgreSQL-backed sessions
- **File Uploads**: Handled via server endpoints

## Changelog

```
Changelog:
- June 21, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```