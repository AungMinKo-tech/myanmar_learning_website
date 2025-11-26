import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Alphabet from '#models/alphabet'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public file_path: string

  @column()
  declare public file_type: string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @hasMany(() => Alphabet, {
    foreignKey: 'file_id',
  })
  declare public alphabets: HasMany<typeof Alphabet>
}
