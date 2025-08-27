# Fonica API - Postman Collection

This folder contains a complete Postman collection for testing the Fonica API endpoints.

## Files

- `Fonica-API.postman_collection.json` - Complete Postman collection with all endpoints
- `sample-data.json` - Sample data for testing API endpoints
- `README.md` - This file

## Setup Instructions

### 1. Import Collection
1. Open Postman
2. Click **Import** button
3. Select `Fonica-API.postman_collection.json`
4. Collection will be imported with all endpoints organized in folders

### 2. Environment Variables
The collection uses these variables (automatically configured):
- `base_url` - API base URL (default: `http://localhost:3000`)
- `access_token` - JWT token (set after login)
- `game_id` - Game UUID (copy from create game response)
- `player_id` - Player UUID (copy from create player response)

### 3. Testing Workflow

#### Step 1: Start Server
```bash
npm run dev
```

#### Step 2: Create a Game
1. Run **"Create Game"** request
2. Copy the `id` from response
3. Set it as `game_id` variable in Postman

#### Step 3: Register/Login
1. Run **"Register Player"** request (use `game_id` variable)
2. Or run **"Login Player"** with existing credentials
3. Copy `accessToken` from response
4. Set it as `access_token` variable

#### Step 4: Test Other Endpoints
Now you can test all other endpoints that require authentication.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new player
- `POST /api/auth/login` - Login player
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout player

### Games Management
- `POST /api/games` - Create new game
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `PATCH /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

### Player Management
- `POST /api/games/:id/players` - Add single player to game
- `POST /api/games/:id/players/multiple` - Add multiple players to game
- `PATCH /api/games/:id/players/:playerId` - Update player status

### Health Check
- `GET /health` - API health check

## Sample Data

The `sample-data.json` file contains:
- **Games**: Sample game data with different sports
- **Players**: Test player accounts
- **Multiple Players**: Bulk player creation examples
- **Game Updates**: Examples for PATCH operations
- **Player Status**: Status update examples (invited, accepted, declined)
- **Test Credentials**: Pre-defined admin and test accounts

## Player Status Values
- `invited` - Player invited to game (default)
- `accepted` - Player accepted invitation
- `declined` - Player declined invitation

## Authentication Flow
1. Create a game first (to get game_id)
2. Register with that game_id OR login with existing account
3. Use the returned access_token for subsequent requests

## Tips
- Always check response data to get IDs for subsequent requests
- Use the collection variables to avoid copying/pasting IDs
- The database resets with `force: true` - you'll need to recreate data after server restart
- All authenticated endpoints require the `Authorization: Bearer <token>` header

## Common Issues
- **401 Unauthorized**: Make sure you've set the `access_token` variable
- **404 Game not found**: Verify the `game_id` variable is set correctly
- **409 Player already exists**: Use different email or check existing players

## Environment Setup
For different environments, create Postman environments with these variables:
- **Development**: `base_url = http://localhost:3000`
- **Staging**: `base_url = https://api-staging.fonica.com`
- **Production**: `base_url = https://api.fonica.com`