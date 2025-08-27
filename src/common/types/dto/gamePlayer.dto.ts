import { IsArray, IsNotEmpty, IsString, IsEmail, ValidateNested, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { PlayerGameStatus } from '../../../storage/models/gamePlayer'

export class AddPlayerToGameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email!: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string
}

export class AddMultiplePlayersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddPlayerToGameDto)
  players!: AddPlayerToGameDto[]
}

export class UpdatePlayerStatusDto {
  @IsOptional()
  @IsEnum(PlayerGameStatus)
  status?: PlayerGameStatus
}