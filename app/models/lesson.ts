import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { Type } from '../enums/lesson_type.js'
import { Difficulty } from '../enums/difficulty.js'
import Exercise from '#models/exercise'
import Alphabet from '#models/alphabet'
import LessonAlphabet from '#models/lesson_alphabet'
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
  declare public level: Difficulty

  @column()
  declare public type: Type

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @hasMany(() => Exercise, {
    foreignKey: 'lesson_id',
  })
  declare public exercises: HasMany<typeof Exercise>

  @manyToMany(() => Alphabet, {
    pivotTable: 'lesson_alphabets',
    pivotForeignKey: 'lesson_id',
    pivotRelatedForeignKey: 'alphabet_id',
  })
  declare public alphabets: ManyToMany<typeof Alphabet>

  @hasMany(() => LessonAlphabet, {
    foreignKey: 'lesson_id',
  })
  declare public lessonAlphabets: HasMany<typeof LessonAlphabet>

  @hasMany(() => UserProgress, {
    foreignKey: 'lesson_id',
  })
  declare public userProgresses: HasMany<typeof UserProgress>

  @hasMany(() => UserExercise, {
    foreignKey: 'lesson_id',
  })
  declare public userExercises: HasMany<typeof UserExercise>
}
