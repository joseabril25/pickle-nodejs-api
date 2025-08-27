import { Request, Response } from 'express'
import { ApiResponse, asyncHandler } from '../../common/utils'
import { GamesService } from './games.service'
import { CreateGameDto, UpdateGameDto, UpdatePlayerDto } from '../../common/types/dto'
import { AddPlayerToGameDto, AddMultiplePlayersDto } from '../../common/types/dto/gamePlayer.dto'

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
  async (req: Request, res: Response) => {
    const gameId = req.params.id
    const game = await gamesService.getGameById(gameId)
    ApiResponse.success(res, game, 'Game retrieved successfully')
  }
)

export const addPlayerToGame = asyncHandler(
  async (req: Request, res: Response) => {
    const gameId = req.params.id
    const playerData = req.body as AddPlayerToGameDto
    const player = await gamesService.addPlayerToGame(gameId, playerData)
    ApiResponse.success(res, player, 'Player added to game successfully', 201)
  }
)

export const addMultiplePlayersToGame = asyncHandler(
  async (req: Request, res: Response) => {
    const gameId = req.params.id
    const playersData = req.body as AddMultiplePlayersDto
    const players = await gamesService.addMultiplePlayersToGame(gameId, playersData)
    ApiResponse.success(res, players, `${players.length} players added to game successfully`, 201)
  }
)

export const updateGame = asyncHandler(
  async (req: Request, res: Response) => {
    const gameId = req.params.id
    const updateData = req.body as UpdateGameDto
    const game = await gamesService.updateGame(gameId, updateData)
    ApiResponse.success(res, game, 'Game updated successfully')
  }
)

export const deleteGame = asyncHandler(
  async (req: Request, res: Response) => {
    const gameId = req.params.id
    await gamesService.deleteGame(gameId)
    ApiResponse.success(res, null, 'Game deleted successfully')
  }
)

export const updatePlayerStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: gameId, playerId } = req.params
    const updateData = req.body as UpdatePlayerDto
    const player = await gamesService.updatePlayerStatus(gameId, playerId, updateData)
    ApiResponse.success(res, player, 'Player status updated successfully')
  }
)