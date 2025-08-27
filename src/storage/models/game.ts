import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import Player from './player'

@Table({
  tableName: 'games',
  timestamps: true,
})
export default class Game extends Model {
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @HasMany(() => Player)
  players!: Player[]
}