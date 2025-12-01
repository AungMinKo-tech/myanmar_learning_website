import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Exercise from '#models/exercise'
import User from '#models/user'
import Lesson from '#models/lesson'

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

  @column()
  declare public is_completed: boolean

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @belongsTo(() => Exercise, {
    foreignKey: 'exercise_id',
  })
  declare public exercise: BelongsTo<typeof Exercise>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare public user: BelongsTo<typeof User>

  @belongsTo(() => Lesson, {
    foreignKey: 'lesson_id',
  })
  declare public lesson: BelongsTo<typeof Lesson>
}
