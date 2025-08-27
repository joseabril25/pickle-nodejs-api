import Game from '../../storage/models/game'
import Player from '../../storage/models/player'
import GamePlayer from '../../storage/models/gamePlayer'
import { CreateGameDto, UpdateGameDto, GameResponseDto, PlayerResponseDto } from '../../common/types/dto'
import { AddMultiplePlayersDto, AddPlayerToGameDto, UpdatePlayerStatusDto } from '../../common/types/dto/gamePlayer.dto'
import createError from 'http-errors'

export class GamesService {
  
  async createGame(gameData: CreateGameDto): Promise<GameResponseDto> {
    const game = await Game.create({
      title: gameData.title,
      date: new Date(gameData.date),
      location: gameData.location,
      description: gameData.description
    })

    return {
      id: game.id,
      title: game.title,
      date: game.date,
      location: game.location,
      description: game.description,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    }
  }

  async getAllGames(): Promise<GameResponseDto[]> {
    const games = await Game.findAll({
      order: [['date', 'ASC']]
    })

    return games.map(game => ({
      id: game.id,
      title: game.title,
      date: game.date,
      location: game.location,
      description: game.description,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    }))
  }

  async getGameById(gameId: string): Promise<GameResponseDto> {
    const game = await Game.findByPk(gameId, {
      include: [{
        model: Player,
        as: 'players',
        through: {
          attributes: ['status']
        }
      }]
    })

    if (!game) {
      throw createError(404, 'Game not found')
    }

    return {
      id: game.id,
      title: game.title,
      date: game.date,
      location: game.location,
      description: game.description,
      players: game.players?.map(player => ({
        id: player.id,
        name: player.name,
        email: player.email,
        status: (player as any).GamePlayer?.status,
        createdAt: player.createdAt,
        updatedAt: player.updatedAt
      })),
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    }
  }

  async addPlayerToGame(gameId: string, playerData: AddPlayerToGameDto): Promise<PlayerResponseDto> {
    // Check if game exists
    const game = await Game.findOne({
      where: {
        id: gameId
      }
    })
    if (!game) {
      throw createError(404, 'Game not found')
    }

    // Check if player exists
    const player = await Player.findByPk(playerData.playerId)
    if (!player) {
      throw createError(404, 'Player does not exist')
    }

    // Check if player is already in this game
    const existingGamePlayer = await GamePlayer.findOne({
      where: {
        game_id: gameId,
        player_id: player.id
      }
    })

    if (existingGamePlayer) {
      throw createError(409, 'Player already exists in this game')
    }

    // Add player to game with default status 'invited'
    await GamePlayer.create({
      game_id: gameId,
      player_id: player.id,
      status: 'invited'
    })

    return {
      id: player.id,
      name: player.name,
      email: player.email,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    }
  }

  async addMultiplePlayersToGame(gameId: string, playersData: AddMultiplePlayersDto): Promise<PlayerResponseDto[]> {
    // Check if game exists
    const game = await Game.findByPk(gameId)
    if (!game) {
      throw createError(404, 'Game not found')
    }

    const results: PlayerResponseDto[] = []
    const errors: string[] = []

    for (const playerId of playersData.playerIds) {
      try {
        // Check if player exists
        const player = await Player.findByPk(playerId)
        
        if (!player) {
          errors.push(`Player with ID ${playerId} does not exist`)
          continue
        }

        // Check if player is already in this game
        const existingGamePlayer = await GamePlayer.findOne({
          where: {
            game_id: gameId,
            player_id: player.id
          }
        })

        if (existingGamePlayer) {
          errors.push(`Player ${player.name} already exists in this game`)
          continue
        }

        // Add player to game with default status 'invited'
        await GamePlayer.create({
          game_id: gameId,
          player_id: player.id,
          status: 'invited'
        })

        results.push({
          id: player.id,
          name: player.name,
          email: player.email,
          createdAt: player.createdAt,
          updatedAt: player.updatedAt
        })
      } catch (error) {
        errors.push(`Failed to add player ${playerId}: ${error}`)
      }
    }

    // If we have errors but also successful additions, return partial success
    if (errors.length > 0 && results.length === 0) {
      throw createError(400, `Failed to add players: ${errors.join(', ')}`)
    }

    return results
  }

  async updateGame(gameId: string, updateData: UpdateGameDto): Promise<GameResponseDto> {
    const game = await Game.findByPk(gameId)
    if (!game) {
      throw createError(404, 'Game not found')
    }

    await game.update({
      title: updateData.title ?? game.title,
      date: updateData.date ? new Date(updateData.date) : game.date,
      location: updateData.location ?? game.location,
      description: updateData.description ?? game.description
    })

    return {
      id: game.id,
      title: game.title,
      date: game.date,
      location: game.location,
      description: game.description,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    }
  }

  async deleteGame(gameId: string): Promise<void> {
    const game = await Game.findByPk(gameId)
    if (!game) {
      throw createError(404, 'Game not found')
    }

    // Delete all game-player relationships first
    await GamePlayer.destroy({
      where: { game_id: gameId }
    })

    // Then delete the game
    await game.destroy()
  }

  async updatePlayerStatus(gameId: string, playerId: string, updateData: UpdatePlayerStatusDto): Promise<PlayerResponseDto> {
    // Check if game exists
    const game = await Game.findByPk(gameId)
    if (!game) {
      throw createError(404, 'Game not found')
    }

    // Check if player exists
    const player = await Player.findByPk(playerId)
    if (!player) {
      throw createError(404, 'Player not found')
    }

    // Find and update the game-player relationship
    const gamePlayer = await GamePlayer.findOne({
      where: {
        game_id: gameId,
        player_id: playerId
      }
    })

    if (!gamePlayer) {
      throw createError(404, 'Player not found in this game')
    }

    // Update the status in the junction table
    if (updateData.status) {
      await gamePlayer.update({
        status: updateData.status
      })
    }

    return {
      id: player.id,
      name: player.name,
      email: player.email,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    }
  }
}