import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Lesson from '#models/lesson'
import Alphabet from '#models/alphabet'

export default class LessonAlphabet extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public lesson_id: number

  @column()
  declare public alphabet_id: number

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @belongsTo(() => Lesson, {
    foreignKey: 'lesson_id',
  })
  declare public lesson: BelongsTo<typeof Lesson>

  @belongsTo(() => Alphabet, {
    foreignKey: 'alphabet_id',
  })
  declare public alphabet: BelongsTo<typeof Alphabet>
}
