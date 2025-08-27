import { Request, Response } from 'express'
import { ApiResponse, asyncHandler } from '../../common/utils'
import { GamesService } from './games.service'
import { CreateGameDto, UpdateGameDto, CreatePlayerDto, UpdatePlayerDto } from '../../common/types/dto'

const gamesService = new GamesService()

export const createGame = asyncHandler(
  async (req: Request<{}, {}, CreateGameDto>, res: Response) => {
    const game = await gamesService.createGame(req.body)
    ApiResponse.success(res, game, 'Game created successfully', 201)
  }
)

export const getAllGames = asyncHandler(
  async (req: Request, res: Response) => {
    const games = await gamesService.getAllGames()
    ApiResponse.success(res, games, 'Games retrieved successfully')
  }
)

export const getGameById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const game = await gamesService.getGameById(req.params.id)
    ApiResponse.success(res, game, 'Game retrieved successfully')
  }
)

export const addPlayerToGame = asyncHandler(
  async (req: Request<{ id: string }, {}, CreatePlayerDto>, res: Response) => {
    const playerData = {
      ...req.body,
      game_id: req.params.id
    }
    const player = await gamesService.addPlayerToGame(playerData)
    ApiResponse.success(res, player, 'Player added to game successfully', 201)
  }
)

export const updatePlayerStatus = asyncHandler(
  async (req: Request<{ id: string; playerId: string }, {}, UpdatePlayerDto>, res: Response) => {
    const { id: gameId, playerId } = req.params
    const player = await gamesService.updatePlayerStatus(gameId, playerId, req.body)
    ApiResponse.success(res, player, 'Player status updated successfully')
  }
)