import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Difficulty } from '../enums/difficulty.js'

export default class Exercise extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public lesson_id: number

  @column()
  declare public question: string

  @column()
  declare public type: Difficulty

  @column()
  declare public correct_answer: string

  @column()
  declare public choices: string[]

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
