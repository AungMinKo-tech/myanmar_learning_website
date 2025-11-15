import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserProgress extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public user_id: number

  @column()
  declare public lesson_id: number

  @column()
  declare public progress_percent: string

  @column()
  declare public is_completed: boolean

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
