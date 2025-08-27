import Game from '../../storage/models/game'
import Player from '../../storage/models/player'
import GamePlayer from '../../storage/models/gamePlayer'
import { CreateGameDto, UpdateGameDto, UpdatePlayerDto, GameResponseDto, PlayerResponseDto } from '../../common/types/dto'
import { AddMultiplePlayersDto, AddPlayerToGameDto } from '../../common/types/dto/gamePlayer.dto'
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
      include: [{
        model: Player,
        as: 'players'
      }],
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
        as: 'players'
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
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    }
  }

  async addPlayerToGame(gameId: string, playerData: AddPlayerToGameDto): Promise<PlayerResponseDto> {
    // Check if game exists
    const game = await Game.findByPk(gameId)
    if (!game) {
      throw createError(404, 'Game not found')
    }

    // Check if player already exists globally
    let player = await Player.findOne({ where: { email: playerData.email } })
    
    if (!player) {
      // Create new player if doesn't exist
      player = await Player.create({
        name: playerData.name,
        email: playerData.email,
        password: playerData.password
      })
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

    for (const playerData of playersData.players) {
      try {
        // Check if player already exists globally
        let player = await Player.findOne({ where: { email: playerData.email } })
        
        if (!player) {
          // Create new player if doesn't exist
          player = await Player.create({
            name: playerData.name,
            email: playerData.email,
            password: playerData.password
          })
        }

        // Check if player is already in this game
        const existingGamePlayer = await GamePlayer.findOne({
          where: {
            game_id: gameId,
            player_id: player.id
          }
        })

        if (existingGamePlayer) {
          errors.push(`Player with email ${playerData.email} already exists in this game`)
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
        errors.push(`Failed to add player ${playerData.email}: ${error}`)
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

  async updatePlayerStatus(gameId: string, playerId: string, updateData: UpdatePlayerDto): Promise<PlayerResponseDto> {
    // Check if game exists
    const game = await Game.findByPk(gameId)
    if (!game) {
      throw createError(404, 'Game not found')
    }

    // Find and update player
    const player = await Player.findOne({
      where: {
        id: playerId,
        game_id: gameId
      }
    })

    if (!player) {
      throw createError(404, 'Player not found in this game')
    }

    await player.update(updateData)

    return {
      id: player.id,
      name: player.name,
      email: player.email,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    }
  }
}