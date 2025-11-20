import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Type } from '../enums/lesson_type.js'
import { Difficulty } from '../enums/difficulty.js'

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
}
