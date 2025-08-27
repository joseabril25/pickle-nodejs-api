import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import Game from './game'



@Table({
  tableName: 'players',
  timestamps: true,
})
export default class Player extends Model {
  @ForeignKey(() => Game)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  game_id!: number

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string

  @BelongsTo(() => Game)
  game!: Game
}