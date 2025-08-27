import { Expose } from 'class-transformer'

export abstract class BaseResponseDto {
  @Expose()
  id!: string

  @Expose()
  createdAt!: Date

  @Expose()
  updatedAt!: Date
}