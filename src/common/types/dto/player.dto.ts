import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator'
import { Expose, Exclude } from 'class-transformer'
import { BaseResponseDto } from './base.dto'

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  gameId!: string

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

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password?: string
}

export class PlayerResponseDto extends BaseResponseDto {
  @Expose()
  name!: string

  @Expose()
  email!: string

  @Exclude()
  password?: string
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  password!: string
}