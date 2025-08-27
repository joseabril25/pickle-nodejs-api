# Pickleball Planner API

A Node.js REST API built with TypeScript, Express, Sequelize, and PostgreSQL for managing games and player invitations.

## Features

- **Authentication**: JWT-based authentication with access/refresh tokens
- **Game Management**: Create, update, delete, and list games
- **Player Management**: Register players and manage game invitations
- **Player Status**: Track invitation status (invited, accepted, declined)
- **Docker Support**: Fully containerized with Docker Compose
- **TypeScript**: Type-safe development experience
- **Validation**: Request validation using class-validator
- **PostgreSQL**: Robust relational database with Sequelize ORM

## Tech Stack

- **Runtime**: Node.js v20
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize with sequelize-typescript
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator & class-transformer
- **Development**: Nodemon, ESLint, Prettier

## Prerequisites

- Node.js v20+ and npm
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd pickle-nodejs-api
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the application:
```bash
docker-compose up
```

The API will be available at `http://localhost:3000`

### Manual Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pickle-nodejs-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database and update `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fonica_db
DB_USER=postgres
DB_PASSWORD=yourpassword
```

4. Run database migrations:
```bash
npm run dev
# The database tables will be created automatically on first run
```

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fonica_db
DB_USER=postgres
DB_PASSWORD=postgres123
DB_DIALECT=postgres

# Environment
NODE_ENV=development

# Server
PORT=3000

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new player | No |
| POST | `/api/auth/login` | Login a player | No |
| GET | `/api/auth/me` | Get current player info | Yes |
| POST | `/api/auth/logout` | Logout player | Yes |

### Games Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/games` | List all games | Yes |
| GET | `/api/games/:id` | Get game details with players | Yes |
| POST | `/api/games` | Create a new game | Yes |
| PATCH | `/api/games/:id` | Update game details | Yes |
| DELETE | `/api/games/:id` | Delete a game | Yes |
| POST | `/api/games/:id/players` | Add player to game | Yes |
| POST | `/api/games/:id/players/multiple` | Add multiple players | Yes |
| PATCH | `/api/games/:id/players/:playerId` | Update player status | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API health check | No |

## Request/Response Examples

### Register Player
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Game
```json
POST /api/games
{
  "title": "Soccer Championship Final",
  "date": "2025-09-15T18:00:00Z",
  "location": "Central Stadium",
  "description": "Final match of the championship"
}
```

### Add Player to Game
```json
POST /api/games/:gameId/players
{
  "playerId": "uuid-of-existing-player"
}
```

### Update Player Status
```json
PATCH /api/games/:gameId/players/:playerId
{
  "status": "accepted"  // or "declined"
}
```

## Database Schema

### Players Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Games Table
- `id` (UUID, Primary Key)
- `title` (String)
- `date` (DateTime)
- `location` (String)
- `description` (Text, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### GamePlayers Table (Junction)
- `id` (UUID, Primary Key)
- `game_id` (UUID, Foreign Key)
- `player_id` (UUID, Foreign Key)
- `status` (Enum: 'invited', 'accepted', 'declined')
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Testing with Postman

A Postman collection is included in the `postman/` directory:

1. Import `Fonica-API.postman_collection.json` into Postman
2. Set the `base_url` variable to `http://localhost:3000`
3. Register a new player or login
4. The access token will be automatically set in cookies
5. Test the protected endpoints

## Scripts

```bash
# Development
npm run dev          # Start dev server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Docker
docker-compose up    # Start API + PostgreSQL
docker-compose down  # Stop all containers
docker-compose down -v  # Stop and remove volumes

# Linting
npm run lint         # Run ESLint
npm run format       # Run Prettier
```

## Project Structure

```
pickle-nodejs-api/
├── src/
│   ├── api/
│   │   ├── auth/         # Authentication endpoints
│   │   └── games/        # Games endpoints
│   ├── common/
│   │   ├── middlewares/  # Auth, validation, error handling
│   │   ├── types/        # TypeScript types and DTOs
│   │   └── utils/        # Utilities (JWT, logger, etc)
│   ├── storage/
│   │   ├── models/       # Sequelize models
│   │   └── database.ts   # Database connection
│   └── app.ts           # Express app setup
├── postman/             # Postman collection
├── .env                 # Environment variables
├── docker-compose.yml   # Docker setup
├── Dockerfile          # Container configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## Error Handling

The API uses consistent error responses:

```json
{
  "status": 400,
  "message": "Error message here",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment-based configuration
- Input validation on all endpoints
- SQL injection protection via Sequelize ORM

## Deployment

### Production Deployment with Traefik

For production deployment with Traefik reverse proxy:

1. **Use the production docker-compose file**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. **Update Traefik labels** in `docker-compose.prod.yml`:
- Replace `your.domain.com` with your actual domain
- Ensure Traefik network (`proxy`) exists on your server

3. **Environment variables**:
- Copy `.env.example` to `.env`
- Update production values (especially JWT secrets)

The production setup includes:
- PostgreSQL database (containerized)
- Automatic SSL/TLS via Traefik
- Health checks and auto-restart
- Persistent data volumes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

## Design Notes

### System Architecture Decisions

I implemented a many-to-many relationship between games and players through a junction table (`game_players`) rather than the simpler structure suggested in the spec. This provides better flexibility as players can participate in multiple games, and it cleanly separates player identity from game participation. I also added authentication as a bonus feature using JWT tokens for security.

### Expanding the System

### Repeatable Games

I will add a feature to allow users to create repeatable games, where the same game can be scheduled multiple times. This will involve:

- Add `recurrence_rule` field to games table (using RRULE format: "FREQ=WEEKLY;BYDAY=WE") to specify the repeat schedule.
- Creating and updating endpoints for managing repeatable games, including creating, updating, and deleting game instances.
- Creating a cron job to automatically create game instances based on the defined repeat interval.

## Group of Players

I will implement a feature that allows players to form groups for specific games. This will involve:

- Creating a new `PlayerGroup` model to manage group memberships.
- Updating the game invitation system to support inviting entire groups.
- Adding endpoints for creating, updating, and deleting player groups.

## Scaling Invite Status

I will create a service to send email invites to players when they are invited to a game. This will involve:

- Integrate SendGrid/AWS SES for transactional emails
- Use SQS with Redis for managing email sending jobs
- Email templates for invites and reminders
- Batch processing for bulk invites (100 emails/batch)
- Create a cron job to periodically check for pending invites and send reminder emails.
- Implement a retry mechanism for failed email sends.

### Shortcuts Taken (2-hour limit)

1. **No pagination** - Would implement cursor-based pagination for game lists
2. **No tests** - Would add comprehensive Jest test suites
3. **No caching** - Would add Redis for session and query caching
4. **Basic validation** - Would add business rules (max players, time conflicts)
5. **No API docs** - Would add Swagger/OpenAPI documentation, I included a postman collection though
6. **Simple error handling** - Would implement detailed error codes and logging