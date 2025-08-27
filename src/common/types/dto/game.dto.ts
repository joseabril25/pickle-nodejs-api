import { IsString, IsNotEmpty, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { BaseResponseDto } from './base.dto'

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string

  @IsNotEmpty()
  @IsDateString()
  date!: string

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  location!: string

  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string

  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  location?: string

  @IsOptional()
  @IsString()
  description?: string
}

export class GameResponseDto extends BaseResponseDto {
  @Expose()
  title!: string

  @Expose()
  @Type(() => Date)
  date!: Date

  @Expose()
  location!: string

  @Expose()
  description?: string
}