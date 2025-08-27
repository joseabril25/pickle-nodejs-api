import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
import logger from '../common/utils/logger'
import Game from './models/game'
import Player from './models/player'

dotenv.config()

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'fonica_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? (sql: string) => logger.info(sql) : false,
  models: [Game, Player], // Explicitly add models here
  define: {
    timestamps: true,
    underscored: true,
  },
})

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    logger.info('✅ Database connection established successfully.')

    // Only sync in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      logger.info('✅ Database models synchronized.')
    }
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error)
    throw error
  }
}

export default sequelize