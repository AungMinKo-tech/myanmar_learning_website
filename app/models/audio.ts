import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Alphabet from '#models/alphabet'

export default class Audio extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare audio_path: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Alphabet, {
    foreignKey: 'audio_id',
  })
  declare alphabets: HasMany<typeof Alphabet>
}
