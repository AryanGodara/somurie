# Creator Score System API

A robust backend API for calculating, tracking, and comparing Farcaster creator scores. This system provides powerful metrics to help creators understand their influence and engagement on the Farcaster network.

## Features

- **Creator Score Calculation**: Comprehensive scoring algorithm that considers engagement, consistency, growth, quality, and network factors.
- **Personalized Leaderboards**: Compare yourself with top creators or friends.
- **Loan Terms**: Tiered loan offerings based on creator score.
- **Waitlist Management**: Join the waitlist for early access.
- **Real-time Updates**: Webhook integration with Neynar for up-to-date metrics.

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=4000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://aryangodara03:HttOSKgzH6T3x6ui@cluster0.8sf3vwr.mongodb.net/somurie?retryWrites=true&w=majority

# Neynar
NEYNAR_API_KEY=your_neynar_api_key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://somurie.vercel.app
```

## Installation

1. Install dependencies:
```
npm install
```

2. Start development server:
```
npm run dev
```

## API Endpoints

### Score Calculation

- `POST /api/score/calculate`: Calculate a creator's score
- `GET /api/score/:fid`: Get a specific creator's score
- `GET /api/score/share/:id`: Get a score by its shareable ID

### Leaderboards

- `GET /api/leaderboard/all`: Get overall leaderboard
- `GET /api/leaderboard/weekly`: Get weekly leaderboard
- `GET /api/leaderboard/friends?fid=123`: Get friends leaderboard

### Challenges

- `POST /api/challenge`: Send a challenge to another creator
- `GET /api/challenge/history/:fid`: Get challenge history for a creator

### Waitlist

- `POST /api/waitlist`: Join the loan waitlist
- `GET /api/waitlist/status/:fid`: Check waitlist status

### Webhooks

- `POST /api/webhooks/neynar`: Webhook handler for Neynar events

## Dependencies

- MongoDB (Atlas): For data persistence and leaderboard storage
- Neynar API: For Farcaster data

## Development

- TypeScript for type safety
- Modular architecture with separation of concerns
- Comprehensive error handling
- Rate limiting for API calls

## MongoDB Setup

1. The application will automatically connect to the MongoDB cluster when started
2. For a fresh setup, the application will create the necessary collections as needed
3. To manually set up MongoDB collections, run the following commands:

```bash
# Start MongoDB shell (ensure you have mongosh installed)
npx mongosh "mongodb+srv://aryangodara03:HttOSKgzH6T3x6ui@cluster0.8sf3vwr.mongodb.net/somurie"

# In MongoDB shell, create necessary collections
db.createCollection('creators')
db.createCollection('creatorScores')
db.createCollection('challenges')
db.createCollection('waitlist')

# To exit MongoDB shell
exit
```

The application models will handle schema validation and indexing
