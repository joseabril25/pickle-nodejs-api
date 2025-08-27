import { JwtUtils } from "../../common/utils";
import Player from "../../storage/models/player";
import { CreatePlayerDto, LoginDto, PlayerResponseDto } from "../../common/types/dto";
import createError from 'http-errors';
import { AuthResponseDto } from "../../common/types/auth.types";

export class AuthService {
  
  async register(playerData: CreatePlayerDto): Promise<AuthResponseDto> {
    // Check if player exists
    const existingPlayer = await Player.findOne({ where: { email: playerData.email } });
    if (existingPlayer) {
      throw createError(409, 'Player already exists');
    }

    // Create player (password will be auto-hashed by model hook)
    const player = await Player.create({
      game_id: playerData.gameId,
      name: playerData.name,
      email: playerData.email,
      password: playerData.password
    });
    
    // Generate tokens
    const accessToken = JwtUtils.generateAccessToken(player.id, player.email);
    const refreshToken = JwtUtils.generateRefreshToken();

    // Build PlayerResponseDto
    const playerResponse: PlayerResponseDto = {
      id: player.id,
      name: player.name,
      email: player.email,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    };

    return {
      player: playerResponse,
      accessToken,
      refreshToken
    };
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    // Find player
    const player = await Player.findOne({ where: { email: loginData.email } });
    if (!player) {
      throw createError(401, 'Invalid credentials');
    }

    // Compare hashed password
    const isValidPassword = await player.comparePassword(loginData.password);
    if (!isValidPassword) {
      throw createError(401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = JwtUtils.generateAccessToken(player.id, player.email);
    const refreshToken = JwtUtils.generateRefreshToken();

    // Build PlayerResponseDto
    const playerResponse: PlayerResponseDto = {
      id: player.id,
      name: player.name,
      email: player.email,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    };

    return {
      player: playerResponse,
      accessToken,
      refreshToken
    };
  }

  async logout(refreshToken: string): Promise<void> {
    console.log("🚀 ~ AuthService ~ logout ~ refreshToken:", refreshToken)
    // TODO: Implement refresh token invalidation
    // For now, just return success
    return;
  }

  async refreshToken(oldRefreshToken: string): Promise<Omit<AuthResponseDto, 'player'>> {
    console.log("🚀 ~ AuthService ~ refreshToken ~ oldRefreshToken:", oldRefreshToken)
    // TODO: Implement proper refresh token logic
    // For now, return new tokens
    const accessToken = 'new-access-token';
    const refreshToken = 'new-refresh-token';

    return {
      accessToken,
      refreshToken
    };
  }

  async getCurrentUser(playerId: string): Promise<PlayerResponseDto> {
    const player = await Player.findByPk(playerId);
    if (!player) {
      throw createError(404, 'Player not found');
    }

    return {
      id: player.id,
      name: player.name,
      email: player.email,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    };
  }
}