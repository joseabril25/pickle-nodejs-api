import { Router } from 'express'
import { 
  createGame, 
  getAllGames, 
  getGameById, 
  updateGame,
  deleteGame,
  addPlayerToGame,
  addMultiplePlayersToGame,
  updatePlayerStatus 
} from './games.controller'
import { ValidateDTO } from '../../common/middlewares/validation.middleware'
import { CreateGameDto, UpdateGameDto, UpdatePlayerDto } from '../../common/types/dto'
import { AddPlayerToGameDto, AddMultiplePlayersDto } from '../../common/types/dto/gamePlayer.dto'
import { AuthGuard } from '../../common/middlewares'

const router = Router()

// POST /api/games - Create a new game
router.post('/', 
  AuthGuard, 
  ValidateDTO(CreateGameDto), 
  createGame
)

// GET /api/games - List all scheduled games
router.get('/', 
  AuthGuard, 
  getAllGames
)

// GET /api/games/:id - Retrieve details of a single game
router.get('/:id', 
  AuthGuard, 
  getGameById
)

// PATCH /api/games/:id - Update a game
router.patch('/:id', 
  AuthGuard, 
  ValidateDTO(UpdateGameDto), 
  updateGame
)

// DELETE /api/games/:id - Delete a game
router.delete('/:id', 
  AuthGuard, 
  deleteGame
)

// POST /api/games/:id/players - Add a player to a game
router.post('/:id/players', 
  AuthGuard,  
  ValidateDTO(AddPlayerToGameDto), 
  addPlayerToGame
)

// POST /api/games/:id/players/multiple - Add multiple players to a game
router.post('/:id/players/multiple', 
  AuthGuard,  
  ValidateDTO(AddMultiplePlayersDto), 
  addMultiplePlayersToGame
)

// PATCH /api/games/:id/players/:playerId - Update player's invite status
router.patch('/:id/players/:playerId', 
  AuthGuard, 
  ValidateDTO(UpdatePlayerDto), 
  updatePlayerStatus
)

export { router as gamesRoutes }