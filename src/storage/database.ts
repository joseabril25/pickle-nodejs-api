import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
import path from 'path'
import logger from '../common/utils/logger'
import { Game, Player } from './models'

dotenv.config()

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'fonica_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? logger.info : false,
  models: [path.join(__dirname, 'models')],
  define: {
    timestamps: true,
    underscored: true,
  },
})

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    logger.info('✅ Database connection established successfully.')

    sequelize.addModels([
      Player,
      Game
    ]);
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