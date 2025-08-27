import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import Game from './game'
import Player from './player'

export enum PlayerGameStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

@Table({
  tableName: 'game_players',
  timestamps: true,
})
export default class GamePlayer extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @ForeignKey(() => Game)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  game_id!: string

  @ForeignKey(() => Player)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  player_id!: string

  @Column({
    type: DataType.ENUM(...Object.values(PlayerGameStatus)),
    allowNull: false,
    defaultValue: PlayerGameStatus.INVITED,
  })
  status!: PlayerGameStatus

  @BelongsTo(() => Game)
  game!: Game

  @BelongsTo(() => Player)
  player!: Player
}