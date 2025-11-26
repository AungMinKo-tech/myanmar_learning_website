import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash.make('Password123456'),
      role: 'user',
      email_verified_at: DateTime.fromJSDate(faker.date.past()),
    }
  })
  .build()
