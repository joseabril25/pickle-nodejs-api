import { IsArray, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator'
import { PlayerGameStatus } from '../../../storage/models/gamePlayer'

export class AddPlayerToGameDto {
  @IsNotEmpty()
  @IsString()
  playerId!: string
}

export class AddMultiplePlayersDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  playerIds!: string[]
}

export class UpdatePlayerStatusDto {
  @IsOptional()
  @IsEnum(PlayerGameStatus)
  status?: PlayerGameStatus
}