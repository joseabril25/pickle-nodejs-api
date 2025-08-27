import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeCreate, BeforeUpdate } from 'sequelize-typescript'
import * as bcrypt from 'bcryptjs'
import Game from './game'

@Table({
  tableName: 'players',
  timestamps: true,
})
export default class Player extends Model {
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

  // Hash password before creating or updating
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: Player) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10)
      instance.password = await bcrypt.hash(instance.password, salt)
    }
  }

  // Instance method to compare passwords
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
  }
}