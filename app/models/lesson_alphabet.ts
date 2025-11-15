import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
