import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserExercise extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public exercise_id: number

  @column()
  declare public user_id: number

  @column()
  declare public lesson_id: number

  @column()
  declare public answer: string

  @column()
  declare public is_correct: boolean

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
