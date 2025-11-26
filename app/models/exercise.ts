import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { Type } from '../enums/lesson_type.js'
import Lesson from '#models/lesson'
import UserExercise from '#models/user_exercise'

export default class Exercise extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public lesson_id: number

  @column()
  declare public question: string

  @column()
  declare public type: Type

  @column()
  declare public correct_answer: string

  @column()
  declare public choices: string[]

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @belongsTo(() => Lesson, {
    foreignKey: 'lesson_id',
  })
  declare public lesson: BelongsTo<typeof Lesson>

  @hasMany(() => UserExercise, {
    foreignKey: 'exercise_id',
  })
  declare public userExercises: HasMany<typeof UserExercise>
}
