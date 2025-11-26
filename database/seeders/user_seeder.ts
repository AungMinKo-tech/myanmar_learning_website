import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash.make('Password123456'),
        role: 'admin',
        email_verified_at: DateTime.now(),
      },
      {
        name: 'Jame Doe',
        email: 'jamedoe@example.com',
        password: await hash.make('Password123456'),
        role: 'admin',
        email_verified_at: null,
      },
    ])

    await UserFactory.createMany(10)
  }
}
