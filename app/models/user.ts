import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import UserProgress from '#models/user_progress'
import UserExercise from '#models/user_exercise'
import Testimonial from './testimonial.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string

  @column()
  declare public email: string

  @column()
  declare public password: string

  @column()
  declare public role: string

  @column()
  declare public email_verified_at: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => UserProgress, {
    foreignKey: 'user_id',
  })
  declare public progressRecords: HasMany<typeof UserProgress>

  @hasMany(() => UserExercise, {
    foreignKey: 'user_id',
  })
  declare public exercises: HasMany<typeof UserExercise>

  @hasMany(() => Testimonial, {
    foreignKey: 'user_id',
  })
  declare public testimonial: HasMany<typeof Testimonial>
}
