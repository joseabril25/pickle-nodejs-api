import { PlayerResponseDto } from './dto/player.dto'

export interface AuthResponseDto {
  player: PlayerResponseDto;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  playerId: string;
  email: string;
  iat?: number;
  exp?: number;
}