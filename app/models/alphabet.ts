import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import File from '#models/file'
import Audio from '#models/audio'
import Lesson from '#models/lesson'
import LessonAlphabet from '#models/lesson_alphabet'

export default class Alphabet extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public letter: string

  @column()
  declare public romanized: string

  @column()
  declare public description: string

  @column()
  declare public file_id: number | null

  @column()
  declare public audio_id: number | null

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @belongsTo(() => File, {
    foreignKey: 'file_id',
  })
  declare public file: BelongsTo<typeof File>

  @belongsTo(() => Audio, {
    foreignKey: 'audio_id',
  })
  declare public audio: BelongsTo<typeof Audio>

  @manyToMany(() => Lesson, {
    pivotTable: 'lesson_alphabets',
    pivotForeignKey: 'alphabet_id',
    pivotRelatedForeignKey: 'lesson_id',
  })
  declare public lessons: ManyToMany<typeof Lesson>

  @hasMany(() => LessonAlphabet, {
    foreignKey: 'alphabet_id',
  })
  declare public lessonAlphabets: HasMany<typeof LessonAlphabet>
}
