# Business News Pro Application

A modern news application built with Next.js, Prisma, and multiple API integrations for fetching and analyzing news content.

- Version: 1.0.0
- Author: Chen Shiyang (@ChenFangFangFang)
- Connect with me: [LinkedIn](www.linkedin.com/in/shiyangchen0430)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn package manager

## Key Features

- AI-Powered News Analysis: Intelligent summarization using OpenAI
- Real-time News Updates: Integration with NewsAPI
- User Authentication: Secure JWT-based authentication system
- Custom News Filters: Personalized news feed based on user preferences
- Responsive Design: Optimized for all device sizes
- Database Integration: Robust data management with Prisma ORM

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://[username]:[password]@[host]:[port]/[database]"

# Authentication
JWT_SECRET="your_secure_jwt_secret"

# API Keys
NEWS_API_KEY="your_news_api_key"
NEWAS_BASE_URL='https://newsapi.org/v2'
OPENAI_API_KEY="your_openai_api_key"

```

Important: Replace all placeholder values with your actual credentials.

## Project Structure

```
business-news-pro/
├── .next/                  # Next.js build output
├── prisma/
│   ├── migrations/        # Database migrations
│   └── schema.prisma     # Database schema
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   │   ├── allnews/  # News fetching endpoints
│   │   │   ├── auth/     # Authentication endpoints
│   │   │   └── summary/  # AI summarization endpoints
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript definitions
├── public/              # Static assets
└── package.json
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ChenFangFangFang/newsApp
cd newsApp
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma migrate dev
```

## Running the Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Access the application at `http://localhost:3001`

## Features

- News article fetching and display
- User authentication
- News content summarization using OpenAI
- Responsive layout
- Database integration with Prisma
- API integration with News API

## Development Notes

- The project uses TypeScript for type safety
- Prisma is used as the ORM for database operations
- Next.js handles routing and API endpoints
- Authentication is implemented using JWT

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Regularly update your dependencies
- Follow security best practices for handling API keys and sensitive data
