# Document-QA Application

## Overview
Document-QA is a Next.js application designed for efficient document management and Q&A functionality. The application enables users to manage documents, interact with a Q&A interface, and provides administrative capabilities.

## Project Structure
```
├── src/
│   ├── app/                 # Next.js app directory (Pages & Routes)
│   │   ├── documents/       # Document management pages
│   │   ├── login/          # Authentication pages
│   │   ├── qa/             # Q&A interface pages
│   │   ├── register/       # User registration pages
│   │   └── upload/         # File upload functionality
│   ├── components/         # Reusable React components
│   │   ├── Navigation/     # Navigation components
│   │   ├── admin/         # Admin-specific components
│   │   ├── auth/          # Authentication components
│   │   ├── documents/     # Document-related components
│   │   └── qa/            # Q&A interface components
│   ├── contexts/          # React Context providers
│   ├── services/          # API and business logic services
│   ├── test-utils/        # Testing utilities
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── e2e/                   # End-to-end tests
```

## Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

## Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd document-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory and add necessary environment variables.

4. **Run the development server**
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Features

- **Document Management**
  - Upload and organize documents
  - View and search documents
  - Document version control

- **Q&A Interface**
  - Ask questions about documents
  - Get AI-powered answers
  - Search through previous Q&A

- **User Management**
  - User registration and authentication
  - Role-based access control
  - User profile management

## Technical Documentation

### Architecture

- **Frontend Architecture**
  - Next.js 13+ with App Router for server-side rendering and routing
  - React Server Components for optimal performance
  - Client-side components for interactive features

- **State Management**
  - React Context API for global state (AuthContext)
  - Server-side state management with Next.js Cache
  - Client-side state with React hooks

### API Specifications

- **RESTful Endpoints**
  - `/api/documents`: Document management operations
  - `/api/qa`: Q&A interface endpoints
  - `/api/auth`: Authentication endpoints

- **Authentication Flow**
  - JWT-based authentication
  - Secure session management
  - Role-based access control (RBAC)

### Data Flow

1. **Document Processing**
   - Upload → Processing → Storage → Indexing
   - Version control system for document changes
   - Real-time updates using WebSocket

2. **Q&A System**
   - Question input → Document analysis → AI processing → Response
   - Caching layer for frequent queries
   - Async processing for long-running operations

### Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Static page generation where applicable
- API route caching strategies

## Testing

The application includes both unit tests and end-to-end tests:

- **Unit Tests (Jest + React Testing Library)**
  - Component testing
  - Service layer testing
  - Context testing
  - Mock service implementations

- **E2E Tests (Playwright)**
  - User flow testing
  - Authentication scenarios
  - Document management workflows
  - Q&A interface interactions

## Deployment

### Production Build

1. Create a production build:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```
