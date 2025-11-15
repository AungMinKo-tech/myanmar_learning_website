import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string | null

  @column()
  declare public email: string

  @column({ serializeAs: null })
  declare public password: string

  @column()
  declare public role: string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
