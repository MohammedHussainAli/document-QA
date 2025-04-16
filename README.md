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

## Testing

The application includes both unit tests and end-to-end tests:

- Unit tests are written using Jest and React Testing Library
- E2E tests are implemented using Playwright

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

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to a Git repository
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy and get your application URL

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
