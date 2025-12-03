import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { Difficulty } from '../enums/difficulty.js'
import Exercise from '#models/exercise'
import UserProgress from '#models/user_progress'
import UserExercise from '#models/user_exercise'

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public title: string

  @column()
  declare public description: string

  @column()
  declare public chapter: string

  @column()
  declare public level: Difficulty

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @hasMany(() => Exercise, {
    foreignKey: 'lesson_id',
  })
  declare public exercises: HasMany<typeof Exercise>

  @hasMany(() => UserProgress, {
    foreignKey: 'lesson_id',
  })
  declare public userProgresses: HasMany<typeof UserProgress>

  @hasMany(() => UserExercise, {
    foreignKey: 'lesson_id',
  })
  declare public userExercises: HasMany<typeof UserExercise>
}
