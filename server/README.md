# Creator Score System API

A robust backend API for calculating, tracking, and comparing Farcaster creator scores. This system provides powerful metrics to help creators understand their influence and engagement on the Farcaster network.

## ✅ Completed MVP Features

- **Creator Score Calculation**: Comprehensive scoring algorithm that considers engagement, consistency, growth, quality, and network factors
- **Neynar API Integration**: Fetching user metrics and profile data directly from Neynar
- **Score Components**: Calculation of individual components (engagement, consistency, growth, quality, network)
- **MongoDB Storage**: Storing creator profiles and scores with proper indexing
- **Background Processing**: Asynchronous job processing for score calculations
- **User Metrics API**: Endpoints to retrieve user metrics and trending casts
- **Percentile Ranking**: Dynamic percentile ranking based on all calculated scores
- **Tier Classification**: 6-tier system for categorizing creators by score

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
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

    ```bash
    npm install
    ```

2. Start development server:

    ```bash
    npm run dev
    ```

## API Endpoints

### Score Calculation (Implemented)

- `POST /api/score/calculate`: Calculate a creator's score
- `GET /api/score/:fid`: Get a specific creator's score
- `GET /api/score/share/:id`: Get a score by its shareable ID

### Metrics (Implemented)

- `GET /api/metrics/:fid`: Get metrics for a specific creator
- `GET /api/metrics/:fid/trending`: Get trending casts for a creator

### Test Endpoints (Development Only)

- `GET /api/test/test-neynar/:fid`: Get detailed metrics and user info for testing

### Coming Soon

- Leaderboards
- Challenges
- Loan waitlist management
- Webhook handlers

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
    npx mongosh "mongodb+srv://username:password@yourcluster.mongodb.net/somurie"

    # In MongoDB shell, create necessary collections
    db.createCollection('creators')
    db.createCollection('creatorScores')

    # To exit MongoDB shell
    exit
    ```

The application models will handle schema validation and indexing

## Example API Responses

### Score Calculation Request

```json
// POST /api/score/calculate
{
  "success": true,
  "processing": true,
  "message": "Score calculation is in progress. Please try again in a few seconds.",
  "jobId": "job-1755269060641-500916"
}
```

### Score Result

```json
// GET /api/score/500916
{
  "success": true,
  "data": {
    "components": {
      "engagement": 0,
      "consistency": 60,
      "growth": 65.56302500767288,
      "quality": 40,
      "network": 3.130434782608696
    },
    "_id": "689f47c5177bdf12f049ccf1",
    "creatorFid": 500916,
    "overallScore": 31,
    "percentileRank": 38,
    "tier": 1,
    "scoreDate": "2025-08-14T18:30:00.000Z",
    "validUntil": "2025-08-15T18:30:00.000Z",
    "shareableId": "pDLpeUjm3k",
    "createdAt": "2025-08-15T14:44:21.157Z",
    "updatedAt": "2025-08-15T14:44:21.157Z",
    "__v": 0,
    "username": "aryangodara",
    "followerCount": 36
  }
}
```

### User Metrics

```json
// GET /api/metrics/500916
{
  "fid": "500916",
  "metrics": {
    "followers": 36,
    "following": 115,
    "casts": 0,
    "reactions": 0,
    "replies": 0,
    "recasts": 0,
    "engagement_rate": 0,
    "last_updated": "2025-08-15T14:45:28.631Z"
  }
}
```

### Trending Casts

```json
// GET /api/metrics/500916/trending
{
  "fid": "500916",
  "trending_casts": []
}
```
